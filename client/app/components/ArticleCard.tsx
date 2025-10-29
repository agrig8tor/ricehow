// components/ArticleCard.tsx
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid'; // For the dropdown arrow

// Define the shape of the data this card can receive
// It includes all fields from both news and weather, with category being optional
type ArticleData = {
  id: number;
  created_at: string;
  headline: string;
  summary: string | null;
  source_text: string;
  published_date: string;
  source_url: string | null;
  country: string | null;
  category?: string; // Optional category field
};

interface ArticleCardProps {
  article: ArticleData;
  type: 'news' | 'weather'; // To differentiate styling slightly if needed
}

// Helper function to format dates
function formatDate(isoString: string | null): string {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

// Helper to get category tag styles for news
const getNewsCategoryStyles = (category: string | undefined): string => {
  switch (category?.toLowerCase()) {
    case 'policy': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'business': return 'bg-red-100 text-red-800 border-red-200';
    case 'geopolitics': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'weather': return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Weather category from news
    default: return 'bg-gray-100 text-gray-800 border-gray-200'; // General or undefined
  }
};

export default function ArticleCard({ article, type }: ArticleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryDisplay = type === 'weather' ? 'Weather' : article.category || 'General';
  const categoryStyles = type === 'weather'
    ? 'bg-yellow-100 text-yellow-800 border-yellow-200' // Always yellow for weather page
    : getNewsCategoryStyles(article.category);

  return (
    // Lighter grey inner tab
    <div className="bg-gray-50/75 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* --- Clickable Header --- */}
      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Left side: Country and Date */}
        <div className="flex-shrink-0 mr-3">
          <p className="text-[10px] font-medium text-black">
            {article.country?.toUpperCase() || 'N/A'}
          </p>
          <p className="text-[10px] text-gray-400">
            {formatDate(article.published_date)}
          </p>
        </div>

        {/* Right side: Headline and Category Tag */}
        <div className="flex-grow min-w-0">
          <h3 className="text-sm font-semibold text-black truncate pr-2">
            {article.headline}
          </h3>
        </div>
        <div className="flex items-center flex-shrink-0 ml-2">
           <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${categoryStyles} whitespace-nowrap`}>
            {categoryDisplay}
          </span>
          <ChevronDownIcon
            className={`ml-2 h-3 w-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* --- Dropdown Details --- */}
      {isOpen && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <p className="text-xs text-gray-700 mb-3">{article.summary || "No summary available."}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8px] text-gray-500">
            <p><strong>ID:</strong> {article.id}</p>
            <p><strong>Time Added:</strong> {formatDate(article.created_at)}</p>
            <p className="col-span-2"><strong>Headline:</strong> {article.headline}</p>
            <p className="col-span-2"><strong>Source:</strong> {article.source_text}</p>
            <p><strong>Published:</strong> {formatDate(article.published_date)}</p>
            <p><strong>Country Code:</strong> {article.country || 'N/A'}</p>
            <p><strong>Category:</strong> {categoryDisplay}</p>
          </div>
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[10px] text-blue-600 hover:underline"
            >
              View Source &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
}