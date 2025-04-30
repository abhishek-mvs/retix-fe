import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar";
import EventBanner from "@/components/event-banner";
import FilterBar from "@/components/filter-bar";
import RecommendedSection from "@/components/recommended-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* <div className="text-center text-sm text-gray-600 py-3 px-4">
        We&apos;re the world&apos;s largest secondary marketplace for tickets to
        live events. Prices are set by sellers and may be below or above face
        value.	
      </div> */}

      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="my-6">
          <SearchBar />
        </div>

        <div className="my-8">
          <EventBanner
            title="Manchester City"
            imageUrl="/placeholder.svg?height=400&width=800"
            logoUrl="/man_city.png"
            buttonText="See Tickets"
            likes="1.3k"
          />
        </div>

        <div className="my-8">
          <FilterBar />
        </div>

        <div className="my-8">
          <RecommendedSection />
        </div>
      </div>
    </main>
  );
}
