import dayjs from "dayjs";
// 添加插件支持相对时间
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export const formatSpecialDate = (input?: string | Date): string => {
  // 将输入转换为 dayjs 对象，并设置时间为 08:12
  const date = dayjs(input).hour(8).minute(12).second(0).millisecond(0);
  const now = dayjs();

  // 计算两个日期之间的差异（以天为单位）
  const diffDays = now.diff(date, "day");

  // 判断是否在7天内，并构建相应的输出字符串
  if (diffDays >= 0 && diffDays <= 7) {
    let prefix = "";
    switch (diffDays) {
      case 0:
        prefix = "今天";
        break;
      case 1:
        prefix = "昨天";
        break;
      default:
        prefix = `${diffDays}天前`;
    }
    return `${prefix} ${date.format("HH:mm")}`;
  } else {
    // 如果超过了7天，则使用 YYYY-MM-DD HH:mm 格式
    return date.format("YYYY-MM-DD HH:mm");
  }
};
