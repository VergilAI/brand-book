export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, you might add authentication here
  const isAuthenticated = true; // Simplified for demo

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">This page is for internal use only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-vergil-off-black text-white px-4 py-2 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium">🔧 Internal Tools</span>
          <span className="text-gray-400">Development Mode</span>
        </div>
      </div>
      {children}
    </div>
  );
}