<template>
  <el-row :gutter="20">
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
          <div class="icon-wrapper theme-bg">
            <el-icon class="icon">
              <User />
            </el-icon>
          </div>
        </div>
        <div class="card-footer">
          <el-progress :percentage="78" :stroke-width="6" :show-text="false" class="theme-progress" />
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
          <div class="icon-wrapper theme-bg">
            <el-icon class="icon">
              <School />
            </el-icon>
          </div>
        </div>
        <div class="card-footer">
          <el-progress :percentage="92" :stroke-width="6" :show-text="false" class="theme-progress" />
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
          <div class="icon-wrapper theme-bg">
            <el-icon class="icon">
              <Reading />
            </el-icon>
          </div>
        </div>
        <div class="card-footer">
          <el-progress :percentage="65" :stroke-width="6" :show-text="false" class="theme-progress" />
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
          <div class="icon-wrapper theme-bg">
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
            class="theme-progress"
            :status="systemLoad > 80 ? 'exception' : ''"
          />
          <span>CPU负载: {{ systemLoad }}%</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { User, School, Reading, Monitor } from "@element-plus/icons-vue";

defineProps<{
  systemLoad: number;
}>();
</script>

<style scoped lang="scss">
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
      &.theme-bg {
        background-color: rgba(var(--el-color-primary-rgb), 0.1);
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

    // 自定义进度条颜色，跟随主题
    :deep(.theme-progress) {
      .el-progress-bar__inner {
        background-color: var(--el-color-primary) !important;
      }

      // 异常状态保留红色
      &.is-exception .el-progress-bar__inner {
        background-color: var(--el-color-danger) !important;
      }
    }
  }
}
</style>
