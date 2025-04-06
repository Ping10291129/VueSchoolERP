<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card shadow="hover" class="welcome-card">
        <div class="welcome-content">
          <div class="welcome-info">
            <h1>欢迎回来，管理员</h1>
            <p>
              今天是 {{ currentDate }}，
              <el-tooltip :content="cityInfo" placement="top">
                <span class="weather-info">{{ weatherDisplay }}</span>
              </el-tooltip>
            </p>
            <div class="quick-actions">
              <el-button type="primary" @click="emit('showPublishDialog')">
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
              <el-button @click="openSystemSettings">
                <el-icon>
                  <Setting />
                </el-icon>
                系统设置
              </el-button>
            </div>
          </div>
          <div class="welcome-stats">
            <div class="stat-item theme-bg">
              <div class="stat-value">{{ systemUptime }}</div>
              <div class="stat-label">系统运行时间</div>
            </div>
            <div class="stat-item theme-bg">
              <div class="stat-value">{{ onlineUsers }}</div>
              <div class="stat-label">在线用户</div>
            </div>
            <div class="stat-item theme-bg">
              <div class="stat-value">{{ todayLogins }}</div>
              <div class="stat-label">今日登录</div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onMounted } from "vue";
import { Bell, Document, Setting } from "@element-plus/icons-vue";
import axios from "axios";
import mittBus from "@/utils/mittBus";

defineProps<{
  onlineUsers: number;
  todayLogins: number;
  systemUptime: string;
  weatherInfo?: string;
}>();

const emit = defineEmits<{
  (e: "showPublishDialog"): void;
}>();

// 天气信息
const weatherData = ref({
  temperature: 0,
  weathercode: 0,
  description: "加载中...",
  isLoading: true
});

// 位置信息
const locationData = ref({
  city: "正在获取位置...",
  latitude: 0,
  longitude: 0,
  permissionStatus: "pending" // pending, granted, denied
});

// 城市信息提示
const cityInfo = computed(() => {
  if (locationData.value.permissionStatus === "denied") {
    return `默认位置：${locationData.value.city} (${locationData.value.latitude}, ${locationData.value.longitude})`;
  } else if (locationData.value.permissionStatus === "pending") {
    return "正在获取位置信息...";
  }
  return `${locationData.value.city} (${locationData.value.latitude}, ${locationData.value.longitude})`;
});

// 天气图标映射
const weatherIcons = {
  0: "晴朗", // Clear sky
  1: "晴间多云", // Mainly clear
  2: "多云", // Partly cloudy
  3: "阴天", // Overcast
  45: "雾", // Fog
  48: "雾凇", // Depositing rime fog
  51: "小毛毛雨", // Light drizzle
  53: "毛毛雨", // Moderate drizzle
  55: "大毛毛雨", // Dense drizzle
  56: "冻毛毛雨", // Light freezing drizzle
  57: "冻雨", // Dense freezing drizzle
  61: "小雨", // Slight rain
  63: "中雨", // Moderate rain
  65: "大雨", // Heavy rain
  66: "冻小雨", // Light freezing rain
  67: "冻大雨", // Heavy freezing rain
  71: "小雪", // Slight snow fall
  73: "中雪", // Moderate snow fall
  75: "大雪", // Heavy snow fall
  77: "雪粒", // Snow grains
  80: "小阵雨", // Slight rain showers
  81: "中阵雨", // Moderate rain showers
  82: "暴雨", // Violent rain showers
  85: "小阵雪", // Slight snow showers
  86: "大阵雪", // Heavy snow showers
  95: "雷暴", // Thunderstorm
  96: "雷暴伴小冰雹", // Thunderstorm with slight hail
  99: "雷暴伴冰雹" // Thunderstorm with heavy hail
};

// 格式化显示的天气信息
const weatherDisplay = computed(() => {
  if (weatherData.value.isLoading) {
    return "正在获取天气...";
  }
  const description = weatherIcons[weatherData.value.weathercode] || "未知天气";
  return `${description} ${weatherData.value.temperature}°C`;
});

// 当前日期
const currentDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${
    ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()]
  }`;
});

// 打开系统设置侧边栏
const openSystemSettings = () => {
  mittBus.emit("openThemeDrawer");
};

// 获取当前位置
const getCurrentLocation = () => {
  // 初始化为加载状态
  weatherData.value.isLoading = true;

  // 提示用户正在请求位置信息
  console.log("正在请求位置信息...");

  // 检查是否为本地开发环境(非https)
  const isLocalDevelopment =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "http:";

  // 对于本地开发环境，直接使用默认位置（因为现代浏览器在非安全源上拒绝地理位置请求）
  if (isLocalDevelopment) {
    console.warn("本地开发环境或非HTTPS连接，地理位置API可能不可用。使用默认位置。");
    locationData.value.permissionStatus = "denied";
    useDefaultLocation();
    return;
  }

  // 尝试使用浏览器地理位置 API
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // 用户同意授权，获取到位置
        console.log("位置获取成功");
        locationData.value.permissionStatus = "granted";

        // 成功获取位置
        const { latitude, longitude } = position.coords;
        locationData.value = {
          city: "正在获取城市...",
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          permissionStatus: "granted"
        };

        // 获取到位置后再获取天气
        fetchWeatherData(latitude, longitude);

        // 获取城市名称
        fetchCityName(latitude, longitude);
      },
      error => {
        // 用户拒绝授权或其他错误
        console.error("获取位置信息失败:", error.message);
        locationData.value.permissionStatus = "denied";

        // 告知用户位置获取失败的具体原因
        let errorMsg = "无法获取您的位置";
        if (error.code === 1) {
          errorMsg = "您拒绝了位置访问权限，将使用默认位置信息";
        } else if (error.code === 2) {
          errorMsg = "网络问题导致无法获取位置信息，将使用默认位置信息";
        } else if (error.code === 3) {
          errorMsg = "获取位置超时，将使用默认位置信息";
        } else if (error.message && error.message.includes("Only secure origins")) {
          errorMsg = "非安全源（需要HTTPS）不允许获取位置，将使用默认位置信息";
        }
        console.warn(errorMsg);

        // 用户拒绝授权或其他错误，使用上海的默认值
        useDefaultLocation();
      },
      // 定位选项
      {
        enableHighAccuracy: true, // 高精度
        timeout: 10000, // 超时时间：10秒
        maximumAge: 0 // 不使用缓存
      }
    );
  } else {
    // 浏览器不支持地理位置 API
    console.error("您的浏览器不支持地理位置功能");
    locationData.value.permissionStatus = "denied";
    // 使用默认值（上海）
    useDefaultLocation();
  }
};

// 使用默认位置（上海）
const useDefaultLocation = () => {
  locationData.value = {
    city: "上海",
    latitude: 31.23,
    longitude: 121.47,
    permissionStatus: "denied"
  };

  // 使用上海的坐标获取天气
  fetchWeatherData(31.23, 121.47);
};

// 获取城市名称 - 使用更可靠的方法
const fetchCityName = async (latitude: number, longitude: number) => {
  try {
    // 使用 Nominatim 开源地理编码服务获取城市名称
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&accept-language=zh-CN`
    );

    if (response.data && response.data.address) {
      const address = response.data.address;
      // 优先使用中文命名
      const city = address.city || address.town || address.county || address.state || "未知城市";
      locationData.value.city = city;
    }
  } catch (error) {
    console.error("获取城市名称失败:", error);
    locationData.value.city = "未能获取城市名称";
  }
};

// 获取天气数据
const fetchWeatherData = async (latitude: number, longitude: number) => {
  try {
    weatherData.value.isLoading = true;

    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (response.data && response.data.current_weather) {
      weatherData.value = {
        temperature: response.data.current_weather.temperature,
        weathercode: response.data.current_weather.weathercode,
        description: weatherIcons[response.data.current_weather.weathercode] || "未知天气",
        isLoading: false
      };
    }
  } catch (error) {
    console.error("获取天气数据失败:", error);
    weatherData.value.isLoading = false;
    weatherData.value.description = "获取天气失败";
    weatherData.value.temperature = 24;
    weatherData.value.weathercode = 1;
  }
};

onMounted(() => {
  getCurrentLocation();
});
</script>

<style scoped lang="scss">
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
        .weather-info {
          padding: 2px 4px;
          color: var(--el-color-primary);
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
          &:hover {
            background-color: rgba(var(--el-color-primary-rgb), 0.1);
          }
        }
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
        border-radius: 4px;
        transition: all 0.3s;
        &.theme-bg {
          background-color: rgba(var(--el-color-primary-rgb), 0.08);
          border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
          box-shadow: 0 2px 12px 0 rgba(var(--el-color-primary-rgb), 0.05);
          &:hover {
            background-color: rgba(var(--el-color-primary-rgb), 0.12);
          }
        }
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
</style>
