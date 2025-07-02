import type { Metadata } from "next";
import "./editor.css";

export const metadata: Metadata = {
  title: "Vergil Text Editor",
  description: "A modern, sophisticated text editor with professional writing features",
};

export default function TextEditor2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-deep-space">
      {children}
    </div>
  );
}