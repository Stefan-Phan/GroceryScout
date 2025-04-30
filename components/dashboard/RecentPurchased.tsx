"use client";

// import type
import { Grocery } from "@/types/Grocery";

// import component
import ItemCard from "../ItemCard";

// mock data
const products: Grocery[] = [
  {
    id: "1",
    name: "Chicken Sandwich Schnitzel",
    price: 2.8,
    pricePerUnit: "2.80 / 1EA",
    imageUrl:
      "https://assets.woolworths.com.au/images/1005/666237.jpg?impolicy=wowsmkqiema",
    brand: "Woolworths",
  },
  {
    id: "2",
    name: "Coles Beef Lasagne | 1.8kg",
    price: 12.5,
    pricePerUnit: "6.9 / 1KG",
    imageUrl:
      "https://shop.coles.com.au/wcsstore/Coles-CAS/images/3/1/6/3165991-th.jpg",
    brand: "Coles",
  },
  {
    id: "3",
    name: "Abe's Bagels Natural Bagels 360g x 4 pack",
    price: 5.5,
    pricePerUnit: "1.53 / 100G",
    imageUrl:
      "https://assets.woolworths.com.au/images/1005/270580.jpg?impolicy=wowsmkqiema",
    brand: "Woolworths",
  },
  {
    id: "4",
    name: "Coles Full Cream Milk | 3L",
    price: 4.35,
    pricePerUnit: "1.45 per 1l",
    imageUrl:
      "https://shop.coles.com.au/wcsstore/Coles-CAS/images/8/1/5/8150288-th.jpg",
    brand: "Coles",
  },
  {
    id: "5",
    name: "Coles Full Cream Milk | 3L",
    price: 4.35,
    pricePerUnit: "1.45 per 1l",
    imageUrl:
      "https://shop.coles.com.au/wcsstore/Coles-CAS/images/8/1/5/8150288-th.jpg",
    brand: "Coles",
  },
  {
    id: "6",
    name: "Coles Full Cream Milk | 3L",
    price: 4.35,
    pricePerUnit: "1.45 per 1l",
    imageUrl:
      "https://shop.coles.com.au/wcsstore/Coles-CAS/images/8/1/5/8150288-th.jpg",
    brand: "Coles",
  },
  {
    id: "7",
    name: "Coles Full Cream Milk | 3L",
    price: 4.35,
    pricePerUnit: "1.45 per 1l",
    imageUrl:
      "https://shop.coles.com.au/wcsstore/Coles-CAS/images/8/1/5/8150288-th.jpg",
    brand: "Coles",
  },
];

export default function RecentPurchased() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Recently Purchased Items
      </h1>
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {products.map((product) => (
            <div key={product.id} className="w-64 shrink-0">
              <ItemCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
