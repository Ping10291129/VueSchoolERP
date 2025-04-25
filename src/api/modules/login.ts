import { Login } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  const formData = new FormData();
  formData.append("username", params.username);
  formData.append("password", params.password);
  return http.post<Login.ResLogin>("/userLogin/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    loading: false
  });
};

// 用户退出登录
export const logoutApi = () => {
  return http.post("/logout");
};
