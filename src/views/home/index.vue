<template>
  <div class="home">
    <!-- 欢迎区域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-info">
              <h1>欢迎回来，管理员</h1>
              <p>今天是 {{ currentDate }}，{{ weatherInfo }}</p>
              <div class="quick-actions">
                <el-button type="primary" @click="showPublishDialog = true">
                  <el-icon>
                    <Bell />
                  </el-icon>
                  发布通知
                </el-button>
                <el-button>
                  <el-icon>
                    <Document />
                  </el-icon>
                  生成报表
                </el-button>
                <el-button>
                  <el-icon>
                    <Setting />
                  </el-icon>
                  系统设置
                </el-button>
              </div>
            </div>
            <div class="welcome-stats">
              <div class="stat-item">
                <div class="stat-value">{{ systemUptime }}</div>
                <div class="stat-label">系统运行时间</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ onlineUsers }}</div>
                <div class="stat-label">在线用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ todayLogins }}</div>
                <div class="stat-label">今日登录</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="12" :sm="6" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>学生总数</span>
              <el-tooltip content="较昨日增长2%" placement="top">
                <el-tag type="success" effect="plain" size="small">+2%</el-tag>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2>2,358</h2>
            <div class="icon-wrapper success">
              <el-icon class="icon">
                <User />
              </el-icon>
            </div>
          </div>
          <div class="card-footer">
            <el-progress :percentage="78" :stroke-width="6" :show-text="false" status="success" />
            <span>注册率: 78%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>教师总数</span>
              <el-tooltip content="较昨日无变化" placement="top">
                <el-tag type="info" effect="plain" size="small">+0%</el-tag>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2>156</h2>
            <div class="icon-wrapper info">
              <el-icon class="icon">
                <School />
              </el-icon>
            </div>
          </div>
          <div class="card-footer">
            <el-progress :percentage="92" :stroke-width="6" :show-text="false" status="info" />
            <span>在职率: 92%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>课程数量</span>
              <el-tooltip content="较昨日增长5%" placement="top">
                <el-tag type="warning" effect="plain" size="small">+5%</el-tag>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2>324</h2>
            <div class="icon-wrapper warning">
              <el-icon class="icon">
                <Reading />
              </el-icon>
            </div>
          </div>
          <div class="card-footer">
            <el-progress :percentage="65" :stroke-width="6" :show-text="false" status="warning" />
            <span>开课率: 65%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="6" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>系统资源</span>
              <el-tooltip content="实时监控" placement="top">
                <el-tag type="primary" effect="plain" size="small">实时</el-tag>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ systemLoad }}%</h2>
            <div class="icon-wrapper primary">
              <el-icon class="icon">
                <Monitor />
              </el-icon>
            </div>
          </div>
          <div class="card-footer">
            <el-progress
              :percentage="systemLoad"
              :stroke-width="6"
              :show-text="false"
              :status="systemLoad > 80 ? 'exception' : 'primary'"
            />
            <span>CPU负载: {{ systemLoad }}%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>学生活动参与趋势</span>
              <div class="header-actions">
                <StudentTrendSwitch v-model="chartTimeRange" class="trend-switch" />
              </div>
            </div>
          </template>
          <StudentTrendChart :time-range="chartTimeRange" class="chart-container" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>教师分布</span>
              <el-select v-model="teacherViewType" size="small" style="width: 120px">
                <el-option label="按学科查看" value="subject" />
                <el-option label="按职称查看" value="title" />
              </el-select>
            </div>
          </template>
          <div ref="teacherDistChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 管理功能区 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card shadow="hover" class="notice-todo-card">
          <template #header>
            <div class="card-header">
              <span>系统通知</span>
              <div>
                <el-button type="primary" size="small" @click="showPublishDialog = true">
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
              :type="notice.type"
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
                <el-button type="primary" link size="small" :disabled="row.status === '已完成'">
                  {{ row.status === "已完成" ? "已完成" : "标记完成" }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷功能区 -->
    <el-row :gutter="20" class="mb-4 mt-4">
      <el-col :span="24">
        <el-card shadow="hover" class="shortcut-card">
          <template #header>
            <div class="card-header">
              <span>快捷功能</span>
            </div>
          </template>
          <div class="shortcut-grid">
            <div v-for="(item, index) in shortcuts" :key="index" class="shortcut-item">
              <el-button class="shortcut-button" :icon="item.icon" circle />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 发布通知对话框 -->
    <el-dialog v-model="showPublishDialog" title="发布系统通知" width="50%">
      <el-form :model="publishForm" label-width="80px">
        <el-form-item label="通知标题" required>
          <el-input v-model="publishForm.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="通知内容" required>
          <el-input v-model="publishForm.content" type="textarea" :rows="4" placeholder="请输入通知内容" />
        </el-form-item>
        <el-form-item label="通知类型">
          <el-select v-model="publishForm.type" placeholder="请选择通知类型">
            <el-option label="普通通知" value="primary" />
            <el-option label="重要通知" value="warning" />
            <el-option label="紧急通知" value="danger" />
            <el-option label="成功通知" value="success" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布范围">
          <el-checkbox-group v-model="publishForm.scope">
            <el-checkbox label="学生">学生</el-checkbox>
            <el-checkbox label="教师">教师</el-checkbox>
            <el-checkbox label="管理员">管理员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPublishDialog = false">取消</el-button>
          <el-button type="primary" @click="handlePublishNotice">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import {
  User,
  School,
  Reading,
  Monitor,
  Bell,
  Document,
  Setting,
  Calendar,
  Plus,
  PieChart,
  Notification,
  VideoCamera,
  Stopwatch,
  Paperclip,
  Management
} from "@element-plus/icons-vue";
import StudentTrendSwitch from "@/components/StudentTrendSwitch/index.vue";
import { ElMessage } from "element-plus";
import StudentTrendChart from "@/components/StudentTrendChart/index.vue";

// 图表实例
let teacherDistChart: echarts.ECharts | null = null;

// 系统状态数据
const onlineUsers = ref(128);
const systemLoad = ref(42);
const todayLogins = ref(386);
const systemUptime = ref("23天12小时");

// 当前日期和天气
const currentDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()]}`;
});
const weatherInfo = ref("晴朗 26°C");

// 图表时间范围和类型
const chartTimeRange = ref("week");
// 删除这一行: const studentChartType = ref("line");
// 教师视图类型
const teacherViewType = ref("subject");

// 通知列表
const notices = ref([
  { content: "新学期教师培训会议将于下周一举行", time: "2024-01-10 10:00", type: "primary", publisher: "教务处" },
  { content: "请各班班主任提交本月班级考勤报告", time: "2024-01-09 14:30", type: "warning", publisher: "学生处" },
  { content: "学校运动会报名工作已开始", time: "2024-01-08 09:00", type: "success", publisher: "体育部" }
]);

// 待办事项
const todos = ref([
  { title: "审核新生入学材料", deadline: "2024-01-15", status: "进行中", priority: "高" },
  { title: "准备期末考试试卷", deadline: "2024-01-20", status: "已完成", priority: "中" },
  { title: "教师资格证培训", deadline: "2024-01-25", status: "进行中", priority: "中" },
  { title: "学生信息系统升级", deadline: "2024-01-30", status: "进行中", priority: "高" }
]);

// 快捷功能
const shortcuts = ref([
  { name: "数据分析", icon: PieChart },
  { name: "课程管理", icon: Reading },
  { name: "教师管理", icon: Management },
  { name: "学生管理", icon: User },
  { name: "通知公告", icon: Notification },
  { name: "视频监控", icon: VideoCamera },
  { name: "考勤管理", icon: Stopwatch },
  { name: "资源中心", icon: Paperclip }
]);

// 发布通知表单
const showPublishDialog = ref(false);
const publishForm = ref({
  title: "",
  content: "",
  type: "primary",
  scope: ["学生", "教师"]
});

// 处理发布通知
const handlePublishNotice = () => {
  if (!publishForm.value.title || !publishForm.value.content) {
    ElMessage.warning("请填写完整的通知信息");
    return;
  }

  // 模拟发布通知
  const newNotice = {
    content: publishForm.value.title,
    time: new Date().toLocaleString(),
    type: publishForm.value.type,
    publisher: "系统管理员"
  };

  notices.value.unshift(newNotice);
  ElMessage.success("通知发布成功");
  showPublishDialog.value = false;

  // 重置表单
  publishForm.value = {
    title: "",
    content: "",
    type: "primary",
    scope: ["学生", "教师"]
  };
};

// 模拟系统负载变化
let loadTimer: number | null = null;
const updateSystemLoad = () => {
  systemLoad.value = Math.floor(Math.random() * 30) + 30; // 30-60之间随机
  onlineUsers.value = Math.floor(Math.random() * 50) + 100; // 100-150之间随机
};

// 图表容器的ref
const teacherDistChartRef = ref<HTMLElement>();

// 初始化图表
onMounted(() => {
  // 教师分布图表
  if (teacherDistChartRef.value) {
    teacherDistChart = echarts.init(teacherDistChartRef.value);
    teacherDistChart.setOption({
      tooltip: { trigger: "item" },
      legend: {
        orient: "vertical",
        left: "left",
        top: "center"
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 35, name: "语文教师" },
            { value: 30, name: "数学教师" },
            { value: 28, name: "英语教师" },
            { value: 25, name: "理科教师" },
            { value: 38, name: "其他" }
          ]
        }
      ]
    });
  }

  // 启动系统负载模拟更新
  loadTimer = window.setInterval(updateSystemLoad, 5000);
});

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (loadTimer) {
    clearInterval(loadTimer);
    loadTimer = null;
  }
});
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  .mb-4 {
    margin-bottom: 20px;
  }
  .mt-4 {
    margin-top: 20px;
  }

  // 欢迎卡片样式
  .welcome-card {
    overflow: hidden;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
    }
    :deep(.el-card__body) {
      padding: 0;
    }
    .welcome-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      overflow: hidden;

      @media (width <= 768px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
      }
      .welcome-info {
        h1 {
          margin: 0 0 10px;
          font-size: 24px;
          font-weight: 500;
          color: var(--el-color-primary);
        }
        p {
          margin: 0 0 16px;
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
        .quick-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;

          @media (width <= 768px) {
            flex-wrap: wrap;
          }
          .el-button {
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            border: 1px solid var(--el-color-primary-light-5);
            transition: background-color 0.3s ease;
            &:hover {
              color: white;
              background: var(--el-color-primary);
            }
            .el-icon {
              margin-right: 4px;
            }
          }
        }
      }
      .welcome-stats {
        display: flex;
        gap: 16px;
        margin-left: 24px;

        @media (width <= 768px) {
          justify-content: space-between;
          width: 100%;
          margin-top: 16px;
          margin-left: 0;
        }
        .stat-item {
          min-width: 100px;
          padding: 12px;
          text-align: center;
          background: var(--el-fill-color-light);
          border-radius: 4px;
          .stat-value {
            margin-bottom: 2px;
            font-size: 20px;
            font-weight: 500;
            color: var(--el-color-primary);
          }
          .stat-label {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  // 统计卡片样式
  .stat-card {
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      h2 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        color: var(--el-text-color-primary);
      }
      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        &.success,
        &.warning {
          background-color: var(--el-color-primary-light-8);
          .icon {
            color: var(--el-color-primary);
          }
        }
        &.info {
          background-color: var(--el-color-primary-light-8);
          .icon {
            color: var(--el-color-primary);
          }
        }
        &.primary {
          background-color: var(--el-color-primary-light-8);
          .icon {
            color: var(--el-color-primary);
          }
        }
        .icon {
          font-size: 30px;
        }
      }
    }
    .card-footer {
      display: flex;
      flex-direction: column;
      gap: 5px;
      span {
        font-size: 13px;
        color: var(--el-text-color-secondary);
        text-align: right;
      }
      .el-progress {
        &.el-progress--success,
        &.el-progress--warning {
          .el-progress-bar__inner {
            background-color: var(--el-color-primary);
          }
        }
      }
    }
  }

  // 通用卡片头部样式
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }
  }

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

  // 图表卡片样式
  .chart-card {
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
        height: 32px;
        span {
          font-size: 16px;
          font-weight: 500;
        }
        .trend-switch {
          margin: 0;
        }
      }
    }
    .chart-container {
      height: 35vh;
      padding: 0;

      @media (width <= 768px) {
        height: 30vh;
      }
    }
  }

  // 快捷功能区样式
  .shortcut-card {
    border: 1px solid var(--el-border-color-light);
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
    }
    :deep(.el-card__body) {
      padding: 20px;
    }
    .shortcut-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 20px;

      @media (width <= 1200px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (width <= 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      .shortcut-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        .shortcut-button {
          width: 60px;
          height: 60px;
          font-size: 24px;
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
          transition: all 0.3s;
          &:hover {
            color: white;
            background-color: var(--el-color-primary);
          }
        }
        span {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}
</style>
