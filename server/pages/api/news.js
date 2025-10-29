import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseKey) throw new Error("Missing env var: SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    console.error("Missing GNEWS_API_KEY environment variable!");
    return res.status(500).json({ message: 'Server configuration error: Missing GNews API Key' });
  }

  const countries = 'kh,th,id,vn,in';
  const keywords = 'rice';
  const gnewsApiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keywords)}&country=${countries}&lang=en&apikey=${apiKey}`;

  try {
    console.log(`[${new Date().toISOString()}] Fetching news from GNews...`);
    const response = await axios.get(gnewsApiUrl);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      console.log(`[${new Date().toISOString()}] No new articles found from GNews.`);
      return res.status(200).json({ message: "No new articles found from GNews." });
    }
    console.log(`[${new Date().toISOString()}] Found ${articles.length} potential articles.`);

    const newsToStore = articles.map((article, index) => {
      if (!article?.title || !article?.source || !article?.publishedAt || !article?.url) {
        console.warn(`[${new Date().toISOString()}] Skipping invalid article at index ${index}`);
        return null;
      }
      try {
        return {
          headline: article.title,
          summary: article.description || null,
          source_text: article.source.name || 'Unknown Source',
          published_date: article.publishedAt,
          source_url: article.url,
          country: article.source.country || null,
          category: 'Policy and Agriculture'
          
        };
      } catch (mapError) {
        console.error(`[${new Date().toISOString()}] Error mapping article at index ${index}:`, mapError.message);
        return null;
      }
    }).filter(Boolean); // <-- THE FIX IS HERE. This must be 'Boolean'.

    if (newsToStore.length === 0) {
      console.log(`[${new Date().toISOString()}] No valid articles to store after mapping.`);
      return res.status(200).json({ message: "No valid articles to store after processing." });
    }

    console.log(`[${new Date().toISOString()}] Attempting to upsert ${newsToStore.length} articles...`);
    const { data, error: upsertError } = await supabase
        .from('agri_news')
        .upsert(newsToStore, { onConflict: 'source_url' });

    if (upsertError) {
      // Throw a real error so the catch block runs
      throw new Error(`Supabase upsert error: ${upsertError.message}`);
    } 
    
    console.log(`[${new Date().toISOString()}] Supabase upsert operation completed.`);
    res.status(200).json({ message: `Successfully upserted ${newsToStore.length} articles.` });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Critical Error in API route:`, error.message);
    // Send the specific error message back
    res.status(500).json({ message: 'Error in API route', error: error.message });
  }
}
