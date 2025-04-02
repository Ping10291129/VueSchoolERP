<template>
  <div class="trend-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { generateMockData } from "./mockData";

interface Props {
  timeRange: string;
}

const props = withDefaults(defineProps<Props>(), {
  timeRange: "week"
});

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 生成模拟数据
const { fullDataX, dataMale, dataFemale } = generateMockData();

// 获取指定时间范围的数据
const getTimeRangeData = (range: string) => {
  let days = 7;
  switch (range) {
    case "week":
      days = 7;
      break;
    case "month":
      days = 30;
      break;
    case "all":
      days = 60;
      break;
  }
  return {
    dates: fullDataX.slice(-days),
    male: dataMale.slice(-days),
    female: dataFemale.slice(-days)
  };
};

// 更新图表
const updateChart = () => {
  if (!chartInstance) return;

  const { dates, male, female } = getTimeRangeData(props.timeRange);

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      textStyle: {
        color: "#333"
      },
      formatter: (params: any) => {
        const date = params[0].axisValue;
        const male = params[0].data;
        const female = params[1].data;
        return `${date}<br/>男生：${male}<br/>女生：${female}`;
      }
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
      axisLine: {
        lineStyle: {
          color: "#E5E7EB"
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#6B7280"
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: "#E5E7EB",
          type: "dashed"
        }
      },
      axisLabel: {
        color: "#6B7280"
      }
    },
    series: [
      {
        name: "男生",
        type: "line",
        data: male,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#3B82F6"
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(59, 130, 246, 0.3)"
            },
            {
              offset: 1,
              color: "rgba(59, 130, 246, 0.1)"
            }
          ])
        }
      },
      {
        name: "女生",
        type: "line",
        data: female,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: "#EC4899"
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(236, 72, 153, 0.3)"
            },
            {
              offset: 1,
              color: "rgba(236, 72, 153, 0.1)"
            }
          ])
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

// 监听时间范围变化
watch(
  () => props.timeRange,
  () => {
    updateChart();
  }
);

// 初始化图表
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    updateChart();

    const resizeListener = () => {
      chartInstance?.resize();
    };
    window.addEventListener("resize", resizeListener);
    window.removeEventListener("resize", resizeListener);
  }
});

// 销毁图表
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style lang="scss" scoped>
.trend-chart-wrapper {
  height: 100%;
  .trend-chart {
    width: 100%;
    height: 300px;
  }
}
</style>
