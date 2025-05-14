"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Home"), {
  ssr: false,
});

export default function MyBids() {
  return <DynamicComponentWithNoSSR />;
}
