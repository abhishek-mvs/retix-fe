import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventBannerProps {
  title: string;
  imageUrl: string;
  logoUrl: string;
  buttonText: string;
  likes: string;
}

export default function EventBanner({
  title,
  // imageUrl,
  logoUrl,
  buttonText,
  likes,
}: EventBannerProps) {
  return (
    <div className="relative w-full h-80 rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="bg-green-700 flex flex-col justify-center px-12">
          <h1 className="text-5xl font-bold text-white mb-8">{title}</h1>
          <Button className="w-32 bg-green-600 hover:bg-green-700 text-white rounded-md">
            {buttonText}
          </Button>

          <div className="flex mt-12 space-x-2">
            {[1, 2, 3, 4, 5].map((dot, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === 2 ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          {/* <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
          /> */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={`${title} logo`}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-gray-800/70 text-white rounded-full px-3 py-1 flex items-center space-x-1">
        <span>{likes}</span>
        <Heart className="h-4 w-4" />
      </div>
    </div>
  );
}
