<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="12" :lg="12">
      <el-card shadow="hover" class="notice-todo-card">
        <template #header>
          <div class="card-header">
            <span>系统通知</span>
            <div>
              <el-button type="primary" size="small" @click="emit('showPublishDialog')">
                <el-icon>
                  <Plus />
                </el-icon>
                发布通知
              </el-button>
              <el-button type="primary" link>管理通知</el-button>
            </div>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(notice, index) in notices"
            :key="index"
            :timestamp="notice.time"
            :type="mapNoticeTypeToTimelineType(notice.type)"
            :hollow="index !== 0"
          >
            <div class="notice-item">
              <h4>{{ notice.content }}</h4>
              <div class="notice-footer">
                <span>发布人: {{ notice.publisher || "系统管理员" }}</span>
                <el-button type="primary" link size="small">详情</el-button>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="12" :lg="12">
      <el-card shadow="hover" class="notice-todo-card">
        <template #header>
          <div class="card-header">
            <span>系统任务</span>
            <div>
              <el-button type="primary" size="small">
                <el-icon>
                  <Plus />
                </el-icon>
                添加任务
              </el-button>
              <el-button type="primary" link>任务管理</el-button>
            </div>
          </div>
        </template>
        <el-table :data="todos" style="width: 100%">
          <el-table-column prop="title" label="任务名称">
            <template #default="{ row }">
              <div class="task-title">
                <el-icon :class="['task-icon', row.status === '已完成' ? 'success' : 'warning']">
                  <Calendar />
                </el-icon>
                <span :class="{ completed: row.status === '已完成' }">{{ row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止时间" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" link size="small" :disabled="row.status === '已完成'" @click="handleCompleteTask(row)">
                {{ row.status === "已完成" ? "已完成" : "标记完成" }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { Calendar, Plus } from "@element-plus/icons-vue";

interface Notice {
  content: string;
  time: string;
  type: string;
  publisher?: string;
}

interface TodoItem {
  title: string;
  deadline: string;
  status: string;
  priority: string;
}

defineProps<{
  notices: Notice[];
  todos: TodoItem[];
}>();

const emit = defineEmits<{
  (e: "showPublishDialog"): void;
  (e: "completeTask", task: TodoItem): void;
}>();

// 处理完成任务
const handleCompleteTask = (task: TodoItem) => {
  emit("completeTask", task);
};

// 映射通知类型到时间轴类型
const mapNoticeTypeToTimelineType = (type: string): "primary" | "success" | "warning" | "danger" | "info" => {
  switch (type) {
    case "primary":
      return "primary";
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "danger";
    default:
      return "info";
  }
};
</script>

<style scoped lang="scss">
// 通知和待办卡片样式
.notice-todo-card {
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }
  :deep(.el-card__header) {
    padding: 12px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    .card-header {
      height: 32px;
      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  :deep(.el-card__body) {
    height: 300px;
    padding: 16px;
    overflow-y: auto;
  }
  .notice-item {
    h4 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .notice-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
  .task-title {
    display: flex;
    gap: 8px;
    align-items: center;
    .task-icon {
      font-size: 16px;
      &.success {
        color: var(--el-color-success);
      }
      &.warning {
        color: var(--el-color-warning);
      }
    }
    .completed {
      color: var(--el-text-color-secondary);
      text-decoration: line-through;
    }
  }
}

// 通用卡片头部样式
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
