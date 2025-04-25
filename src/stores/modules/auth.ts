import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "geeker-auth",
  state: () => ({
    // 用户按钮权限列表
    authButtonList: {},
    // 路由权限列表
    authRouterList: []
  }),
  actions: {
    // 设置按钮权限
    setAuthButtonList(authButtonList: { [key: string]: any }) {
      this.authButtonList = authButtonList;
    },
    // 设置路由权限
    setAuthRouterList(authRouterList: string[]) {
      this.authRouterList = authRouterList;
    }
  }
});
