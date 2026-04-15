import type { User, AssociationRule, RFMStats, UpliftStats, ProductSeries, MessageTemplate } from '@/types';

// 生成10000个用户数据（基于CSV文件数据结构）
function generateUsers(): User[] {
  const users: User[] = [];
  const provinces = ['广东省', '浙江省', '江苏省', '北京市', '上海市', '山东省', '河南省', '四川省', '湖南省', '湖北省'];
  
  // 预定义用户数据模式
  const userPatterns: Array<{
    category: '核心价值用户' | '潜力发展用户' | '高价值沉睡用户' | '低价值/流失用户';
    cluster: string;
    rScore: number;
    fScore: number;
    mScore: number;
    uplift: 'sensitive' | 'natural' | 'sleeping' | 'adverse';
    iteBase: number;
  }> = [
    // 核心价值用户模式
    { category: '核心价值用户', cluster: '簇0_全效臻选型', rScore: 5, fScore: 4, mScore: 5, uplift: 'sensitive', iteBase: 0.1 },
    { category: '核心价值用户', cluster: '簇0_全效臻选型', rScore: 4, fScore: 4, mScore: 5, uplift: 'sensitive', iteBase: 0.12 },
    { category: '核心价值用户', cluster: '簇0_全效臻选型', rScore: 5, fScore: 5, mScore: 5, uplift: 'sensitive', iteBase: 0.14 },
    // 潜力发展用户模式
    { category: '潜力发展用户', cluster: '簇4_抗氧清爽型', rScore: 4, fScore: 3, mScore: 4, uplift: 'natural', iteBase: 0.07 },
    { category: '潜力发展用户', cluster: '簇4_抗氧清爽型', rScore: 3, fScore: 3, mScore: 4, uplift: 'natural', iteBase: 0.08 },
    { category: '潜力发展用户', cluster: '簇2_修护保湿型', rScore: 4, fScore: 3, mScore: 4, uplift: 'natural', iteBase: 0.09 },
    // 高价值沉睡用户模式
    { category: '高价值沉睡用户', cluster: '簇3_功效深研型', rScore: 3, fScore: 2, mScore: 3, uplift: 'sleeping', iteBase: 0.05 },
    { category: '高价值沉睡用户', cluster: '簇3_功效深研型', rScore: 2, fScore: 2, mScore: 3, uplift: 'sleeping', iteBase: 0.06 },
    // 低价值/流失用户模式
    { category: '低价值/流失用户', cluster: '簇1_修护基础型', rScore: 2, fScore: 1, mScore: 2, uplift: 'adverse', iteBase: -0.03 },
    { category: '低价值/流失用户', cluster: '簇6_清爽抗氧型', rScore: 1, fScore: 1, mScore: 1, uplift: 'adverse', iteBase: -0.02 }
  ];

  const preferredSeriesOptions = [
    ['源力系列', '红宝石系列'],
    ['双抗系列', '基础保湿系列'],
    ['红宝石系列', '能量系列'],
    ['能量系列', '双抗系列'],
    ['源力系列', '双抗系列'],
    ['红宝石系列', '基础保湿系列'],
    ['能量系列'],
    ['源力系列'],
    ['双抗系列'],
    ['红宝石系列']
  ];

  for (let i = 1; i <= 10000; i++) {
    const id = `U${String(i).padStart(8, '0')}`;
    const pattern = userPatterns[Math.floor(Math.random() * userPatterns.length)];
    
    // 女性用户占70%
    const gender = Math.random() < 0.7 ? '女' : '男';
    
    // 根据类别调整年龄
    let age: number;
    if (pattern.category === '核心价值用户') {
      age = Math.floor(Math.random() * 25) + 25; // 25-50岁
    } else if (pattern.category === '潜力发展用户') {
      age = Math.floor(Math.random() * 20) + 22; // 22-42岁
    } else if (pattern.category === '高价值沉睡用户') {
      age = Math.floor(Math.random() * 30) + 20; // 20-50岁
    } else {
      age = Math.floor(Math.random() * 35) + 18; // 18-53岁
    }

    // 根据性别选择肤质分布
    let skinType: string;
    const skinRand = Math.random();
    if (gender === '女') {
      if (skinRand < 0.35) skinType = '敏感肌';
      else if (skinRand < 0.60) skinType = '油性/混油';
      else if (skinRand < 0.85) skinType = '干性/混干';
      else skinType = '中性';
    } else {
      if (skinRand < 0.20) skinType = '敏感肌';
      else if (skinRand < 0.55) skinType = '油性/混油';
      else if (skinRand < 0.75) skinType = '干性/混干';
      else skinType = '中性';
    }

    // 根据类别确定会员状态
    const isMember = pattern.category === '核心价值用户' || pattern.category === '潜力发展用户' ? Math.random() < 0.7 : Math.random() < 0.3;

    // 随机选择省份
    const province = provinces[Math.floor(Math.random() * provinces.length)];

    // 计算ITE值
    const ite = pattern.iteBase + (Math.random() - 0.5) * 0.05;

    // 选择偏好系列
    const preferredSeries = preferredSeriesOptions[Math.floor(Math.random() * preferredSeriesOptions.length)];

    users.push({
      id,
      gender,
      age,
      skinType,
      isMember,
      province,
      rScore: pattern.rScore,
      fScore: pattern.fScore,
      mScore: pattern.mScore,
      userCategory: pattern.category,
      clusterName: pattern.cluster,
      ite: Math.round(ite * 1000) / 1000,
      upliftType: pattern.uplift,
      preferredSeries
    });
  }

  return users;
}

// 模拟用户数据（500个用户）
export const mockUsers: User[] = generateUsers();

// 生成智能私信用户数据（基于CSV文件，100个用户）
function generateMessageUsers(): User[] {
  const users: User[] = [];
  const provinces = ['广东省', '浙江省', '江苏省', '北京市', '上海市', '山东省', '河南省', '四川省', '湖南省', '湖北省'];
  
  // 从CSV文件中提取的100个用户数据
  const csvUsers = [
    { id: 'U00000001', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000002', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000003', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000004', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000005', skinType: '敏感肌', skinIssue: '敏感泛红' },
    { id: 'U00000006', skinType: '干性/混干', skinIssue: '干燥缺水' },
    { id: 'U00000007', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000008', skinType: '敏感肌', skinIssue: '敏感泛红' },
    { id: 'U00000009', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000010', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000011', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000012', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000013', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000014', skinType: '中性', skinIssue: '敏感泛红' },
    { id: 'U00000015', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000016', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000017', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000018', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000019', skinType: '敏感肌', skinIssue: '松弛下垂' },
    { id: 'U00000020', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000021', skinType: '中性', skinIssue: '暗沉发黄' },
    { id: 'U00000022', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000023', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000025', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000026', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000027', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000030', skinType: '中性', skinIssue: '暗沉发黄' },
    { id: 'U00000032', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000033', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000034', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000035', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000036', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000037', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000038', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000039', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000040', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000041', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000042', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000043', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000044', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000045', skinType: '干性/混干', skinIssue: '细纹皱纹' },
    { id: 'U00000046', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000047', skinType: '敏感肌', skinIssue: '干燥缺水' },
    { id: 'U00000048', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000049', skinType: '干性/混干', skinIssue: '细纹皱纹' },
    { id: 'U00000050', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000051', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000052', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000053', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000054', skinType: '敏感肌', skinIssue: '干燥缺水' },
    { id: 'U00000055', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000056', skinType: '中性', skinIssue: '干燥缺水' },
    { id: 'U00000057', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000058', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000059', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000060', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000061', skinType: '中性', skinIssue: '细纹皱纹' },
    { id: 'U00000062', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000063', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000064', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000065', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000066', skinType: '干性/混干', skinIssue: '敏感泛红' },
    { id: 'U00000067', skinType: '中性', skinIssue: '暗沉发黄' },
    { id: 'U00000068', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000069', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000070', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000071', skinType: '中性', skinIssue: '暗沉发黄' },
    { id: 'U00000072', skinType: '敏感肌', skinIssue: '干燥缺水' },
    { id: 'U00000073', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000074', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000075', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000076', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000077', skinType: '干性/混干', skinIssue: '干燥缺水' },
    { id: 'U00000078', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000079', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000080', skinType: '油性/混油', skinIssue: '干燥缺水' },
    { id: 'U00000081', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000082', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000083', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000084', skinType: '敏感肌', skinIssue: '敏感泛红' },
    { id: 'U00000085', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000086', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000087', skinType: '敏感肌', skinIssue: '干燥缺水' },
    { id: 'U00000088', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000089', skinType: '敏感肌', skinIssue: '暗沉发黄' },
    { id: 'U00000090', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000091', skinType: '中性', skinIssue: '敏感泛红' },
    { id: 'U00000092', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000093', skinType: '中性', skinIssue: '暗沉发黄' },
    { id: 'U00000094', skinType: '干性/混干', skinIssue: '暗沉发黄' },
    { id: 'U00000095', skinType: '干性/混干', skinIssue: '干燥缺水' },
    { id: 'U00000096', skinType: '干性/混干', skinIssue: '细纹皱纹' },
    { id: 'U00000097', skinType: '油性/混油', skinIssue: '暗沉发黄' },
    { id: 'U00000098', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000099', skinType: '油性/混油', skinIssue: '细纹皱纹' },
    { id: 'U00000100', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000102', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000103', skinType: '敏感肌', skinIssue: '细纹皱纹' },
    { id: 'U00000104', skinType: '油性/混油', skinIssue: '敏感泛红' },
    { id: 'U00000105', skinType: '敏感肌', skinIssue: '细纹皱纹' }
  ];

  // 预定义用户数据模式
  const userPatterns: Array<{
    category: '核心价值用户' | '潜力发展用户' | '高价值沉睡用户' | '低价值/流失用户';
    cluster: string;
    rScore: number;
    fScore: number;
    mScore: number;
    uplift: 'sensitive' | 'natural' | 'sleeping' | 'adverse';
    iteBase: number;
  }> = [
    { category: '核心价值用户', cluster: '簇0_全效臻选型', rScore: 5, fScore: 4, mScore: 5, uplift: 'sensitive', iteBase: 0.1 },
    { category: '潜力发展用户', cluster: '簇4_抗氧清爽型', rScore: 4, fScore: 3, mScore: 4, uplift: 'natural', iteBase: 0.07 },
    { category: '高价值沉睡用户', cluster: '簇3_功效深研型', rScore: 3, fScore: 2, mScore: 3, uplift: 'sleeping', iteBase: 0.05 },
    { category: '低价值/流失用户', cluster: '簇1_修护基础型', rScore: 2, fScore: 1, mScore: 2, uplift: 'adverse', iteBase: -0.03 }
  ];

  const preferredSeriesOptions = [
    ['源力系列', '红宝石系列'],
    ['双抗系列', '基础保湿系列'],
    ['红宝石系列', '能量系列'],
    ['能量系列', '双抗系列'],
    ['源力系列', '双抗系列'],
    ['红宝石系列', '基础保湿系列'],
    ['能量系列'],
    ['源力系列'],
    ['双抗系列'],
    ['红宝石系列']
  ];

  csvUsers.forEach((csvUser) => {
    const pattern = userPatterns[Math.floor(Math.random() * userPatterns.length)];
    
    // 女性用户占70%
    const gender = Math.random() < 0.7 ? '女' : '男';
    
    // 年龄在20-60岁之间
    const age = Math.floor(Math.random() * 40) + 20;
    
    // 根据用户类别调整会员状态
    const isMember = pattern.category === '核心价值用户' 
      ? Math.random() < 0.8
      : Math.random() < 0.4;
    
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const ite = pattern.iteBase + (Math.random() * 0.04 - 0.02);
    const preferredSeries = preferredSeriesOptions[Math.floor(Math.random() * preferredSeriesOptions.length)];
    
    users.push({
      id: csvUser.id,
      gender,
      age,
      skinType: csvUser.skinType,
      isMember,
      province,
      rScore: pattern.rScore,
      fScore: pattern.fScore,
      mScore: pattern.mScore,
      userCategory: pattern.category,
      clusterName: pattern.cluster,
      ite: Math.round(ite * 1000) / 1000,
      upliftType: pattern.uplift,
      preferredSeries
    });
  });

  return users;
}

// 智能私信用户数据（100个用户）
export const messageUsers: User[] = generateMessageUsers();

// 关联规则数据（基于表格数据）
export const associationRules: AssociationRule[] = [
  { antecedents: '套装', consequents: '精华', support: 0.094, confidence: 0.466, lift: 1.272 },
  { antecedents: '眼霜', consequents: '精华', support: 0.093, confidence: 0.463, lift: 1.264 },
  { antecedents: '面霜', consequents: '精华', support: 0.094, confidence: 0.463, lift: 1.263 },
  { antecedents: '精华', consequents: '面霜', support: 0.094, confidence: 0.257, lift: 1.263 },
  { antecedents: '精华', consequents: '套装', support: 0.094, confidence: 0.257, lift: 1.272 },
  { antecedents: '精华', consequents: '眼霜', support: 0.093, confidence: 0.254, lift: 1.264 }
];

// RFM分类统计数据（基于CSV文件数据）
export const rfmStats: RFMStats[] = [
  { category: '核心价值用户', avgR: 35.27, avgF: 3.81, avgM: 2668.93, avgRScore: 4.34, avgFScore: 4.12, avgMScore: 4.85, compositeScore: 4.48, userCount: 38501, percentage: '41.97%' },
  { category: '潜力发展用户', avgR: 113.11, avgF: 2.43, avgM: 1667.98, avgRScore: 2.54, avgFScore: 3.31, avgMScore: 4.35, compositeScore: 3.49, userCount: 31281, percentage: '34.10%' },
  { category: '高价值沉睡用户', avgR: 180.02, avgF: 1.30, avgM: 727.54, avgRScore: 1.83, avgFScore: 2.30, avgMScore: 3.13, compositeScore: 2.49, userCount: 17732, percentage: '19.33%' },
  { category: '低价值/流失用户', avgR: 230.90, avgF: 1.00, avgM: 206.81, avgRScore: 1.34, avgFScore: 2.00, avgMScore: 1.38, compositeScore: 1.55, userCount: 4227, percentage: '4.61%' }
];

// Uplift分类统计数据
export const upliftStats: UpliftStats[] = [
  { type: '敏感型', count: 7530, percentage: '30.0%', avgITE: 0.126, description: '营销带来显著正向增量' },
  { type: '自然转化型', count: 17507, percentage: '69.7%', avgITE: 0.069, description: '不论是否营销都会购买' },
  { type: '反作用型', count: 65, percentage: '0.3%', avgITE: -0.025, description: '营销反而抑制购买意愿' },
  { type: '沉睡型', count: 0, percentage: '0.0%', avgITE: 0, description: '任何干预均无效' }
];

// 产品系列数据
export const productSeries: ProductSeries[] = [
  {
    name: '源力系列',
    description: '专为敏感肌设计，主打修护屏障',
    mainEffect: '修护',
    suitableSkin: ['敏感肌', '干性/混干'],
    matchScore: { '敏感肌': 0.95, '干性/混干': 0.60, '油性/混油': 0.40, '中性': 0.50 }
  },
  {
    name: '红宝石系列',
    description: '抗皱抗老明星产品，A醇成分',
    mainEffect: '抗皱',
    suitableSkin: ['干性/混干', '中性'],
    matchScore: { '敏感肌': 0.30, '干性/混干': 0.85, '油性/混油': 0.50, '中性': 0.60 }
  },
  {
    name: '双抗系列',
    description: '抗氧化提亮，清爽质地',
    mainEffect: '抗氧化',
    suitableSkin: ['油性/混油', '中性'],
    matchScore: { '敏感肌': 0.40, '干性/混干': 0.40, '油性/混油': 0.85, '中性': 0.60 }
  },
  {
    name: '能量系列',
    description: '抗衰紧致，熟龄肌首选',
    mainEffect: '抗衰',
    suitableSkin: ['干性/混干', '中性'],
    matchScore: { '敏感肌': 0.20, '干性/混干': 0.50, '油性/混油': 0.30, '中性': 0.50 }
  },
  {
    name: '基础保湿系列',
    description: '温和补水，适合日常护理',
    mainEffect: '保湿',
    suitableSkin: ['敏感肌', '干性/混干', '油性/混油', '中性'],
    matchScore: { '敏感肌': 0.50, '干性/混干': 0.70, '油性/混油': 0.50, '中性': 0.60 }
  }
];

// 私信模板
export const messageTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: '温和关怀版',
    style: 'gentle',
    content: '亲爱的{username}，注意到您的肌肤属于{skinType}，我们为您精选了{series}，{effect}。专属礼遇：{discount}，期待为您带来温柔的护肤体验。',
    suitableFor: ['敏感肌', '干性/混干']
  },
  {
    id: '2',
    name: '促销转化版',
    style: 'promotional',
    content: '限时特惠！{username}，{series}正在热抢中！{effect}，现在下单立享{discount}，错过再等一年！',
    suitableFor: ['敏感型', '高优惠敏感']
  },
  {
    id: '3',
    name: '会员专属版',
    style: 'vip',
    content: '尊敬的VIP会员{username}，作为我们的核心价值用户，您可优先体验{series}，{effect}。专属福利：{discount}，感谢您的信任与支持。',
    suitableFor: ['会员', '核心价值用户']
  }
];

// 肤质-产品匹配度矩阵（来自CSV文件数据）
export const skinProductMatrix: Record<string, Record<string, number>> = {
  '敏感肌': { '源力系列': 0.95, '红宝石系列': 0.3, '双抗系列': 0.4, '能量系列': 0.2, '基础保湿系列': 0.5 },
  '油性/混油': { '源力系列': 0.4, '红宝石系列': 0.5, '双抗系列': 0.85, '能量系列': 0.3, '基础保湿系列': 0.5 },
  '干性/混干': { '源力系列': 0.6, '红宝石系列': 0.85, '双抗系列': 0.4, '能量系列': 0.5, '基础保湿系列': 0.7 },
  '中性': { '源力系列': 0.5, '红宝石系列': 0.6, '双抗系列': 0.6, '能量系列': 0.5, '基础保湿系列': 0.6 }
};

// 核心指标数据
export const coreMetrics = {
  totalUsers: 10000,
  totalOrders: 393211,
  totalSales: 168707797.40,
  totalSalesQuantity: 573406,
  sensitiveUsers: 7530,
  sensitivePercentage: 30.0,
  roiImprovement: 76.2,
  adverseUsers: 65,
  adversePercentage: 0.3,
  qiniCoefficient: 0.080,
  avgUplift: 8.70
};

// 月销量数据（从CSV文件导入）
export const monthlySales = [
  { month: '2025-03', sales: 6309, revenue: 273.13 },
  { month: '2025-04', sales: 17235, revenue: 741.09 },
  { month: '2025-05', sales: 24867, revenue: 1073.76 },
  { month: '2025-06', sales: 52066, revenue: 2234.79 },
  { month: '2025-07', sales: 17499, revenue: 749.80 },
  { month: '2025-08', sales: 24904, revenue: 1069.46 },
  { month: '2025-09', sales: 24249, revenue: 1035.90 },
  { month: '2025-10', sales: 25075, revenue: 1087.37 },
  { month: '2025-11', sales: 68000, revenue: 2911.63 },
  { month: '2025-12', sales: 31021, revenue: 1332.46 },
  { month: '2026-01', sales: 30499, revenue: 1310.54 },
  { month: '2026-02', sales: 34869, revenue: 1487.33 },
  { month: '2026-03', sales: 36618, revenue: 1563.53 }
];

// 用户画像分布
export const userProfileDistribution = {
  gender: { '女': 70.1, '男': 29.9 },
  skinType: { '敏感肌': 35.1, '油性/混油': 27.9, '干性/混干': 22.0, '中性': 15.0 },
  memberStatus: { '会员': 47.0, '非会员': 53.0 },
  topProvinces: ['广东省', '浙江省', '江苏省', '北京市', '上海市', '山东省', '河南省', '四川省', '湖南省', '湖北省'],
  provinceDistribution: {
    '广东省': 17035,
    '浙江省': 14351,
    '江苏省': 12721,
    '北京市': 11353,
    '上海市': 10164,
    '山东省': 8628,
    '河南省': 7176,
    '四川省': 7066,
    '湖南省': 5774,
    '湖北省': 5732
  }
};

// K-means 聚类结果（基于CSV文件数据）
export const kmeansClusters = [
  {
    name: '簇0_全效臻选型',
    count: 2077,
    color: '#F9A8D4',
    valueLevel: '高价值',
    coreNeeds: '抗衰 + 修护',
    activityLevel: '高',
    percentage: '20.77%',
    productLine: '红宝石系列 + 源力系列',
    marketingStrategy: '专属会员服务、新品优先体验'
  },
  {
    name: '簇1_修护基础型',
    count: 761,
    color: '#D8B4FE',
    valueLevel: '低价值',
    coreNeeds: '保湿 + 修护',
    activityLevel: '低',
    percentage: '7.61%',
    productLine: '基础保湿线',
    marketingStrategy: '低成本引流活动、首单优惠'
  },
  {
    name: '簇2_修护保湿型',
    count: 582,
    color: '#FBCFE8',
    valueLevel: '中价值',
    coreNeeds: '修护 + 保湿',
    activityLevel: '中',
    percentage: '5.82%',
    productLine: '源力系列',
    marketingStrategy: '常规运营、修护专题推送'
  },
  {
    name: '簇3_功效深研型',
    count: 1302,
    color: '#C4B5FD',
    valueLevel: '中价值',
    coreNeeds: '抗衰 + 修护',
    activityLevel: '低',
    percentage: '13.02%',
    productLine: '红宝石系列',
    marketingStrategy: '沉睡用户唤醒、满减优惠'
  },
  {
    name: '簇4_抗氧清爽型',
    count: 1028,
    color: '#EDE9FE',
    valueLevel: '中价值',
    coreNeeds: '抗衰 + 抗氧化',
    activityLevel: '中',
    percentage: '10.28%',
    productLine: '双抗系列',
    marketingStrategy: '精准产品推荐、组合套装'
  },
  {
    name: '簇5_清爽保湿型',
    count: 1369,
    color: '#FDE68A',
    valueLevel: '中价值',
    coreNeeds: '清爽 + 保湿',
    activityLevel: '中',
    percentage: '13.69%',
    productLine: '油皮专属保湿线',
    marketingStrategy: '肤质匹配推送、夏季专题'
  },
  {
    name: '簇6_清爽抗氧型',
    count: 586,
    color: '#FCD34D',
    valueLevel: '低价值',
    coreNeeds: '抗氧化 + 清爽',
    activityLevel: '低',
    percentage: '5.86%',
    productLine: '基础双抗线',
    marketingStrategy: '入门产品引流、试用装活动'
  },
  {
    name: '簇7_抗衰尝鲜型',
    count: 590,
    color: '#FBBF24',
    valueLevel: '低价值',
    coreNeeds: '抗衰 + 抗皱',
    activityLevel: '低',
    percentage: '5.90%',
    productLine: '基础抗衰线',
    marketingStrategy: '低成本转化、老品折扣'
  },
  {
    name: '簇8_抗衰偏执型',
    count: 870,
    color: '#C4B5FD',
    valueLevel: '中价值',
    coreNeeds: '抗衰 + 抗氧化',
    activityLevel: '中',
    percentage: '8.70%',
    productLine: '双抗系列',
    marketingStrategy: '中频运营、节日促销'
  },
  { 
    name: '簇9_抗衰清爽型', 
    count: 835, 
    color: '#E0E7FF',
    valueLevel: '中价值',
    coreNeeds: '抗衰 + 清爽',
    activityLevel: '中',
    percentage: '8.35%',
    productLine: '清爽抗衰线',
    marketingStrategy: '油皮抗衰专题、控油组合'
  }
];
