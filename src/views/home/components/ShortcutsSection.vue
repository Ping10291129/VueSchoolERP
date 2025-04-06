<template>
  <div class="shortcuts-section">
    <div class="shortcuts-header">
      <h3>快捷功能</h3>
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

    <div class="shortcuts-content">
      <div v-for="(item, index) in enhancedShortcuts" :key="index" class="shortcut-item">
        <div class="item-header">
          <div class="icon">
            <component :is="item.icon" />
          </div>
          <div class="title">{{ item.name }}</div>
          <div v-if="item.badge" class="badge">{{ item.badge }}</div>
        </div>

        <div class="description">{{ item.description }}</div>

        <el-progress
          v-if="item.progress !== undefined"
          :percentage="item.progress"
          :color="getProgressColor(item.progress)"
          :stroke-width="4"
          :show-text="false"
        />
        <div v-if="item.progressText" style="margin-top: 4px; font-size: 12px; color: var(--el-text-color-secondary)">
          {{ item.progressText }}: {{ item.progress }}%
        </div>

        <div v-if="item.status || item.time" class="info-row">
          <span
            v-if="item.status"
            class="status"
            :class="{
              success: item.status === '正常' || item.status === '在线',
              warning: item.status === '待审核',
              danger: item.status === '需关注'
            }"
          >
            {{ item.status }}
          </span>
          <span v-if="item.time" class="time">{{ item.time }}</span>
        </div>

        <div v-if="item.stats && item.stats.length" class="stats">
          <div v-for="(stat, idx) in item.stats" :key="idx" class="stat-item">
            <div class="label">{{ stat.label }}</div>
            <div class="value">{{ stat.value }}</div>
          </div>
        </div>

        <div v-if="item.actionText" class="action">
          <span class="link">{{ item.actionText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

interface ShortcutItem {
  name: string;
  icon: any;
}

interface EnhancedShortcutItem extends ShortcutItem {
  description: string;
  importance: number;
  badge?: number;
  progress?: number;
  progressText?: string;
  status?: string;
  time?: string;
  actionText?: string;
  stats?: Array<{ label: string; value: string }>;
}

const props = defineProps<{
  shortcuts: ShortcutItem[];
}>();

// 根据功能名称获取描述
const getDescription = (name: string): string => {
  const descriptions: { [key: string]: string } = {
    数据分析: "查看学校各项数据指标与分析报告，支持多维度数据可视化",
    课程管理: "管理课程安排与教学计划，包括教学大纲和课时分配",
    教师管理: "教师信息与绩效考核，含职称评定和培训记录",
    学生管理: "学生信息与学籍管理，支持批量操作和数据导入导出",
    通知公告: "发布和查看校园公告，支持定向推送和阅读统计",
    视频监控: "校园安全监控系统，支持多画面同时查看和录像回放",
    考勤管理: "师生考勤记录与统计，自动生成月度汇总报表",
    资源中心: "教学资源共享平台，支持多种格式文件上传和在线预览"
  };

  return descriptions[name] || "系统功能快捷入口";
};

// 获取进度条颜色
const getProgressColor = (percentage: number): string => {
  if (percentage < 30) return "#f56c6c";
  if (percentage < 70) return "#e6a23c";
  return "#67c23a";
};

// 增强的快捷方式数据
const enhancedShortcuts = computed(() => {
  return props.shortcuts.map(item => {
    // 设置重要性级别
    const importance = Math.floor(Math.random() * 5) + 1; // 1-5的重要性

    // 根据不同功能设置不同的附加信息
    let additionalInfo: Partial<EnhancedShortcutItem> = {};

    switch (item.name) {
      case "数据分析":
        additionalInfo = {
          progress: 78,
          progressText: "数据同步率",
          time: "今日更新",
          actionText: "查看报表",
          stats: [
            { label: "本周新增", value: "14" },
            { label: "同比增长", value: "5.2%" }
          ]
        };
        break;
      case "课程管理":
        additionalInfo = {
          badge: 3,
          status: "待审核",
          actionText: "审核课程",
          progress: 65
        };
        break;
      case "教师管理":
        additionalInfo = {
          status: "正常",
          stats: [
            { label: "在职人数", value: "156" },
            { label: "请假人数", value: "8" }
          ],
          actionText: "查看详情",
          time: "昨日更新"
        };
        break;
      case "学生管理":
        additionalInfo = {
          badge: 12,
          status: "需关注",
          progress: 92,
          progressText: "信息完整度",
          actionText: "学籍管理"
        };
        break;
      case "通知公告":
        additionalInfo = {
          badge: 5,
          time: "10分钟前",
          actionText: "发布通知",
          progress: 32,
          progressText: "阅读率"
        };
        break;
      case "视频监控":
        additionalInfo = {
          status: "在线",
          time: "实时监控",
          actionText: "查看监控",
          stats: [{ label: "在线设备", value: "42/45" }]
        };
        break;
      case "考勤管理":
        additionalInfo = {
          progress: 89,
          progressText: "出勤率",
          time: "今日",
          actionText: "查看考勤",
          stats: [{ label: "缺勤", value: "15人" }]
        };
        break;
      case "资源中心":
        additionalInfo = {
          badge: 8,
          time: "2小时前更新",
          actionText: "浏览资源",
          progress: 45,
          progressText: "存储使用率"
        };
        break;
    }

    return {
      ...item,
      description: getDescription(item.name),
      importance,
      ...additionalInfo
    } as EnhancedShortcutItem;
  });
});

// 初始化
onMounted(() => {
  console.log("快捷功能组件已加载");
});
</script>

<style scoped lang="scss">
.shortcuts-section {
  width: 100%;
  .shortcuts-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .shortcuts-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    grid-gap: 16px;
  }
  .shortcut-item {
    position: relative;
    height: 100%;
    padding: 16px;
    background-color: var(--el-bg-color);
    border: 1px solid #ebeef5;
    border-radius: 4px;
    transition: all 0.3s;
    &:hover {
      border-color: var(--el-color-primary-light-7);
      transform: translateY(-2px);
    }
    .item-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        margin-right: 12px;
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
        border-radius: 6px;
      }
      .badge {
        position: absolute;
        top: 10px;
        right: 10px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        font-size: 12px;
        line-height: 16px;
        color: white;
        text-align: center;
        background-color: var(--el-color-danger);
        border-radius: 8px;
      }
      .title {
        font-size: 15px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
    .description {
      margin-bottom: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--el-text-color-secondary);
    }
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 12px;
      .status {
        display: inline-block;
        padding: 2px 6px;
        color: var(--el-color-info);
        background-color: var(--el-color-info-light-9);
        border-radius: 4px;
        &.success {
          color: var(--el-color-success);
          background-color: var(--el-color-success-light-9);
        }
        &.warning {
          color: var(--el-color-warning);
          background-color: var(--el-color-warning-light-9);
        }
        &.danger {
          color: var(--el-color-danger);
          background-color: var(--el-color-danger-light-9);
        }
      }
      .time {
        color: var(--el-text-color-secondary);
      }
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      .stat-item {
        flex: 1;
        min-width: calc(50% - 4px);
        padding: 6px 8px;
        background-color: var(--el-fill-color-light);
        border-radius: 4px;
        .label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
        .value {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }
    }
    .action {
      margin-top: 12px;
      text-align: right;
      .link {
        font-size: 13px;
        color: var(--el-color-primary);
        cursor: pointer;
        &:hover {
          color: var(--el-color-primary-light-3);
        }
      }
    }
  }

  @media screen and (width <= 1440px) {
    .shortcuts-content {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
  }

  @media screen and (width <= 768px) {
    .shortcuts-content {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
}

// 移除下面所有的颜色相关样式
</style>
