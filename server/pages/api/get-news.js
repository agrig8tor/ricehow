import { createClient } from '@supabase/supabase-js';

// Initialize the secure, server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // Fetch all data from the agri_news table, ordered by newest first
    const { data, error } = await supabase
      .from('agri_news')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      throw error; // Let the catch block handle Supabase errors
    }

    // Send the fetched data back to the frontend
    res.status(200).json(data);

  } catch (error) {
    console.error("Error fetching from agri_news:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
