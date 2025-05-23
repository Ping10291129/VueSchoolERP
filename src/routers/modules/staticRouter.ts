import { RouteRecordRaw } from "vue-router";
import { LOGIN_URL, HOME_URL } from "@/config";

export const staticRouter: RouteRecordRaw[] = [
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: HOME_URL,
    name: "home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "首页"
    }
  }
];

export const errorRouter: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/components/ErrorMessage/403.vue"),
    meta: {
      title: "403页面"
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/ErrorMessage/404.vue"),
    meta: {
      title: "404页面"
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/components/ErrorMessage/500.vue"),
    meta: {
      title: "500页面"
    }
  },
  // 解决刷新页面，路由警告
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/components/ErrorMessage/404.vue")
  }
];
