export interface WaterFallData<T> {
  /**
   * 图片的宽高
   */
  dimensions: {
    width: number;
    height: number;
  };
  /**
   * 原始数据
   */
  sourceData: T;
}

export interface CardPos {
  width: number;
  imgHeight: number;
  x: number;
  y: number;
}

export type WaterFallStatus =
  | "idle" // 空闲状态
  | "computing" // 正在计算初始布局
  | "positioning" // 正在计算真实位置
  | "error"; // 错误状态

export interface WaterFallState {
  cardWidth: number;
  positions: CardPos[];
  columnHeights: number[];
  status: WaterFallStatus;
}

export type WaterFallAction =
  | { type: "SET_CARD_WIDTH"; payload: number }
  | { type: "SET_POSITIONS"; payload: CardPos[] }
  | { type: "SET_COLUMN_HEIGHTS"; payload: number[] }
  | { type: "SET_STATUS"; payload: WaterFallStatus };

export interface WaterFallProps<T> {
  column?: number;
  gap?: number;
  data: WaterFallData<T>[];
  isLoading?: boolean;
  isFinish?: boolean;
  needLoading?: boolean;
  children?: (data: { sourceData: T; imgHeight: number }) => React.ReactNode;
  onReachBottom?: () => void;
}
