export default function AdDetail({ params }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">
        Ad ID: {params.slug}
      </h1>

      <p className="text-gray-600 mb-4">
        This is a detailed view of the ad.
      </p>

      <button className="bg-red-500 text-white px-4 py-2 rounded">
        Report Ad
      </button>
    </div>
  );
}