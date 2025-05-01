import { Product } from "@/types/Product";

interface ProductCardProps {
  product: Product;
  storeName: string;
}

export default function ProductCard({ product, storeName }: ProductCardProps) {
  const storeColor = storeName === "Woolworths" ? "bg-green-100" : "bg-red-100";
  const storeBadgeColor =
    storeName === "Woolworths" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-4 ${storeColor}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 h-12">
            {product.name}
          </h3>
          <span
            className={`${storeBadgeColor} text-white text-xs px-2 py-1 rounded-full`}
          >
            {storeName}
          </span>
        </div>

        <div className="h-40 relative mb-3 bg-white flex items-center justify-center rounded">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-gray-900">{product.price}</div>
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Product
          </a>
        </div>
      </div>
    </div>
  );
}
