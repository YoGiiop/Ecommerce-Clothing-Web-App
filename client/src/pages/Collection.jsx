import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchesSearchQuery = (productName = "", query = "") => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const normalizedName = normalizeText(productName);
  const queryTerms = normalizedQuery.split(" ").filter(Boolean);

  return queryTerms.every((term) => normalizedName.includes(term));
};

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [stockFilter, setStockFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: "" });
  const [sortType, setSortType] = useState("relevant");
  const [openSections, setOpenSections] = useState({
    category: true,
    type: true,
    stock: true,
    price: true,
  });

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSection = (sectionName) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const maxProductPrice = useMemo(() => {
    if (!products.length) return 0;
    return Math.max(...products.map((item) => Number(item.price) || 0));
  }, [products]);

  useEffect(() => {
    if (products.length > 0 && priceRange.max === "") {
      setPriceRange({ min: 0, max: maxProductPrice });
    }
  }, [products, maxProductPrice, priceRange.max]);

  const applyFilterAndSort = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search.trim().length > 0) {
      productsCopy = productsCopy.filter((item) =>
        matchesSearchQuery(item.name, search),
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }

    if (stockFilter === "in-stock") {
      productsCopy = productsCopy.filter((item) => Number(item.stock || 0) > 0);
    }

    if (stockFilter === "low-stock") {
      productsCopy = productsCopy.filter((item) => {
        const stock = Number(item.stock || 0);
        return stock > 0 && stock <= 5;
      });
    }

    if (stockFilter === "out-of-stock") {
      productsCopy = productsCopy.filter((item) => Number(item.stock || 0) <= 0);
    }

    const minPrice = 0;
    const maxPrice = priceRange.max !== "" ? Number(priceRange.max) : maxProductPrice;

    if (!Number.isNaN(minPrice)) {
      productsCopy = productsCopy.filter((item) => Number(item.price) >= minPrice);
    }

    if (!Number.isNaN(maxPrice)) {
      productsCopy = productsCopy.filter((item) => Number(item.price) <= maxPrice);
    }

    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        productsCopy.sort((a, b) => (b.date || 0) - (a.date || 0));
        break;
      case "name-asc":
        productsCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(productsCopy);
  }, [
    products,
    showSearch,
    search,
    category,
    subCategory,
    stockFilter,
    priceRange,
    maxProductPrice,
    sortType,
  ]);

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setStockFilter("all");
    setPriceRange({ min: 0, max: maxProductPrice });
    setSortType("relevant");
  };

  useEffect(() => {
    applyFilterAndSort();
  }, [applyFilterAndSort]);

  const activeFilterCount =
    category.length +
    subCategory.length +
    (stockFilter !== "all" ? 1 : 0) +
    (priceRange.max !== "" && Number(priceRange.max) < maxProductPrice ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 pt-6 sm:pt-10 border-t">
      {/* Filter Options */}
      <div className="w-full md:w-[250px] lg:w-[260px] md:flex-shrink-0">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-lg sm:text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">{activeFilterCount} active filter(s)</p>
          <button
            onClick={clearAllFilters}
            className="text-xs underline text-gray-700 hover:text-black"
          >
            Clear all
          </button>
        </div>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 px-4 py-3 mt-4 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <button
            onClick={() => toggleSection("category")}
            className="w-full pr-4 mb-2 flex items-center justify-between text-sm font-medium"
          >
            CATEGORIES
            <img
              src={assets.dropdown_icon}
              alt="Toggle category filter"
              className={`h-2.5 transition-transform duration-300 ${
                openSections.category ? "rotate-90" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.category ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 pt-1">
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Men"}
                className="w-3"
                checked={category.includes("Men")}
                onChange={toggleCategory}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Women"}
                className="w-3"
                checked={category.includes("Women")}
                onChange={toggleCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Kids"}
                className="w-3"
                checked={category.includes("Kids")}
                onChange={toggleCategory}
              />
              Kids
            </p>
            </div>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 px-4 py-3 my-4 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <button
            onClick={() => toggleSection("type")}
            className="w-full pr-4 mb-2 flex items-center justify-between text-sm font-medium"
          >
            TYPE
            <img
              src={assets.dropdown_icon}
              alt="Toggle type filter"
              className={`h-2.5 transition-transform duration-300 ${
                openSections.type ? "rotate-90" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.type ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 pt-1">
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Topwear"}
                className="w-3"
                checked={subCategory.includes("Topwear")}
                onChange={toggleSubCategory}
              />
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Bottomwear"}
                className="w-3"
                checked={subCategory.includes("Bottomwear")}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value={"Winterwear"}
                className="w-3"
                checked={subCategory.includes("Winterwear")}
                onChange={toggleSubCategory}
              />
              Winterwear
            </p>
            </div>
          </div>
        </div>

        {/* Stock Filter */}
        <div
          className={`border border-gray-300 px-4 py-3 my-4 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <button
            onClick={() => toggleSection("stock")}
            className="w-full pr-4 mb-2 flex items-center justify-between text-sm font-medium"
          >
            STOCK
            <img
              src={assets.dropdown_icon}
              alt="Toggle stock filter"
              className={`h-2.5 transition-transform duration-300 ${
                openSections.stock ? "rotate-90" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.stock ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700 pt-1">
            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                name="stockFilter"
                value="all"
                checked={stockFilter === "all"}
                onChange={(e) => setStockFilter(e.target.value)}
              />
              All
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                name="stockFilter"
                value="in-stock"
                checked={stockFilter === "in-stock"}
                onChange={(e) => setStockFilter(e.target.value)}
              />
              In Stock
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                name="stockFilter"
                value="low-stock"
                checked={stockFilter === "low-stock"}
                onChange={(e) => setStockFilter(e.target.value)}
              />
              Low Stock (1-5)
            </label>
            <label className="flex gap-2 cursor-pointer">
              <input
                type="radio"
                name="stockFilter"
                value="out-of-stock"
                checked={stockFilter === "out-of-stock"}
                onChange={(e) => setStockFilter(e.target.value)}
              />
              Out of Stock
            </label>
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div
          className={`border border-gray-300 px-4 py-3 my-4 ${
            showFilter ? "" : "hidden"
          } md:block`}
        >
          <button
            onClick={() => toggleSection("price")}
            className="w-full mb-2 flex items-center justify-between text-sm font-medium"
          >
            PRICE RANGE
            <img
              src={assets.dropdown_icon}
              alt="Toggle price filter"
              className={`h-2.5 transition-transform duration-300 ${
                openSections.price ? "rotate-90" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openSections.price ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>$0</span>
                <span>${maxProductPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                step="1"
                value={priceRange.max === "" ? maxProductPrice : priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: 0, max: Number(e.target.value) }))
                }
                className="w-full accent-black"
              />
              <div className="mt-2 text-sm text-gray-700">
                Selected: $0 - ${priceRange.max === "" ? maxProductPrice : priceRange.max}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side  */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-base sm:text-2xl mb-4 gap-3">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">{filteredProducts.length} result(s)</p>
            {/* Product Sort  */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2 py-1 w-full sm:w-auto"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Price Low to High</option>
              <option value="high-low">Sort by: Price High to Low</option>
              <option value="newest">Sort by: Newest</option>
              <option value="name-asc">Sort by: Name A-Z</option>
            </select>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category.map((item) => (
              <span key={item} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
            {subCategory.map((item) => (
              <span key={item} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {item}
              </span>
            ))}
            {stockFilter !== "all" && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {stockFilter.replace("-", " ")}
              </span>
            )}
            {priceRange.max !== "" && Number(priceRange.max) < maxProductPrice && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                Price: 0 - {priceRange.max === "" ? maxProductPrice : priceRange.max}
              </span>
            )}
          </div>
        )}

        {/* Map Products  */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-2xl font-medium text-gray-700 mb-2">No products found</p>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            filteredProducts.map((item, index) => (
              <ProductItem
                key={index}
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                stock={item.stock}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
