import { supabase } from "@/server/pages/api/lib/supabaseClient";
import RicePriceChart from "@/client/app/components/RicePriceChart";


// This page remains a Server Component for efficient data fetching
export default async function Home() {
  // Fetch all necessary columns from the 'rice_price' table
  const { data, error } = await supabase
    .from("rice_price")
    .select(
      "report_date, price_thailand, price_vietnam, price_indonesia, price_cambodia, price_india"
    )
    .order("report_date", { ascending: true }); // Always order time-series data

  if (error) {
    console.error("Supabase fetch error:", error);
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">
          Error: Could not load rice price data. Check the browser console.
        </p>
      </main>
    );
  }

  // If data is null or empty, show a message
  if (!data || data.length === 0) {
     return (
       <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No rice price data found in the database.</p>
      </main>
     )
  }

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-8 w-full max-w-6xl">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Global Rice Price Trends
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            An overview of rice prices from key exporting countries.
          </p>
        </header>

        {/* Render the interactive chart component with the fetched data */}
        <RicePriceChart initialData={data} />
      </main>
      
      <footer className="w-full max-w-5xl mt-16 text-center text-gray-500 text-sm">
        <p>Data sourced from Supabase. Visualized with Recharts.</p>
        <p>Current as of {new Date().toLocaleDateString('en-SG', { timeZone: 'Asia/Singapore' })}</p>
      </footer>
    </div>
  );
}