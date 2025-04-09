import http from "@/api";
import { PORT1, BASE_URL } from "@/api/config/servicePort";
import { Login } from "@/api/interface";

// 发送验证码
export const sendCode = (email: string) => {
  const formData = new FormData();
  formData.append("email", email);
  // 不携带token的请求配置
  return http.post(`${BASE_URL}/email/sendCode`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: false,
    noNeedToken: true // 标记不需要token
  });
};

// 验证验证码
export const verifyCode = (email: string, code: string) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);
  // 不携带token的请求配置
  return http.post(`${BASE_URL}/email/verifyCode`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: false,
    noNeedToken: true // 标记不需要token
  });
};

// 注册用户
export const register = (params: { email: string; password: string; username: string; code: string; role?: string }) => {
  return http.post<Login.ResLogin>(`${PORT1}/register`, {
    ...params,
    role: "teacher" // 默认为教师角色
  });
};

// 教师角色自动登录
export const teacherAutoLogin = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(PORT1 + "/login", params, { loading: false });
};
