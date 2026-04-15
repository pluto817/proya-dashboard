// 用户类型定义
export interface User {
  id: string;
  gender: string;
  age: number;
  skinType: string;
  isMember: boolean;
  province: string;
  rScore: number;
  fScore: number;
  mScore: number;
  userCategory: string;
  clusterName: string;
  ite: number;
  upliftType: 'sensitive' | 'natural' | 'adverse' | 'sleeping';
  preferredSeries: string[];
  recommendedProduct: string;
}

// 订单类型定义
export interface Order {
  orderId: string;
  userId: string;
  orderTime: string;
  category: string;
  subCategory: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  isMember: boolean;
}

// 关联规则类型
export interface AssociationRule {
  antecedents: string;
  consequents: string;
  support: number;
  confidence: number;
  lift: number;
}

// RFM分类统计
export interface RFMStats {
  category: string;
  avgR: number;
  avgF: number;
  avgM: number;
  avgRScore: number;
  avgFScore: number;
  avgMScore: number;
  compositeScore: number;
  userCount: number;
  percentage: string;
}

// Uplift分类统计
export interface UpliftStats {
  type: string;
  count: number;
  percentage: string;
  avgITE: number;
  description: string;
}

// 私信模板
export interface MessageTemplate {
  id: string;
  name: string;
  style: 'gentle' | 'promotional' | 'vip';
  content: string;
  suitableFor: string[];
}

// 产品系列
export interface ProductSeries {
  name: string;
  description: string;
  mainEffect: string;
  suitableSkin: string[];
  matchScore: Record<string, number>;
}

// 策略建议
export interface StrategyRecommendation {
  userType: string;
  shouldContact: boolean;
  recommendedSeries: string;
  discountStrategy: string;
  tone: string;
  messageFocus: string[];
}
