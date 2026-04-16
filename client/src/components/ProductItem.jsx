import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProductItem = ({ id, image, name, price, stock }) => {
  const { currency } = useContext(ShopContext);

  if (!image || (Array.isArray(image) && image.length === 0)) {
    return null;
  }

  const imageUrl = Array.isArray(image) ? image[0] : image;

  // Helper function to determine stock status
  const getStockStatus = () => {
    if (!stock || stock <= 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  // Helper function to get stock badge color
  const getStockBadgeColor = () => {
    if (!stock || stock <= 0) return "bg-red-100 text-red-800";
    if (stock <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden relative">
        <img
          src={imageUrl}
          className="hover:scale-110 transition ease-in-out w-full"
          alt={name}
        />
        {/* Stock Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${getStockBadgeColor()}`}>
          {getStockStatus()}
        </div>
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
