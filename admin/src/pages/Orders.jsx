import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../config/constants";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token, setToken }) => {
  const [orders, setOrders] = useState([]);

  const handleAuthFailure = useCallback((message) => {
    localStorage.removeItem("adminToken");
    setToken("");
    toast.error(message || "Your admin session has expired. Please log in again.");
  }, [setToken]);

  const fetchAllOrders = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Unable to load orders");
      }
    } catch (error) {
      const message = error.response?.data?.message;
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleAuthFailure(message);
        return;
      }
      toast.error(message || "Error fetching orders");
    }
  }, [token, handleAuthFailure]);

  const statusHandler = async (event, orderId, currentStatus) => {
    const newStatus = event.target.value;

    // Only send update request if status has actually changed
    if (newStatus === currentStatus) {
      return; // Don't send request if status is unchanged
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.data.success) {
        await fetchAllOrders(); // Refresh orders after status update
      } else {
        toast.error(response.data.message || "Unable to update order status");
      }
    } catch (error) {
      const message = error.response?.data?.message;
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleAuthFailure(message);
        return;
      }
      toast.error(message || "Error updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <div>
      <h3 className="text-2xl font-medium text-gray-700">Orders</h3>
      <div className="mt-4 grid gap-4">
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,1fr)_auto] sm:p-6 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel icon" />
            <div className="min-w-0">
              {/* Render items */}
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  return (
                    <p className="py-0.5 break-words" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {index < order.items.length - 1 && ","}
                    </p>
                  );
                })
              ) : (
                <p>No items in this order.</p>
              )}
            </div>
            {/* Render address */}
            <div className="space-y-3 min-w-0 lg:col-span-1">
              <div>
                <p className="font-medium text-gray-800">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <p className="mt-1 break-words">{order.address.street}</p>
                <p className="break-words">
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    (order.address.pincode || order.address.zipcode || "")}
                </p>
                <p>{order.address.phone}</p>
              </div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Paid" : "Not Paid"}</p>
              <p>Date: {new Date(order.date).toDateString()}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch lg:justify-start">
              <p className="text-sm font-semibold sm:text-[15px]">
                {currency}
                {order.amount.toFixed(2)}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id, order.status)}
                value={order.status}
                className="w-full rounded-md p-2 font-semibold sm:w-auto lg:w-full"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Order Shipped">Order Shipped</option>
                <option value="Order Delivered">Order Delivered</option>
                <option value="Out for delivery">Out for delivery</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
