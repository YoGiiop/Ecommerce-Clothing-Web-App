import React, { useCallback, useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, navigate, backendUrl, getCartCount } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfileData(response.data.user);
      } else {
        toast.error(response.data.message || "Unable to load profile");
      }
    } catch {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [token, navigate, fetchProfile]);

  const userInitial = profileData?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="border-t pt-8 sm:pt-12 min-h-[70vh]">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      {loading ? (
        <div className="border border-gray-200 rounded-lg p-6 text-gray-600 animate-pulse">
          Loading profile...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 border border-gray-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-semibold">
                {userInitial}
              </div>
              <div>
                <p className="text-lg sm:text-xl font-semibold text-gray-800">
                  {profileData?.name || "User"}
                </p>
                <p className="text-sm text-gray-500">{profileData?.email || "No email"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Account Type</p>
                <p className="text-gray-800 font-medium mt-1">Customer</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">Saved Cart Items</p>
                <p className="text-gray-800 font-medium mt-1">{getCartCount()}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 sm:p-6">
            <p className="text-base font-semibold text-gray-800 mb-4">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/orders")}
                className="text-left border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/collection")}
                className="text-left border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="text-left border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
