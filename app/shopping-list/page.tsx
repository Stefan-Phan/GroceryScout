"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Import types
import { Item } from "@/types/Item";
import { OptimizedItem } from "@/types/OptimizedItem";
import { Product } from "@/types/Product";

// Import components
import TaskItem from "@/components/shopping-list/ShoppingItem";
import AddItemModal from "@/components/shopping-list/AddItemModal";

// Import icons
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const initialItems: Item[] = [
  { id: "1", text: "White Rice" },
  { id: "2", text: "Tomato Paste" },
  { id: "3", text: "Pasta" },
  { id: "4", text: "Chicken" },
  { id: "5", text: "Sauce" },
];

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [optimizedKeywords, setOptimizedKeywords] = useState<OptimizedItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [productResults, setProductResults] = useState<Product[]>([]);

  // Generate optimized keywords with AI
  const generateKeywords = async () => {
    setIsLoading(true);
    try {
      const prompt = `You are an assistant that helps optimize grocery search terms for Woolworths and Coles. Interpret the following JSON array of items and generate simplified and effective keywords for each item to search on Woolworths and Coles. Format the response as an array of objects with: id, wooliesKeyword, colesKeyword. Items: ${JSON.stringify(
        items,
        null,
        2
      )}`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          const cleanedOutput = data.output
            ?.replace(/^```(?:json\n)?/, "") // Remove optional ```json\n at the beginning
            .replace(/```$/, "") // Remove ``` at the end
            .replace(/^json\s*/i, "") // Remove "json" (case-insensitive) and any following whitespace at the beginning
            .trim();
          const parsed: OptimizedItem[] = JSON.parse(cleanedOutput);

          setOptimizedKeywords(parsed);
        } catch (e) {
          console.error("Failed to parse optimized items", e);
          setOptimizedKeywords([]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products using the generated keywords
  const fetchProducts = async () => {
    if (optimizedKeywords.length === 0) {
      generateKeywords();
    }

    setIsProductLoading(true);
    try {
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: optimizedKeywords,
        }),
      });

      const data = await response.json();
      setProductResults(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    // Update optimized keywords after deleting an item
    const updatedKeywords = optimizedKeywords.filter(
      (keyword) => keyword.id !== id
    );
    setOptimizedKeywords(updatedKeywords);
  };

  const handleUpdateItem = (id: string, newText: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddItem = (newItemText: string) => {
    if (newItemText.trim()) {
      const newItem: Item = {
        id: uuidv4(),
        text: newItemText.trim(),
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }
    closeModal();
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl text-center font-bold my-6">
          My Shopping List
        </h1>
        {/* Task rows */}
        {items.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
          />
        ))}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 items-center text-white bg-gray-700 hover:bg-gray-900 font-medium rounded-lg text-sm px-6 py-2.5 cursor-pointer transition mb-6"
          >
            <PlusIcon className="h-6 w-6" strokeWidth={2} />
            ADD NEW ITEM
          </button>
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading || isProductLoading}
            className={`flex gap-2 items-center text-white ${
              isLoading || isProductLoading
                ? "bg-emerald-500"
                : "bg-emerald-700 hover:bg-emerald-900"
            } font-medium rounded-lg text-sm px-8 py-2.5 cursor-pointer transition mb-6`}
          >
            {isLoading || isProductLoading ? (
              <ArrowPathIcon className="h-6 w-6 animate-spin" />
            ) : (
              <BanknotesIcon className="h-6 w-6" />
            )}
            {isLoading
              ? "OPTIMIZING KEYWORDS..."
              : isProductLoading
              ? "FINDING PRODUCTS..."
              : "GET PRICES"}
          </button>
        </div>
        {isModalOpen && (
          <AddItemModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddItem={handleAddItem}
          />
        )}
      </div>
    </div>
  );
}
