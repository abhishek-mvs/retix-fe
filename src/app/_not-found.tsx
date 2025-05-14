"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./NotFound"), {
  ssr: false,
});

export default function NotFoundPage() {
  return <DynamicComponentWithNoSSR />;
}
