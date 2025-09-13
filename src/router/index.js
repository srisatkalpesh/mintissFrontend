import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue' // Remove this line
import AdminLayout from '../views/admin/AdminLayout.vue'
import SellerLayout from '../views/sellersite/SellerLayout.vue'
import CheckoutPage from '@/views/usersite/CheckoutPage.vue';

const routes = [
  {
    path: "/",
    name: "StoreFeed",
    component: () => import("../views/usersite/Products.vue"),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
  },
  {
    path: "/product/:id",
    name: 'ProductDetail',
    component: () => import("../views/usersite/ProductDetail.vue"),
  },
  {
    path: "/category/:id",
    name: 'CategoryProducts',
    component: () => import("../views/usersite/CategoryProducts.vue"),
  },
  {
    path: "/categories",
    name: 'Categories',
    component: () => import("../views/usersite/Categories.vue"),
  },
  {
    path: '/order-complete',
    name: 'OrderComplete',
    component: () => import("../views/usersite/OrderComplete.vue"),
  },
  // Remove or comment out the old home route if present
  {
    path: "/mintiss",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: () => import("../views/AboutUs.vue"),
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
    path: "/contact-us",
    name: "ContactUs",
    component: () => import("../views/ContactUs.vue"),
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
    path: "/redeem",
    name: "TokenRedeem",
    component: () => import("../views/usersite/TokenRedeem.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/Referral",
    name: "Referral",
    component: () => import("../views/usersite/Referral.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/users"
      },
      {
        path: "users",
        name: "Adminusers",
        component: () => import("../views/admin/Users.vue")
      },
      {
        path: "sellers",
        name: "AdminSellers",
        component: () => import("../views/admin/Sellers.vue")
      },
      {
        path: "mintiss-values",
        name: "AdminMintissValues",
        component: () => import("../views/admin/MintissValues.vue")
      },
      {
        path: "categories",
        name: "AdminCategories",
        component: () => import("../views/admin/categories/Categories.vue")
      },
      {
        path: "categories/create",
        name: "AdminCategoryCreate",
        component: () => import("../views/admin/categories/CategoryCreate.vue")
      },
      {
        path: "categories/:id/edit",
        name: "AdminCategoryEdit",
        component: () => import("../views/admin/categories/CategoryEdit.vue"),
        props: true
      },
      {
        path: "hero-sections",
        name: "AdminHeroSections",
        component: () => import("../views/admin/hero/HeroSections.vue"),
      },
      {
        path: "hero-sections/create",
        name: "AdminHeroSectionCreate",
        component: () => import("../views/admin/hero/HeroSectionCreate.vue"),
      },
      {
        path: "hero-sections/:id/edit",
        name: "AdminHeroSectionEdit",
        component: () => import("../views/admin/hero/HeroSectionEdit.vue"),
        props: true,
      },

      {
        path: "signup-bonus",
        name: "AdminSignupBonus",
        component: () => import("../views/admin/SignupBonus.vue")
      },
      {
        path: "signup-Referral",
        name: "AdminSignupReferral",
        component: () => import("../views/admin/SignupReferral.vue")
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
        path: "dashboard",
        name: "SellerDashboard",
        component: () => import("../views/seller/SellerDashboard.vue")
      },
      {
        path: "profile",
        name: "SellerProfile",
        component: () => import("../views/sellersite/Profile.vue")
      },
      {
        path: "products",
        name: "SellerProducts",
        component: () => import("../views/sellersite/Products.vue")
      },
      {
        path: "products/add",
        name: "SellerAddProduct",
        component: () => import("../views/sellersite/AddProduct.vue")
      },
      {
        path: "products/:id/edit",
        name: "SellerEditProduct",
        component: () => import("../views/sellersite/EditProduct.vue")
      },
      {
        path: "orders",
        name: "SellerOrders",
        component: () => import("../views/seller/SellerOrders.vue")
      },
      {
        path: "orders/:id",
        name: "SellerOrderDetails",
        component: () => import("../views/seller/SellerOrderDetails.vue")
      }

    ]
  },
  {
    path: "/stores",
    name: "StoreFeedAlias",
    component: () => import("../views/usersite/Products.vue"),
  },
  {
    path: "/coming-soon",
    name: "ComingSoon",
    component: () => import("../views/usersite/ComingSoon.vue"),
  },
  {
    path: "/terms",
    name: "TermsAndConditions",
    component: () => import("../views/TermsAndConditions.vue"),
  },
  {
    path: "/privacy",
    name: "PrivacyPolicy",
    component: () => import("../views/PrivacyPolicy.vue"),
  },
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
