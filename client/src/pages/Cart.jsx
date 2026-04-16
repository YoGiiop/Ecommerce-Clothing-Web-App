import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateCartQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-8 sm:pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <img src={assets.bin_icon} alt="Empty cart" className="w-20 h-20 mx-auto opacity-50" />
          </div>
          <p className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Add items to your cart to get started</p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          <div>
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) {
                return <div key={index}>Product not found</div>;
              }

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-1 sm:grid-cols-[minmax(0,4fr)_auto_auto] items-start sm:items-center gap-4"
                >
                  <div className="flex items-start gap-4 sm:gap-6 min-w-0">
                    {productData.image && productData.image[0] && (
                      <img
                        className="w-16 sm:w-20 flex-shrink-0"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium sm:text-lg text-sm break-words">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-3 sm:gap-5 mt-2 flex-wrap">
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                        <p className="px-2 border sm:px-3 sm:py-1 bg-slate-50">
                          Size: {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateCartQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    className="border w-24 sm:w-20 px-2 py-1"
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <img
                    onClick={() => updateCartQuantity(item._id, item.size, 0)}
                    src={assets.bin_icon}
                    className="w-4 sm:w-5 cursor-pointer"
                    alt=""
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate("/place-order")}
                  className="bg-black text-white text-sm my-8 px-8 py-3"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
