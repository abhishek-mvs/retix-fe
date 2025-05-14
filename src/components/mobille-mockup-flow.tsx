"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SellStep {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface MobileMockupFlowProps {
  steps: SellStep[];
}

export default function MobileMockupFlow({ steps }: MobileMockupFlowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const scrollPrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const scrollNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000); // 3 seconds

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 rounded-full bg-white shadow-md border-gray-200 z-10 transition-opacity duration-300",
          "opacity-100"
        )}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 rounded-full bg-white shadow-md border-gray-200 z-10 transition-opacity duration-300",
          "opacity-100"
        )}
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Horizontal scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex space-x-2 px-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "mobile-mockup flex-shrink-0 snap-center",
                "transition-all duration-300",
                activeStep === index
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-70"
              )}
            >
              <div className="flex flex-col items-center">
                {/* Mobile mockup */}
                <div className="relative w-[240px] h-[480px] rounded-[36px] overflow-hidden border-[12px] border-black bg-black shadow-xl mb-6">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl z-10"></div>

                  {/* Screen content */}
                  <div className="relative w-full h-full bg-white overflow-hidden">
                    <Image
                      src={step.imageUrl || "/placeholder.svg"}
                      alt={`Step ${step.id}: ${step.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                    {step.id}
                  </div>
                </div>

                {/* Step description */}
                <h3 className="text-xl font-bold text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center max-w-[240px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveStep(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeStep === index ? "bg-green-600 w-6" : "bg-gray-300"
            )}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
