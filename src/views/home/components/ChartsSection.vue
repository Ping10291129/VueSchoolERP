<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="16" :lg="16">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>学生活动参与趋势</span>
            <div class="header-actions">
              <StudentTrendSwitch v-model="localChartTimeRange" class="trend-switch" />
            </div>
          </div>
        </template>
        <StudentTrendChart :time-range="localChartTimeRange" class="chart-container" />
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="8" :lg="8">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>教师分布</span>
            <el-select v-model="localTeacherViewType" size="small" style="width: 120px">
              <el-option label="按学科查看" value="subject" />
              <el-option label="按职称查看" value="title" />
            </el-select>
          </div>
        </template>
        <div ref="teacherDistChartRef" class="chart-container"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import StudentTrendSwitch from "@/components/StudentTrendSwitch/index.vue";
import StudentTrendChart from "@/components/StudentTrendChart/index.vue";

const props = defineProps<{
  chartTimeRange: string;
  teacherViewType: string;
}>();

const emit = defineEmits<{
  (e: "update:chartTimeRange", value: string): void;
  (e: "update:teacherViewType", value: string): void;
}>();

// 本地状态
const localChartTimeRange = ref(props.chartTimeRange);
const localTeacherViewType = ref(props.teacherViewType);

// 监听本地状态变化并同步到父组件
watch(localChartTimeRange, newVal => {
  emit("update:chartTimeRange", newVal);
});

watch(localTeacherViewType, newVal => {
  emit("update:teacherViewType", newVal);
  updateTeacherChart();
});

// 监听props变化并更新本地状态
watch(
  () => props.chartTimeRange,
  newVal => {
    localChartTimeRange.value = newVal;
  }
);

watch(
  () => props.teacherViewType,
  newVal => {
    localTeacherViewType.value = newVal;
    updateTeacherChart();
  }
);

// 图表实例
let teacherDistChart: echarts.ECharts | null = null;

// 图表容器的ref
const teacherDistChartRef = ref<HTMLElement | null>(null);

// 更新教师分布图表
const updateTeacherChart = () => {
  if (!teacherDistChart) return;

  const chartData =
    localTeacherViewType.value === "subject"
      ? [
          { value: 35, name: "语文教师" },
          { value: 30, name: "数学教师" },
          { value: 28, name: "英语教师" },
          { value: 25, name: "理科教师" },
          { value: 38, name: "其他" }
        ]
      : [
          { value: 20, name: "教授" },
          { value: 40, name: "副教授" },
          { value: 60, name: "讲师" },
          { value: 36, name: "助教" }
        ];

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
        data: chartData
      }
    ]
  });
};

// 初始化图表
onMounted(() => {
  // 教师分布图表
  if (teacherDistChartRef.value) {
    teacherDistChart = echarts.init(teacherDistChartRef.value);
    updateTeacherChart();

    const resizeHandler = () => {
      teacherDistChart?.resize();
    };

    window.addEventListener("resize", resizeHandler);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeHandler);
      teacherDistChart?.dispose();
    });
  }
});
</script>

<style scoped lang="scss">
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

// 小屏幕适配
@media (width <= 768px) {
  .el-col {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
