<template>
  <div class="home">
    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>学生总数</span>
              <el-tag type="success" effect="plain" size="small">较昨日 +2%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>2,358</h2>
            <el-icon class="icon"><User /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>教师总数</span>
              <el-tag type="info" effect="plain" size="small">较昨日 +0%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>156</h2>
            <el-icon class="icon"><School /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>课程数量</span>
              <el-tag type="warning" effect="plain" size="small">较昨日 +5%</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>324</h2>
            <el-icon class="icon"><Reading /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>在线用户</span>
              <el-tag type="primary" effect="plain" size="small">实时</el-tag>
            </div>
          </template>
          <div class="card-content">
            <h2>{{ onlineUsers }}</h2>
            <el-icon class="icon"><Monitor /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学生人数趋势</span>
              <el-radio-group v-model="chartTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="studentTrendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>教师分布</span>
            </div>
          </template>
          <div ref="teacherDistChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷功能区 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新通知</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="(notice, index) in notices" :key="index" :timestamp="notice.time" :type="notice.type">
              {{ notice.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="primary" link>添加待办</el-button>
            </div>
          </template>
          <el-table :data="todos" style="width: 100%">
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="deadline" label="截止时间" width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { User, School, Reading, Monitor } from "@element-plus/icons-vue";

// 在线用户数
const onlineUsers = ref(128);

// 图表时间范围
const chartTimeRange = ref("week");

// 通知列表
const notices = ref([
  { content: "新学期教师培训会议将于下周一举行", time: "2024-01-10 10:00", type: "primary" },
  { content: "请各班班主任提交本月班级考勤报告", time: "2024-01-09 14:30", type: "warning" },
  { content: "学校运动会报名工作已开始", time: "2024-01-08 09:00", type: "success" }
]);

// 待办事项
const todos = ref([
  { title: "审核新生入学材料", deadline: "2024-01-15", status: "进行中" },
  { title: "准备期末考试试卷", deadline: "2024-01-20", status: "已完成" },
  { title: "教师资格证培训", deadline: "2024-01-25", status: "进行中" }
]);

// 初始化图表
onMounted(() => {
  // 学生趋势图表
  const studentTrendChart = echarts.init(document.querySelector("#studentTrendChart"));
  studentTrendChart.setOption({
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] },
    yAxis: { type: "value" },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        smooth: true
      }
    ]
  });

  // 教师分布图表
  const teacherDistChart = echarts.init(document.querySelector("#teacherDistChart"));
  teacherDistChart.setOption({
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        type: "pie",
        radius: "50%",
        data: [
          { value: 35, name: "语文教师" },
          { value: 30, name: "数学教师" },
          { value: 28, name: "英语教师" },
          { value: 25, name: "理科教师" },
          { value: 38, name: "其他" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });
});
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  .mb-4 {
    margin-bottom: 20px;
  }
  .stat-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h2 {
        margin: 0;
        font-size: 28px;
        color: var(--el-text-color-primary);
      }
      .icon {
        font-size: 48px;
        color: var(--el-color-primary-light-5);
      }
    }
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
