export function getRoutes() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  let routes = [];

  if (token && user) {
    const userObj = JSON.parse(user);

    if (userObj.role === "admin" || userObj.role === "Admin") {
      routes = [
        { name: "Users", path: "/admin/users" },
        { name: "Mintiss Values", path: "/admin/mintiss-values" },
        { name: "Signup Bonus", path: "/admin/signup-bonus" },
      ];
    } else if (userObj.role === "Seller" || userObj.role === "seller") {
      // Seller-specific routes (these will be handled by SellerLayout)
      routes = [
        { name: "Seller Dashboard", path: "/seller/dashboard" },
        { name: "My Products", path: "/seller/products" },
        { name: "Orders", path: "/seller/orders" },
        { name: "Analytics", path: "/seller/analytics" },
        { name: "Profile", path: "/seller/profile" },
      ];
    } else {
      // Regular user routes
      routes = [
        { name: "Home", path: "/" },
      ];
    }
  } else {
    // Not logged in
    routes = [
      { name: "Home", path: "/" },
      { name: "Login", path: "/login" },
    ];
  }

  return routes;
}
