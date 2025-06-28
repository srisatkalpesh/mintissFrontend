import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import SellerLayout from '../views/sellersite/SellerLayout.vue'

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/shop",
    name: "Shop",
    component: () => import("../views/usersite/UserShop.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/usersite/UserCart.vue"),
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/usersite/UserContact.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/usersite/Login.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/usersite/UserSignup.vue"),
  },
  {
    path: "/seller/signup",
    name: "SellerSignup",
    component: () => import("../views/sellersite/SellerSignup.vue"),
  },
  {
    path: "/auth/google/callback/:params?",
    name: "GoogleCallback",
    component: () => import("../views/usersite/GoogleCallback.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/usersite/Profile.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/category/:id",
    name: "Category",
    component: () => import("../views/usersite/CategoryView.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/categories"
      },
      {
        path: "categories",
        name: "AdminCategories",
        component: () => import("../views/admin/Categories.vue")
      },
      {
        path: "users",
        name: "Adminusers",
        component: () => import("../views/admin/Users.vue")
      },
      {
        path: "sub-categories",
        name: "AdminSubCategories",
        component: () => import("../views/admin/SubCategories.vue")
      },
      {
        path: "products",
        name: "AdminProducts",
        component: () => import("../views/admin/Products.vue")
      },
      {
        path: "mintiss-values",
        name: "AdminMintissValues",
        component: () => import("../views/admin/MintissValues.vue")
      },
      {
        path: "signup-bonus",
        name: "AdminSignupBonus",
        component: () => import("../views/admin/SignupBonus.vue")
      }
    ]
  },
  {
    path: "/seller",
    name: "Seller",
    component: SellerLayout,
    meta: { requiresAuth: true, requiresSeller: true },
    children: [
      {
        path: "",
        redirect: "/seller/dashboard"
      },
      {
        path: "test",
        name: "SellerTest",
        component: () => import("../views/sellersite/Test.vue")
      },
      {
        path: "dashboard",
        name: "SellerDashboard",
        component: () => import("../views/sellersite/Dashboard.vue")
      },
      {
        path: "products",
        name: "SellerProducts",
        component: () => import("../views/sellersite/Products.vue")
      },
      {
        path: "orders",
        name: "SellerOrders",
        component: () => import("../views/sellersite/Orders.vue")
      },
      {
        path: "analytics",
        name: "SellerAnalytics",
        component: () => import("../views/sellersite/Analytics.vue")
      },
      {
        path: "profile",
        name: "SellerProfile",
        component: () => import("../views/sellersite/Profile.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  console.log('Router guard - to:', to.path, 'from:', from.path)
  console.log('Token:', !!token, 'User:', !!user)

  if (to.meta.requiresAuth && !token) {
    console.log('No token, redirecting to login')
    next('/login')
  } else if (to.meta.requiresAdmin && user) {
    const userObj = JSON.parse(user)
    console.log('Admin check - role:', userObj.role)
    if (userObj.role !== 'admin' && userObj.role !== 'Admin') {
      console.log('Not admin, redirecting to home')
      next('/')
    } else {
      // Redirect admin to categories page after login
      if (from.path === '/login' && to.path === '/admin') {
        next('/admin/categories')
      } else {
        next()
      }
    }
  } else if (to.meta.requiresSeller && user) {
    const userObj = JSON.parse(user)
    console.log('Seller check - role:', userObj.role)
    if (userObj.role !== 'Seller' && userObj.role !== 'seller') {
      console.log('Not seller, redirecting to home')
      next('/')
    } else {
      // Redirect seller to dashboard page after login
      if (from.path === '/login' && to.path === '/seller') {
        next('/seller/dashboard')
      } else {
        next()
      }
    }
  } else {
    // If admin is accessing login page and is already logged in, redirect to categories
    if (to.path === '/login' && token && user) {
      const userObj = JSON.parse(user)
      console.log('Login page redirect check - role:', userObj.role)
      if (userObj.role === 'admin' || userObj.role === 'Admin') {
        next('/admin/categories')
      } else if (userObj.role === 'Seller' || userObj.role === 'seller') {
        next('/seller/dashboard')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router;
