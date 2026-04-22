export default function Ads() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Explore Ads</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold">Ad Title</h2>
          <p className="text-sm text-gray-500">City • Category</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold">Ad Title</h2>
          <p className="text-sm text-gray-500">City • Category</p>
        </div>
      </div>
    </div>
  );
}