<template>
  <div class="home">
    <!-- 欢迎区域 -->
    <div class="mb-4">
      <WelcomeSection
        :online-users="onlineUsers"
        :today-logins="todayLogins"
        :system-uptime="systemUptime"
        @show-publish-dialog="showPublishDialog = true"
      />
    </div>

    <!-- 数据统计卡片 -->
    <div class="mb-4">
      <StatisticsCards :system-load="systemLoad" />
    </div>

    <!-- 图表区域 -->
    <div class="mb-4">
      <ChartsSection v-model:chart-time-range="chartTimeRange" v-model:teacher-view-type="teacherViewType" />
    </div>

    <!-- 管理功能区 -->
    <div class="mb-4">
      <NoticeAndTodoSection
        :notices="notices"
        :todos="todos"
        @show-publish-dialog="showPublishDialog = true"
        @complete-task="handleCompleteTask"
      />
    </div>

    <!-- 快捷功能区 -->
    <div class="mb-4">
      <ShortcutsSection :shortcuts="shortcuts" />
    </div>

    <!-- 发布通知对话框 -->
    <PublishNoticeDialog v-model:visible="showPublishDialog" @publish="handlePublishNotice" />
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { PieChart, Reading, User, Management, Notification, VideoCamera, Stopwatch, Paperclip } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 导入拆分的组件
import WelcomeSection from "./components/WelcomeSection.vue";
import StatisticsCards from "./components/StatisticsCards.vue";
import ChartsSection from "./components/ChartsSection.vue";
import NoticeAndTodoSection from "./components/NoticeAndTodoSection.vue";
import ShortcutsSection from "./components/ShortcutsSection.vue";
import PublishNoticeDialog from "./components/PublishNoticeDialog.vue";

// 系统状态数据
const onlineUsers = ref(128);
const systemLoad = ref(42);
const todayLogins = ref(386);
const systemUptime = ref("23天12小时");

// 目标系统状态 - 用于平滑过渡
const targetSystemLoad = ref(42);
const targetOnlineUsers = ref(128);

// 图表时间范围和类型
const chartTimeRange = ref("week");
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

// 发布通知对话框
const showPublishDialog = ref(false);

// 处理发布通知
const handlePublishNotice = notice => {
  notices.value.unshift(notice);
  ElMessage.success("通知发布成功");
};

// 处理完成任务
const handleCompleteTask = task => {
  const index = todos.value.findIndex(item => item.title === task.title);
  if (index !== -1) {
    todos.value[index].status = "已完成";
    ElMessage.success(`任务"${task.title}"已标记为完成`);
  }
};

// 平滑更新系统状态数据
const smoothUpdateValue = (current, target, duration = 1000) => {
  const startValue = current.value;
  const changeValue = target - startValue;
  const startTime = Date.now();

  const animate = () => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < duration) {
      // 使用缓动函数使变化更加平滑
      const progress = elapsedTime / duration;
      // easeOutQuad 缓动函数
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      current.value = Math.round(startValue + changeValue * easeProgress);
      requestAnimationFrame(animate);
    } else {
      current.value = target;
    }
  };

  animate();
};

// 模拟系统负载变化
let loadTimer: number | null = null;
const updateSystemLoad = () => {
  // 设置新的目标值
  targetSystemLoad.value = Math.floor(Math.random() * 30) + 30; // 30-60之间随机
  targetOnlineUsers.value = Math.floor(Math.random() * 50) + 100; // 100-150之间随机

  // 平滑过渡到新值
  smoothUpdateValue(systemLoad, targetSystemLoad.value, 2000);
  smoothUpdateValue(onlineUsers, targetOnlineUsers.value, 2000);
};

// 初始化
onMounted(() => {
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

  // 引入辅助类
  .mb-4 {
    margin-bottom: 20px;
  }
  .mt-4 {
    margin-top: 20px;
  }
}
</style>
