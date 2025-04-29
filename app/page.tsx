import Greeting from "@/components/dashboard/Greeting";
import ShoppingListOverView from "@/components/dashboard/ShoppingListOverview";
import StoreRecommonendation from "@/components/dashboard/StoreRecommendations";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-3xl">Dashboard Page</h1>
      <Greeting />
      <div className="sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:gap-4">
        <ShoppingListOverView />
        <StoreRecommonendation />
      </div>
    </>
  );
}
