<template>
  <div class="trend-chart-wrapper">
    <div class="trend-chart" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { generateMockData } from "./mockData";

interface Props {
  timeRange: string;
  chartType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  timeRange: "week",
  chartType: "line"
});

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 获取模拟数据
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
      days = fullDataX.length;
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
      axisPointer: { type: "cross" },
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderWidth: 1,
      borderColor: "#ddd",
      padding: [10, 15],
      textStyle: { color: "#333" },
      extraCssText: "backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 4px;"
    },
    toolbox: {
      right: "10%",
      feature: {
        saveAsImage: { title: "保存图片" },
        dataView: { title: "数据视图" },
        magicType: {
          type: ["stack", "tiled", props.chartType, props.chartType === "line" ? "bar" : "line"],
          title: {
            stack: "堆叠",
            tiled: "平铺",
            line: "折线图",
            bar: "柱状图"
          }
        },
        restore: { title: "还原" }
      }
    },
    legend: {
      data: ["课外活动", "课堂活动"],
      top: 25
    },
    dataZoom: props.timeRange === "all" ? [{ type: "slider", start: 83, end: 100 }] : [],
    xAxis: {
      type: "category",
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: "#ddd" }
      },
      axisTick: { show: false },
      axisLabel: {
        color: "#666",
        formatter: (value: string) => {
          return value.replace("-", "/");
        }
      }
    },
    yAxis: {
      type: "value",
      name: "活动参与人数",
      nameTextStyle: {
        color: "#666",
        padding: [0, 0, 0, 40]
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#eee"
        }
      },
      axisLabel: { color: "#666" }
    },
    series: [
      {
        name: "课外活动",
        type: props.chartType,
        data: male,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#3B82F6" },
              { offset: 1, color: "#1D4ED8" }
            ]
          }
        },
        lineStyle: {
          width: 3,
          shadowColor: "rgba(59, 130, 246, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 10
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.1)" }
          ])
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
          label: {
            position: "start",
            formatter: "平均: {c}"
          }
        }
      },
      {
        name: "课堂活动",
        type: props.chartType,
        data: female,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#EC4899" },
              { offset: 1, color: "#BE185D" }
            ]
          }
        },
        lineStyle: {
          width: 3,
          shadowColor: "rgba(236, 72, 153, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 10
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(236, 72, 153, 0.3)" },
            { offset: 1, color: "rgba(236, 72, 153, 0.1)" }
          ])
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
          label: {
            position: "start",
            formatter: "平均: {c}"
          }
        }
      }
    ]
  };

  chartInstance.setOption(option, { notMerge: true });
};

// 监听属性变化
watch(
  () => [props.timeRange, props.chartType],
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

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeListener);
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
    });
  }
});
</script>

<style lang="scss" scoped>
.trend-chart-wrapper {
  height: 100%;
  .trend-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
