"use client";

import { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

const TextEditor = dynamic(
  () => import("@/components/text-editor2/TextEditor").then(mod => ({ default: mod.TextEditor })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-lg">Loading editor...</div>
      </div>
    )
  }
);

export default function TextEditor2Page() {
  useEffect(() => {
    console.log("TextEditor2Page mounted");
  }, []);

  return (
    <div className="h-screen w-full">
      <TextEditor />
    </div>
  );
}