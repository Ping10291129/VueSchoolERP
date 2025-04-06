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
        <el-empty v-if="notices.length === 0" description="暂无通知" />
        <el-scrollbar v-else height="320px" class="notice-scrollbar">
          <el-timeline>
            <el-timeline-item
              v-for="(notice, index) in notices"
              :key="index"
              :timestamp="notice.time"
              :type="mapNoticeTypeToTimelineType(notice.type)"
              :hollow="index !== 0"
              size="normal"
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
        </el-scrollbar>
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
        <el-empty v-if="todos.length === 0" description="暂无任务" />
        <el-scrollbar v-else height="320px" class="task-scrollbar">
          <div class="task-list">
            <div
              v-for="(task, index) in todos"
              :key="index"
              class="task-item"
              :class="{ 'completed-task': task.status === '已完成' }"
            >
              <el-descriptions :column="1" border size="small">
                <template #title>
                  <div class="task-title">
                    <el-icon :class="['task-icon', task.status === '已完成' ? 'success' : 'warning']">
                      <Calendar />
                    </el-icon>
                    <span :class="{ completed: task.status === '已完成' }">{{ task.title }}</span>
                    <el-tag
                      :type="task.priority === '高' ? 'danger' : task.priority === '中' ? 'warning' : 'info'"
                      size="small"
                      effect="light"
                      class="ml-auto"
                    >
                      {{ task.priority }}
                    </el-tag>
                  </div>
                </template>
                <el-descriptions-item label="截止日期">{{ task.deadline }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="task.status === '已完成' ? 'success' : 'warning'" size="small">
                    {{ task.status }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="操作">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    :disabled="task.status === '已完成'"
                    @click="handleCompleteTask(task)"
                  >
                    {{ task.status === "已完成" ? "已完成" : "标记完成" }}
                  </el-button>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-scrollbar>
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
  height: 100%;
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }
  :deep(.el-card__header) {
    padding: 12px 20px;
    border-bottom: 1px solid var(--el-border-color-light);
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  :deep(.el-card__body) {
    height: 350px;
    padding: 0;
    overflow: hidden;
  }
}

// 通知样式
.notice-scrollbar {
  :deep(.el-scrollbar__wrap) {
    padding: 16px;
  }
  .notice-item {
    padding: 0 0 16px;
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
}

// 任务样式
.task-scrollbar {
  :deep(.el-scrollbar__wrap) {
    padding: 16px;
  }
  .task-list {
    .task-item {
      margin-bottom: 16px;
      &.completed-task {
        opacity: 0.8;
        :deep(.el-descriptions__title) {
          color: var(--el-text-color-secondary);
          text-decoration: line-through;
        }
      }
      :deep(.el-descriptions__header) {
        margin-bottom: 0;
      }
      :deep(.el-descriptions__body) {
        .el-descriptions__table {
          overflow: hidden;
          border-radius: 4px;
        }
      }
    }
  }
  .task-title {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
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
    .ml-auto {
      margin-left: auto;
    }
  }
}
</style>
