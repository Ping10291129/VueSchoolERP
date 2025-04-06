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

    <div class="shortcuts-wrapper">
      <div class="shortcuts-grid">
        <div v-for="(item, index) in shortcuts" :key="index" class="shortcut-card" @click="navigateTo(item.route)">
          <div class="shortcut-content">
            <div class="icon-wrapper">
              <component :is="item.icon" />
            </div>
            <div class="shortcut-info">
              <div class="shortcut-name">{{ item.name }}</div>
              <div class="shortcut-desc">{{ getShortcutDescription(item.name) }}</div>
            </div>
            <div class="shortcut-action">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ArrowDown, ArrowRight } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

interface ShortcutItem {
  name: string;
  icon: any;
  route?: string;
}

// 使用解构而不是存储整个props对象
const { shortcuts } = defineProps<{
  shortcuts: ShortcutItem[];
}>();

// 获取快捷功能描述
const getShortcutDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    数据分析: "查看学校关键数据指标和统计报表",
    课程管理: "管理课程安排、教学计划和教材",
    教师管理: "教师档案、考核和培训管理",
    学生管理: "学生信息、学籍和成绩管理",
    通知公告: "发布和管理系统通知和公告",
    视频监控: "校园安全监控系统",
    考勤管理: "师生考勤记录和统计",
    资源中心: "教学资源和学习材料库"
  };

  return descriptions[name] || "快速访问系统功能";
};

// 添加导航方法
const router = useRouter();

const navigateTo = (route: string | undefined) => {
  if (route) {
    router.push(route);
  }
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
    height: auto;
    max-height: 240px;
    padding: 16px;
    overflow: auto;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .shortcuts-wrapper {
    padding: 4px;
  }
  .shortcuts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .shortcut-card {
    position: relative;
    height: 80px;
    overflow: hidden;
    cursor: pointer;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
    transition: all 0.3s;
    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 6px 16px rgb(0 0 0 / 10%);
      .shortcut-name {
        color: var(--el-color-primary) !important;
      }
      .shortcut-action {
        opacity: 1;
      }
    }
    .shortcut-content {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 16px;
      .icon-wrapper {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 20px;
        color: var(--el-color-primary);
        border-radius: 8px;
      }
      .shortcut-info {
        flex: 1;
        margin-left: 12px;
        overflow: hidden;
        .shortcut-name {
          overflow: hidden;
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.3s;
        }
        .shortcut-desc {
          margin-top: 4px;
          overflow: hidden;
          font-size: 12px;
          color: var(--el-text-color-secondary);
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .shortcut-action {
        margin-left: 12px;
        font-size: 16px;
        color: var(--el-color-primary);
        opacity: 0.6;
        transition: opacity 0.3s ease;
      }
    }
  }
}
</style>
