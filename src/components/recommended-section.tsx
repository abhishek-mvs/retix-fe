import EventCard from "./event-card";

export default function RecommendedSection() {
  // This would typically come from an API
  const recommendedEvents = [
    {
      id: "1",
      title: "Cricket Match",
      imageUrl: "/images/ipl.webp",
      likes: "5.1k",
    },
    {
      id: "2",
      title: "Rock Concert",
      imageUrl: "/images/coldplay.png",
      likes: "4.3k",
    },
    {
      id: "3",
      title: "Theater Show",
      imageUrl: "/images/show.jpeg",
      likes: "2.8k",
    },
    {
      id: "4",
      title: "Football Match",
      imageUrl: "/images/football.webp",
      likes: "3.5k",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedEvents.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            imageUrl={event.imageUrl}
            likes={event.likes}
          />
        ))}
      </div>
    </div>
  );
}
