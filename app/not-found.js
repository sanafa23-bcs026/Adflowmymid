export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b14] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-5">404</p>
        <h1 className="text-2xl font-black mb-2">Page not found</h1>
        <p className="text-gray-400 text-sm mb-7">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Back to Home →
        </a>
      </div>
    </div>
  );
}

