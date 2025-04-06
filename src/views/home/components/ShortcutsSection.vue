<template>
  <el-card shadow="hover" class="shortcuts-section">
    <template #header>
      <div class="card-header">
        <span>快捷功能</span>
        <el-dropdown>
          <el-button type="primary" text>
            自定义
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>添加快捷方式</el-dropdown-item>
              <el-dropdown-item>重置默认</el-dropdown-item>
              <el-dropdown-item>隐藏此模块</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <el-row :gutter="12" class="shortcuts-row">
      <el-col v-for="(item, index) in shortcuts" :key="index" :span="3" :xs="6" :sm="4" :md="3">
        <div class="shortcut-card">
          <div class="icon-wrapper">
            <component :is="item.icon" />
            <div v-if="hasNewBadge(item)" class="badge" />
          </div>
          <div class="shortcut-name">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

interface ShortcutItem {
  name: string;
  icon: any;
}

// 使用解构而不是存储整个props对象
const { shortcuts } = defineProps<{
  shortcuts: ShortcutItem[];
}>();

// 标记有新内容的功能
const hasNewBadge = (item: ShortcutItem) => {
  const itemsWithBadge = ["课程管理", "学生管理", "通知公告", "资源中心"];
  return itemsWithBadge.includes(item.name);
};

// 初始化
onMounted(() => {
  console.log("快捷功能组件已加载");
});
</script>

<style scoped lang="scss">
.shortcuts-section {
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }
  :deep(.el-card__header) {
    padding: 12px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
  :deep(.el-card__body) {
    padding: 16px 20px;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .shortcuts-row {
    .el-col {
      margin-bottom: 12px;
    }
  }
  .shortcut-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90px;
    padding: 8px;
    cursor: pointer;
    background-color: var(--el-fill-color-light);
    border: 1px solid transparent;
    border-radius: 6px;
    transition: all 0.3s;
    &:hover {
      background-color: var(--el-fill-color);
      border-color: var(--el-color-primary-light-7);
      box-shadow: 0 2px 6px rgb(0 0 0 / 5%);
      transform: translateY(-2px);
      .icon-wrapper {
        color: var(--el-color-primary);
      }
    }
    .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
      font-size: 20px;
      color: var(--el-text-color-regular);
      transition: all 0.3s;
      .badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 6px;
        height: 6px;
        background-color: var(--el-color-danger);
        border-radius: 50%;
      }
    }
    .shortcut-name {
      font-size: 13px;
      line-height: 1.3;
      color: var(--el-text-color-primary);
      text-align: center;
    }
  }
}
</style>
