import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;
  const countries = 'kh,th,id,vn,in';
  const combinedKeywords = 'weather AND rice';
  
  const gnewsApiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(combinedKeywords)}&country=${countries}&lang=en&apikey=${apiKey}`;

  try {
    const response = await axios.get(gnewsApiUrl);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return res.status(200).json({ message: "No new weather articles found from GNews." });
    }

    const reportsToStore = articles.map(article => ({
      id: number,
      created_at: string,
      headline: article.title,
      summary: article.description,
      source_text: article.source.name,
      published_date: article.publishedAt,
      source_url: article.url,
      country: article.source.country,
      category: string,
  // 'created_at' and 'category' are handled by database defaults
}));
    // --- UPDATED LOGIC ---
    // Use upsert() on the 'weather_reports' table
    const { data, error } = await supabase
      .from('weather_reports')
      .upsert(reportsToStore, { onConflict: 'source_url' });

    if (error) {
      throw new Error(`Supabase upsert error: ${error.message}`);
    }
    // ---------------------

    res.status(200).json({ message: `Successfully upserted ${reportsToStore.length} weather reports.` });

  } catch (error) {
    console.error("Error in weather API route:", error.message);
    res.status(500).json({ message: 'Error fetching or storing weather reports', error: error.message });
  }
}