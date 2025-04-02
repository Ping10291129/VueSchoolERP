<template>
  <div class="trend-switch">
    <div class="tabs-wrapper">
      <div class="tabs">
        <div class="tabs__slider" :style="sliderStyle"></div>
        <a
          v-for="item in timeRanges"
          :key="item.value"
          href="#"
          :class="['tabs__item', { 'tabs__item--active': localTimeRange === item.value }]"
          @click.prevent="handleTabClick(item.value)"
        >
          {{ item.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface TimeRange {
  label: string;
  value: string;
}

const timeRanges: TimeRange[] = [
  { label: "一周", value: "week" },
  { label: "一月", value: "month" },
  { label: "全部", value: "all" }
];

// 定义组件的props和emits
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// 本地状态
const localTimeRange = ref(props.modelValue);

// 监听props变化
watch(
  () => props.modelValue,
  newVal => {
    localTimeRange.value = newVal;
  }
);

// 计算滑块样式
const sliderStyle = computed(() => {
  const index = timeRanges.findIndex(item => item.value === localTimeRange.value);
  return {
    transform: `translateX(${index * 100}%)`
  };
});

// 处理标签点击事件
const handleTabClick = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.trend-switch {
  display: inline-flex;
  align-items: center;
  .tabs-wrapper {
    position: relative;
    padding: 2px;
    background: var(--el-fill-color-light);
    border-radius: 6px;
  }
  .tabs {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 240px;
    &__slider {
      position: absolute;
      top: 2px;
      left: 2px;
      z-index: 1;
      width: calc((100% - 4px) / 3);
      height: calc(100% - 4px);
      background-color: var(--el-color-primary);
      border-radius: 4px;
      box-shadow: 0 2px 6px 0 rgb(0 0 0 / 5%);
      transition: transform 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
    }
    &__item {
      position: relative;
      z-index: 2;
      flex: 1;
      padding: 6px 0;
      font-size: 13px;
      color: var(--el-text-color-regular);
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s;
      &--active {
        font-weight: 500;
        color: #ffffff;
      }
      &:hover:not(.tabs__item--active) {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
