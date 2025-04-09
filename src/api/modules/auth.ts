import http from "@/api";
import { PORT1 } from "@/api/config/servicePort";
import { Login } from "@/api/interface";

// 发送验证码
export const sendCode = (email: string) => {
  const formData = new FormData();
  formData.append("email", email);
  return http.post(PORT1 + "/email/sendCode", formData);
};

// 验证验证码
export const verifyCode = (email: string, code: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);
  return http.post(PORT1 + "/email/verifyCode", formData);
};

// 注册用户
export const register = (params: { email: string; password: string; username: string; code: string; role?: string }) => {
  return http.post<Login.ResLogin>(PORT1 + "/register", {
    ...params,
    role: "teacher" // 默认为教师角色
  });
};

// 教师角色自动登录
export const teacherAutoLogin = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(PORT1 + "/login", params, { loading: false });
};
