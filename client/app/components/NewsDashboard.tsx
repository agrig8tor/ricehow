// frontend
"use client";

import { useState, useEffect } from 'react';
// We no longer need to import the supabase client here!

// The data structure definition remains the same. It's our contract
// with the backend API route.
type AgriNewsData = {
  id: number;
  created_at: string;
  headline: string;
  summary: string | null;
  source_text: string;
  published_date: string;
  source_url: string | null;
  country: string | null;
  category: string;
};

// Helper function is unchanged
function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default function NewsDashboard() {
  const [articles, setArticles] = useState<AgriNewsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 
  useEffect(() => {
    const fetchArticlesFromApi = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Fetch data from our OWN backend API route, not directly from Supabase.
        const response = await fetch('/api/news.js');

        // 2. Check if the request was successful
        if (!response.ok) {
          throw new Error('Failed to fetch news from the server.');
        }

        // 3. Parse the JSON data from the response
        const data: AgriNewsData[] = await response.json();
        setArticles(data);

      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticlesFromApi();
  }, []);
  if (isLoading) {
    return <p className="text-center p-8">Loading news...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  }
  return (
    <section className="w-full p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Latest Agriculture News
      </h2>
      
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No news articles found. The table might be empty.
        </p>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg p-4">
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {article.category}
              </span>
              <h3 className="text-lg font-semibold mt-2">{article.headline}</h3>
              <p className="text-gray-600 mt-1">{article.summary}</p>
              <div className="text-sm text-gray-500 mt-3">
                <span>{article.source_text}</span> &bull; <span>{formatDate(article.published_date)}</span>
              </div>
              {article.source_url && (
                <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                  Read More &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}