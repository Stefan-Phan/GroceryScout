import { Item } from "@/types/Grocery";

export default function ItemCard({
  id,
  name,
  price,
  pricePerUnit,
  imageUrl,
  brand,
}: Item) {
  return (
    <div className="bg-white rounded-md shadow-md border border-gray-300 flex flex-col h-full">
      <div className="relative w-full h-32 md:h-48 flex items-center justify-center">
        <img src={imageUrl} alt={name} height={150} width={150} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{brand}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">
            ${price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">{pricePerUnit}</span>
        </div>
        <button className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
