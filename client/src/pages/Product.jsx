import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const item = products.find((product) => product._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }, [productId, products]);

  // Helper function to determine stock status
  const getStockStatus = () => {
    if (!productData.stock) return "Out of Stock";
    if (productData.stock <= 5) return "Low Stock";
    return "In Stock";
  };

  // Helper function to get stock badge color
  const getStockBadgeColor = () => {
    if (!productData.stock) return "bg-red-100 text-red-800";
    if (productData.stock <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (productData.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  return productData ? (
    <div className="border-t-2 pt-6 sm:pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-6 lg:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-y-auto sm:pb-0 sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                src={item}
                alt=""
                key={index}
                className="h-24 w-20 rounded border border-gray-200 object-cover flex-shrink-0 cursor-pointer sm:h-auto sm:w-full"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h1 className="font-medium text-xl sm:text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>

          {/* Stock Status Badge */}
          <div className="mt-3 flex items-center gap-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStockBadgeColor()}`}>
              {getStockStatus()}
            </span>
            {productData.stock && productData.stock <= 5 && (
              <span className="text-xs text-red-600 font-medium">Only {productData.stock} left!</span>
            )}
          </div>

          <p className="mt-5 text-2xl sm:text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 break-words">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border py-2 px-3 sm:px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Quantity</p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="px-6 py-2 font-medium border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (productData.stock || 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {productData.stock <= 0 ? "Unavailable" : `${productData.stock - quantity + 1} available`}
              </span>
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size, quantity)}
            disabled={productData.stock <= 0}
            className={`${
              productData.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } text-white py-3 px-6 sm:px-8 text-sm active:bg-gray-700 transition`}
          >
            {productData.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Authentic</p>
            <p>Cash on delivery available</p>
            <p>Easy 7 days returns and exchanges</p>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-14 sm:mt-20">
        <div className="flex flex-wrap">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews(122)</p>
        </div>
        <div className="flex flex-col gap-4 text-gray-500 text-sm py-6 px-6 border">
          <p>
            An e-commerce website is an online platform that allows users to buy
            and sell products and services over the internet. It is a digital
            marketplace where customers can browse, purchase, and sell products
            and services online.
          </p>
          <p>
            The website provides a convenient and secure platform for online
            shopping, enabling users to buy and sell products and services from
            anywhere in the world. It allows users to create an account, browse
            products, add items to their cart, and checkout for payment.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
