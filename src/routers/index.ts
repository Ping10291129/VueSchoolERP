import { createRouter, createWebHashHistory } from "vue-router";
import { staticRouter, errorRouter } from "@/routers/modules/staticRouter";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export const resetRouter = () => {
  const staticRouteNames = staticRouter.map(route => route.name);
  router.getRoutes().forEach(route => {
    const name = route.name;
    if (name && !staticRouteNames.includes(name)) {
      router.removeRoute(name);
    }
  });
};

export default router;
