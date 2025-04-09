<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.svg" alt="" />
          <h2 class="logo-text">智慧校园Admin</h2>
        </div>
        <el-tabs v-model="activeTab" class="demo-tabs">
          <el-tab-pane label="登录" name="login">
            <LoginForm />
          </el-tab-pane>
          <el-tab-pane label="教师注册" name="register">
            <RegisterForm />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";

const activeTab = ref("login");
</script>

<style scoped lang="scss">
@import "./index";
.demo-tabs {
  :deep(.el-tabs__nav-wrap) {
    padding: 0 0 20px;
  }
}
</style>
