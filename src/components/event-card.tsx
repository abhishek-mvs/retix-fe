import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  imageUrl: string;
  likes: string;
}

export default function EventCard({
  id,
  title,
  imageUrl,
  likes,
}: EventCardProps) {
  return (
    <Link href={`/events/${id}`}>
      <div className="relative rounded-lg overflow-hidden group">
        <div className="aspect-[4/3] relative">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute top-2 right-2 bg-gray-800/70 text-white rounded-full px-2 py-1 flex items-center space-x-1">
          <span>{likes}</span>
          <Heart className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
