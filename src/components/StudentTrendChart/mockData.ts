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

    // 生成随机数据
    dataMale.push(Math.floor(Math.random() * 100) + 50);
    dataFemale.push(Math.floor(Math.random() * 100) + 50);
  }

  return {
    fullDataX,
    dataMale,
    dataFemale
  };
};
