"use client";
import { useState } from "react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (text: string) => void;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAddItem,
}: AddItemModalProps) {
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/75 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Item</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4 focus:outline-none "
          placeholder="Enter item name"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="text-gray-700 font-medium rounded-lg text-sm px-5 py-2  cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="text-white bg-emerald-700 hover:bg-emerald-900 font-medium rounded-lg text-sm px-8 py-2  cursor-pointer"
            onClick={handleAddItem}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
