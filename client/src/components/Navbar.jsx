import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setProfileOpen((prev) => !prev);
  };

  const closeSearch = useCallback(() => {
    setShowSearch(false);
    setSearch("");
  }, [setShowSearch, setSearch]);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value.trim() && !location.pathname.includes("/collection")) {
      navigate("/collection");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && !location.pathname.includes("/collection")) {
      navigate("/collection");
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && showSearch) {
        closeSearch();
      }
      if (event.key === "Escape" && profileOpen) {
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showSearch, closeSearch, profileOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 py-4 sm:py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} className="w-28 sm:w-36" alt="Logo" />
      </Link>

      <ul className="hidden sm:flex gap-4 md:gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

      </ul>

      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {showSearch ? (
          <div className="flex flex-1 min-w-0 items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 max-w-[52vw] sm:flex-none sm:w-[230px] md:w-[320px] lg:w-[400px]">
            <img src={assets.search_icon} alt="Search" className="w-4 opacity-70" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search products"
              className="w-full outline-none text-sm bg-transparent"
              autoFocus
            />
            <img
              onClick={closeSearch}
              src={assets.cross_icon}
              alt="Close search"
              className="w-3 cursor-pointer"
            />
          </div>
        ) : (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt="Open search"
            className="w-5 cursor-pointer"
          />
        )}

        <div className="relative" ref={profileRef}>
          <img
            onClick={handleProfileClick}
            src={assets.profile_icon}
            alt="Profile"
            className="w-5 cursor-pointer transition-transform duration-150 hover:scale-105"
          />
          {/* Dropdown Menu */}
          {token && profileOpen && (
            <div className="absolute dropdown-menu right-0 pt-3 z-20">
              <div className="flex flex-col gap-2 bg-white border border-gray-200 rounded-lg shadow-lg w-40 text-gray-600 py-3 px-4">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/orders");
                    setProfileOpen(false);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="Cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(!visible)}
          src={assets.menu_icon}
          alt="Menu"
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* {Sidebar manu for small screens} */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-y-auto bg-white shadow-xl transition-all duration-300 ${
          visible ? "w-full sm:w-80" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(!visible)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            to="/"
            className="py-2 pl-6 border"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/collection"
            className="py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className="py-2 pl-6 border"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className="py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
