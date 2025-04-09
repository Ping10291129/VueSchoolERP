<template>
  <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="registerForm.username" placeholder="用户名">
        <template #prefix>
          <el-icon class="el-input__icon"><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="邮箱地址">
        <template #prefix>
          <el-icon class="el-input__icon"><message /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <div class="code-input">
        <el-input v-model="registerForm.code" placeholder="验证码">
          <template #prefix>
            <el-icon class="el-input__icon"><key /></el-icon>
          </template>
        </el-input>
        <el-button :disabled="isSending" @click="handleSendCode">
          {{ isSending ? `${countdown}s` : "获取验证码" }}
        </el-button>
      </div>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" show-password>
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="register-btn">
    <el-button :icon="CircleClose" round @click="resetForm(registerFormRef)"> 重置 </el-button>
    <el-button type="primary" :icon="UserFilled" round :loading="loading" @click="handleRegister"> 注册 </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { sendCode, verifyCode, register } from "@/api/modules/auth";
import type { FormInstance, FormRules } from "element-plus";
import md5 from "md5";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { HOME_URL } from "@/config";
import { useRouter } from "vue-router";

interface RegisterForm {
  username: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const registerFormRef = ref<FormInstance>();
const loading = ref(false);
const isSending = ref(false);
const countdown = ref(60);
const lastSendTime = ref(0);

const registerForm = reactive<RegisterForm>({
  username: "",
  email: "",
  code: "",
  password: "",
  confirmPassword: ""
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const registerRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "邮箱格式不正确",
      trigger: "blur"
    }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [{ required: true, validator: validatePass, trigger: "blur" }]
});

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

const handleSendCode = async () => {
  if (!registerForm.email) {
    ElMessage.warning("请先填写邮箱");
    return;
  }

  if (Date.now() - lastSendTime.value < 60000) {
    ElMessage.warning("操作过于频繁");
    return;
  }

  try {
    await sendCode(registerForm.email);
    isSending.value = true;
    lastSendTime.value = Date.now();

    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        isSending.value = false;
        countdown.value = 60;
      }
    }, 1000);
  } catch (error) {
    ElMessage.error("验证码发送失败");
  }
};

const handleRegister = async () => {
  if (!registerFormRef.value) return;
  await registerFormRef.value.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 验证码校验
      await verifyCode(registerForm.email, registerForm.code);

      // 注册
      const { data } = await register({
        username: registerForm.username,
        email: registerForm.email,
        password: md5(registerForm.password),
        code: registerForm.code
      });

      // 自动登录
      userStore.setToken(data.access_token);
      await initDynamicRouter();
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      ElNotification({
        title: "注册成功",
        message: "正在为您自动登录...",
        type: "success"
      });

      // 清理敏感数据
      resetForm(registerFormRef.value);

      // 直接跳转到首页
      router.push(HOME_URL);
    } catch (error: any) {
      ElMessage.error(error.message || "注册失败");
    } finally {
      loading.value = false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss">
.register-btn {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  > .el-button {
    width: 185px;
  }
}
.code-input {
  display: flex;
  gap: 10px;
  width: 100%;
  .el-button {
    flex-shrink: 0;
    width: 120px;
  }
}
</style>
