import React from "react";
import ShopPage from "../page";

interface CategoryShopPageProps {
  params: {
    category: string;
  };
  searchParams: {
    collection?: string;
    occasion?: string;
    sort?: string;
    q?: string;
  };
}

export default function CategoryShopPage({ params, searchParams }: CategoryShopPageProps) {
  // Delegate directly to the main ShopPage with the category passed in searchParams
  return (
    <ShopPage
      searchParams={{
        ...searchParams,
        category: params.category,
      }}
    />
  );
}

