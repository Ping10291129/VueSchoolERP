<template>
  <div class="dist-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const updateChart = () => {
  if (!chartInstance) return;

  const isDark = document.documentElement.classList.contains("dark");

  const option = {
    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "rgba(30, 36, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: isDark ? "#ffffff" : "#303133",
        fontSize: 13
      },
      extraCssText: "backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 4px;",
      formatter: (params: any) => {
        const { name, value, percent } = params;
        const total = chartInstance!.getOption().series[0].data.reduce((sum: number, item: any) => sum + item.value, 0);

        return `
          <div style="font-weight:500;margin-bottom:8px">${name}</div>
          <div style="display:flex;justify-content:space-between;margin:5px 0">
            <span>人数：</span>
            <span style="font-weight:500">${value}人</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin:5px 0">
            <span>占比：</span>
            <span style="font-weight:500">${percent.toFixed(1)}%</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:5px;border-top:1px solid ${
            isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          };padding-top:5px">
            <span>总人数：</span>
            <span style="font-weight:500">${total}人</span>
          </div>
        `;
      }
    },
    legend: {
      orient: "vertical",
      left: "left",
      padding: 20,
      itemWidth: 10,
      itemHeight: 10,
      icon: "circle",
      textStyle: {
        color: isDark ? "#E5EAF3" : "#303133"
      }
    },
    series: [
      {
        name: "教师分布",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: isDark ? "#1d1e1f" : "#ffffff",
          borderWidth: 1.5
        },
        label: {
          show: false
        },
        emphasis: {
          disabled: false,
          scale: false,
          label: {
            show: true,
            position: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: isDark ? "#E5EAF3" : "#303133"
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
  };

  chartInstance.setOption(option);
};

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    updateChart();

    const resizeHandler = () => chartInstance?.resize();
    window.addEventListener("resize", resizeHandler);

    // 监听主题变化
    const observer = new MutationObserver(() => {
      chartInstance?.dispose();
      chartInstance = echarts.init(chartRef.value!);
      updateChart();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeHandler);
      observer.disconnect();
      chartInstance?.dispose();
    });
  }
});
</script>

<style lang="scss" scoped>
.dist-chart {
  width: 100%;
  height: 100%;
}
</style>
