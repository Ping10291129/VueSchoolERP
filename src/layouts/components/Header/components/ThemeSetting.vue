<template>
  <div class="theme-setting">
    <el-icon class="toolBar-icon iconfont" @click="openDrawer">
      <Setting />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Setting } from "@element-plus/icons-vue";
import mittBus from "@/utils/mittBus";
const openDrawer = () => {
  mittBus.emit("openThemeDrawer");
};
</script>

<style scoped lang="scss">
.iconfont {
  height: 24px;
  font-family: iconfont !important;
  font-size: 22px;
  font-style: normal;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
