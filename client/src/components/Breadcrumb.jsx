import React from "react";
import { useLocation, Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Breadcrumb = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define breadcrumb labels based on routes
  const breadcrumbMap = {
    "/": "Home",
    "/collection": "Collection",
    "/product": "Product",
    "/about": "About",
    "/contact": "Contact",
    "/cart": "Cart",
    "/orders": "Orders",
    "/place-order": "Checkout",
    "/login": "Login"
  };

  // Build breadcrumb items
  const getBreadcrumbs = () => {
    const items = [{ label: "Home", path: "/" }];

    if (currentPath !== "/") {
      // Handle /product/:productId
      if (currentPath.includes("/product/")) {
        items.push({ label: "Collection", path: "/collection" });
        items.push({ label: "Product", path: currentPath, active: true });
      } else {
        // Standard routes
        for (const [path, label] of Object.entries(breadcrumbMap)) {
          if (path !== "/" && currentPath.includes(path)) {
            items.push({ label, path, active: true });
            break;
          }
        }
      }
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumb on home page
  if (currentPath === "/") {
    return null;
  }

  return (
    <div className="text-sm text-gray-600 py-4 flex items-center gap-2">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.active ? (
            <span className="text-gray-800 font-medium">{item.label}</span>
          ) : (
            <Link to={item.path} className="text-gray-600 hover:text-gray-800 transition">
              {item.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
