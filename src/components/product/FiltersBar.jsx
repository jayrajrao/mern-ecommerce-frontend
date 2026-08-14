
function FiltersBar({ filters, setFilters }) {
  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleCategory = (e) => {
    setFilters((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSort = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
    }));
  };

  return (
    <div className="p-4 mb-6 bg-white shadow-sm rounded-xl">
      <div className="grid gap-4 md:grid-cols-4">
        
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleSearch}
          className="px-3 py-2 border rounded-lg"
        />

        {/* 📂 Category */}
        <select
          value={filters.category}
          onChange={handleCategory}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
        </select>

        {/* 💰 Sort */}
        <select
          value={filters.sort}
          onChange={handleSort}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>

        {/* 🧹 Clear */}
        <button
          onClick={() =>
            setFilters({
              search: "",
              category: "",
              sort: "",
            })
          }
          className="text-white bg-black rounded-lg hover:bg-gray-800"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default FiltersBar;