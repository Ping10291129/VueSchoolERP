import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

export const useAuthStore = defineStore({
  id: "geeker-auth",
  state: (): AuthState => ({
    // 按钮权限
    authButtonList: {},
    // 菜单权限
    authMenuList: [],
    // 路由名称
    routeName: ""
  }),
  getters: {
    // 按钮权限
    authButtonListGet: state => state.authButtonList,
    // 菜单权限
    authMenuListGet: state => state.authMenuList,
    // 显示菜单
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 扁平菜单
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 面包屑导航
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // 获取按钮
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // 获取菜单
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      // 过滤菜单，只保留指定的页面
      // 更新allowedPaths数组过滤逻辑
      const allowedPaths = [
        "/home/index",
        "/proTable",
        "/proTable/useProTable",
        "/proTable/complexProTable",
        "/about/index",
        "/dataScreen", // 补充父级路径
        "/dataScreen/index"
      ];

      // 修改过滤条件处理父子路径
      const filteredData = data.filter((item: any) => {
        // 保留父级菜单及其子项
        if (item.path === "/dataScreen") return true;

        if (item.path === "/proTable") {
          if (item.children) {
            item.children = item.children.filter(
              (child: any) => child.path === "/proTable/useProTable" || child.path === "/proTable/complexProTable"
            );
          }
          return true;
        }
        return allowedPaths.includes(item.path);
      });
      this.authMenuList = filteredData;
    },
    // 设置路由
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
