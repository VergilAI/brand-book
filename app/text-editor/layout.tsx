import './editor.css';

export default function TextEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-whisper-gray dark:bg-black text-editor-layout">
      {children}
    </div>
  );
}