import dayjs from "dayjs";

// 生成模拟数据
export const generateMockData = () => {
  const now = dayjs();
  const fullDataX: string[] = [];
  const dataMale: number[] = [];
  const dataFemale: number[] = [];

  // 生成最近60天的数据
  for (let i = 59; i >= 0; i--) {
    const date = now.subtract(i, "day");
    fullDataX.push(date.format("MM-DD"));

    // 生成随机数据 - 课外活动和课堂活动参与人数
    const baseValue = Math.sin(i / 10) * 20 + 80; // 使用正弦函数生成基础值
    dataMale.push(Math.floor(baseValue + Math.random() * 30));
    dataFemale.push(Math.floor(baseValue + Math.random() * 30 - 10));
  }

  return {
    fullDataX,
    dataMale,
    dataFemale
  };
};
