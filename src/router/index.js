import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'

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
        path: "categories",
        name: "AdminCategories",
        component: () => import("../views/admin/Categories.vue")
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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && user) {
    const userObj = JSON.parse(user)
    if (userObj.role !== 'admin') {
      next('/')
    } else {
      // Redirect admin to categories page after login
      if (from.path === '/login' && to.path === '/admin') {
        next('/admin/categories')
      } else {
        next()
      }
    }
  } else {
    // If admin is accessing login page and is already logged in, redirect to categories
    if (to.path === '/login' && token && user) {
      const userObj = JSON.parse(user)
      if (userObj.role === 'admin') {
        next('/admin/categories')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router;
