import { useState } from "react";
import ProductList from "../components/product/ProductList";
import FiltersBar from "../components/product/FiltersBar";
import useDebounce from "../components/common/useDebounce";


function Home() {
  // ⭐ central filter state
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });
const debouncedSearch = useDebounce(filters.search, 400);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* ===== Page Heading ===== */}
        <h1 className="mb-6 text-2xl font-bold tracking-tight">
          Latest Products
        </h1>

        {/* ===== Filters ===== */}
        <FiltersBar filters={filters} setFilters={setFilters} />

        {/* ===== Products ===== */}
     <ProductList
  filters={{ ...filters, search: debouncedSearch }}
/>
      </div>
    </div>
  );
}

export default Home;