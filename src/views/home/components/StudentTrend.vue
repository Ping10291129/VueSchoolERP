<template>
  <el-card class="student-trend">
    <template #header>
      <div class="trend-header">
        <h3>学生趋势</h3>
        <el-button type="primary" link>查看所有</el-button>
      </div>
    </template>
    <div class="trend-content">
      <StudentTrendSwitch v-model="timeRange" class="trend-switch" />
      <StudentTrendChart :time-range="timeRange" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import StudentTrendSwitch from "@/components/StudentTrendSwitch/index.vue";
import StudentTrendChart from "@/components/StudentTrendChart/index.vue";

const timeRange = ref("week");
</script>

<style lang="scss" scoped>
.student-trend {
  height: 100%;
  :deep(.el-card__body) {
    height: calc(100% - 60px);
    padding: 0;
  }
  .trend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }
  .trend-content {
    position: relative;
    height: 100%;
    padding: 20px;
    .trend-switch {
      margin-bottom: 20px;
    }
  }
}
</style>
