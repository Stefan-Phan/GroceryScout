"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
  items?: number; // Optional property to store the number of items
}

const data: PieChartData[] = [
  { name: "Woolworths", value: 5, color: "#4c6ef5", items: 5 },
  { name: "Coles", value: 3, color: "#e03131", items: 3 },
];

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul>
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center my-5">
          <div
            className="w-4 h-4 mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 text-sm">
            {entry.payload.name} ({entry.payload.items} items)
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function StoreRecommonendation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Store Recommendations
      </h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-100 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                outerRadius="80%"
                dataKey="value"
                nameKey="name"
                label={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                content={renderLegend}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
        <p className="text-gray-700">
          Est. Savings: <span className="font-semibold">$8.45</span>
        </p>
      </div>
    </div>
  );
}
