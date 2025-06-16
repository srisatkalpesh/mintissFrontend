export function getRoutes() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  let routes = [];

  if (token && user) {
    const userObj = JSON.parse(user);

    if (userObj.role === "admin") {
      // Admin-specific routes only
      routes = [
        { name: "Admin Panel", path: "/admin" },
      ];
    } else {
      // User-specific (default) routes
      routes = [
        { name: "Home", path: "/" },
        // { name: "Shop", path: "/shop" },
        // { name: "Cart", path: "/cart" },
        // { name: "About", path: "/about" },
        // { name: "Contact", path: "/contact" },
      ];
    }
  } else {
    // Not logged in
    routes = [
      { name: "Home", path: "/" },
      // { name: "Shop", path: "/shop" },
      // { name: "Cart", path: "/cart" },
      // { name: "About", path: "/about" },
      // { name: "Contact", path: "/contact" },
      { name: "Login", path: "/login" },
    ];
  }

  return routes;
}
