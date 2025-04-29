export default function StoreRecommonendation() {
  return (
    <div className="bg-white px-6 py-4 flex justify-between items-center rounded-md shadow-xl mt-2">
      <div>
        <h1 className="text-xl font-medium">Current Shopping List</h1>
        <p className="text-gray-500">
          Your shopping list has 8 items with a total estimated cost of $43.76
        </p>
      </div>
      <div>
        <button
          type="button"
          className="text-white bg-gray-700 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 cursor-pointer transition"
        >
          View Full List
        </button>
      </div>
    </div>
  );
}
