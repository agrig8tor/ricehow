"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head'; 
import ArticleCard from '@/client/app/components/ArticleCard'; 

// Define the data structure matching the 'agri_news' table
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


const tabs = [
    { name: 'All', countryCode: 'all' },
    { name: 'Thailand', countryCode: 'th' },
    { name: 'Vietnam', countryCode: 'vn' },
    { name: 'Indonesia', countryCode: 'id' },
    { name: 'Cambodia', countryCode: 'kh' },
    { name: 'India', countryCode: 'in' },
];

export default function NewsPage() {
  const [allArticles, setAllArticles] = useState<AgriNewsData[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<AgriNewsData[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all articles from the /api/get-news API route
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/get-news'); // Calls the correct backend reader
        if (!response.ok) throw new Error('Failed to fetch news');
        const data: AgriNewsData[] = await response.json();
        setAllArticles(data);
        setFilteredArticles(data); // Show all initially
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filter articles when the active tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredArticles(allArticles);
    } else {
      setFilteredArticles(allArticles.filter(a => a.country === activeTab));
    }
  }, [activeTab, allArticles]);

  return (
    <> 
    <Head> 
        <title> Agricultural News Dashboard  </title>
    </Head>
    {/* Outer light grey background */}
      <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
        {/* Big white background tab */}
        <div className="container mx-auto max-w-5xl bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">
            Agriculture News Dashboard
          </h1>

          {/* --- TABS --- */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.countryCode)}
                  className={`whitespace-nowrap py-1 px-3 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none
                    ${
                      activeTab === tab.countryCode
                        ? 'bg-green-100 text-green-700 font-semibold ring-1 ring-green-200' // Active state
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' // Inactive state
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* --- ARTICLES LIST --- */}
          {isLoading ? (
            <p className="text-center text-gray-500 py-10">Loading articles...</p>
          ) : error ? (
             <p className="text-center text-red-500 py-10">Error: {error}</p>
          ) : (
            <div className="space-y-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  // Pass 'news' type to the card
                  <ArticleCard key={article.id} article={article} type="news" />
                ))
              ) : (
                <p className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg">
                  No news articles found for this selection.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
