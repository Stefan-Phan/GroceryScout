import React from "react";

interface ShoppingItem {
  name: string;
  store: string;
  price: string;
}

const ShoppingListOverView = () => {
  const shoppingListData: ShoppingItem[] = [
    { name: "Milk (2L)", store: "Woolies", price: "$8.50" },
    { name: "Bread", store: "Coles", price: "$4.00" },
    { name: "Eggs (12)", store: "Coles", price: "$6.00" },
    { name: "Chicken Breast (1kg)", store: "Woolies", price: "$15.00" },
    { name: "Apples (1kg)", store: "Coles", price: "$5.50" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Current Shopping List
      </h1>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full shadow-md border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Store
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {shoppingListData.map((item, index) => (
              <tr key={index}>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {item.name}
                </td>
                <td
                  className={`px-5 py-5 border-b border-gray-200 font-medium text-sm ${
                    item.store === "Woolies"
                      ? "text-green-500"
                      : item.store === "Coles"
                      ? "text-red-500"
                      : "text-gray-700"
                  }`}
                >
                  {item.store}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-center mt-3 text-gray-500 cursor-pointer">
          +5 more items
        </p>
      </div>
    </div>
  );
};

export default ShoppingListOverView;
