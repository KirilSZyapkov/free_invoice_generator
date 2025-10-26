export default function Loader() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 mb-6"></div>
        <span className="text-lg text-gray-600 font-medium">Loading...</span>
      </div>
    </main>
  );
}