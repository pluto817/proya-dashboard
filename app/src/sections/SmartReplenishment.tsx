import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line } from 'recharts';
import { Package, Filter, Download, ChevronDown } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const SmartReplenishment = () => {

  
  // 销量预测数据（从CSV文件导入）
  const salesForecastData = [
    { date: '04/01', forecast: 67.51688, actual: 92, target: 90 },
    { date: '04/02', forecast: 73.1678, actual: 73, target: 80 },
    { date: '04/03', forecast: 48.91318, actual: 53, target: 60 },
    { date: '04/04', forecast: 77.413925, actual: 94, target: 90 },
    { date: '04/05', forecast: 43.904797, actual: 52, target: 60 },
    { date: '04/06', forecast: 100.585175, actual: 76, target: 90 },
    { date: '04/07', forecast: 95.090935, actual: 94, target: 90 },
    { date: '04/08', forecast: 161.21019, actual: 155, target: 160 },
    { date: '04/09', forecast: 83.14915, actual: 79, target: 90 },
    { date: '04/10', forecast: 92.15322, actual: 108, target: 100 },
    { date: '04/11', forecast: 77.578384, actual: 73, target: 80 },
    { date: '04/12', forecast: 47.594254, actual: 56, target: 60 },
    { date: '04/13', forecast: 86.47997, actual: 86, target: 90 },
    { date: '04/14', forecast: 41.230927, actual: 66, target: 60 },
    { date: '04/15', forecast: 95.780846, actual: 89, target: 90 },
    { date: '04/16', forecast: 89.67165, actual: 85, target: 90 },
    { date: '04/17', forecast: 44.424076, actual: 43, target: 50 },
    { date: '04/18', forecast: 76.76226, actual: 97, target: 80 },
    { date: '04/19', forecast: 74.33837, actual: 75, target: 80 },
    { date: '04/20', forecast: 46.107216, actual: 39, target: 50 },
    { date: '04/21', forecast: 78.769684, actual: 53, target: 80 },
    { date: '04/22', forecast: 76.62782, actual: 68, target: 80 },
    { date: '04/23', forecast: 44.933514, actual: 40, target: 50 },
    { date: '04/24', forecast: 157.10724, actual: 139, target: 150 },
    { date: '04/25', forecast: 69.681435, actual: 75, target: 80 },
  ];

  // 动态安全库存数据
  const safetyStockData = [
    { date: '04/01', stock: 12000, target: 12500 },
    { date: '04/02', stock: 11800, target: 12500 },
    { date: '04/03', stock: 11600, target: 12500 },
    { date: '04/04', stock: 11400, target: 12500 },
    { date: '04/05', stock: 11200, target: 12500 },
    { date: '04/06', stock: 11000, target: 12500 },
    { date: '04/07', stock: 11500, target: 12500 },
    { date: '04/08', stock: 11700, target: 12500 },
    { date: '04/09', stock: 11900, target: 12500 },
    { date: '04/10', stock: 12100, target: 12500 },
    { date: '04/11', stock: 12300, target: 12500 },
    { date: '04/12', stock: 12500, target: 12500 },
    { date: '04/13', stock: 12300, target: 12500 },
  ];

  // 补货优先级列表数据（从CSV文件导入）
  const priorityListData = [
    { product: '双抗水乳套装', forecast: 819.9, price: 455.22, priority: 98, suggestion: 373234.73 },
    { product: '双抗精华3.0', forecast: 523.6, price: 444.30, priority: 95, suggestion: 232636.65 },
    { product: '红宝石精华3.0', forecast: 486.2, price: 347.13, priority: 92, suggestion: 168772.19 },
    { product: '红宝石冰陀螺眼霜', forecast: 322.2, price: 326.27, priority: 88, suggestion: 105122.67 },
    { product: '源力面霜2.0', forecast: 272.3, price: 286.62, priority: 85, suggestion: 78047.02 },
    { product: '云朵防晒霜', forecast: 393.9, price: 157.70, priority: 82, suggestion: 62119.92 },
    { product: '红宝石抗皱面霜3.0', forecast: 167.5, price: 306.47, priority: 78, suggestion: 51333.49 },
    { product: '红宝石活肤乳2.0', forecast: 177.7, price: 266.81, priority: 75, suggestion: 47411.41 },
    { product: '双抗精华水', forecast: 209.2, price: 187.43, priority: 72, suggestion: 39209.49 },
    { product: '双抗小夜灯眼霜', forecast: 74.0, price: 256.84, priority: 68, suggestion: 19006.38 },
    { product: '水动力氨基酸洁面乳', forecast: 157.1, price: 78.36, priority: 65, suggestion: 12310.20 },
    { product: '至简密护安瓶精华液', forecast: 3.7, price: 425.46, priority: 60, suggestion: 1574.22 },
    { product: '水动力洁面乳', forecast: 5.4, price: 150.00, priority: 55, suggestion: 810.00 },
    { product: '赋能鲜颜淡纹紧致活肤水', forecast: 4.0, price: 196.38, priority: 50, suggestion: 785.51 },
    { product: '净颜洗面奶', forecast: 6.1, price: 88.28, priority: 45, suggestion: 538.49 },
    { product: '神经酰胺涂抹面膜', forecast: 1.7, price: 157.69, priority: 40, suggestion: 268.07 },
  ];

  // 商品区位熵数据（从CSV文件导入）
  const locationEntropyData = [
    { province: '上海', '云朵防晒霜': 1.05, '净颜洗面奶': 1.38, '双抗小夜灯眼霜': 2.08, '双抗水乳套装': 0.99, '双抗精华3.0': 1.88, '双抗精华水': 1.91, '水动力氨基酸洁面乳': 1.30, '源力面霜2.0': 1.03, '神经酰胺涂抹面膜': 0.97, '红宝石冰陀螺眼霜': 1.97, '红宝石精华3.0': 1.24, '红宝石活肤乳2.0': 1.38, '红宝石抗皱面霜3.0': 1.88, '至简密护安瓶精华液': 1.86, '赋能鲜颜淡纹紧致活水': 1.15 },
    { province: '北京', '云朵防晒霜': 0.51, '净颜洗面奶': 0.90, '双抗小夜灯眼霜': 1.79, '双抗水乳套装': 1.15, '双抗精华3.0': 0.82, '双抗精华水': 0.78, '水动力氨基酸洁面乳': 1.28, '源力面霜2.0': 0.96, '神经酰胺涂抹面膜': 1.25, '红宝石冰陀螺眼霜': 1.75, '红宝石精华3.0': 1.33, '红宝石活肤乳2.0': 0.85, '红宝石抗皱面霜3.0': 2.48, '至简密护安瓶精华液': 0.93, '赋能鲜颜淡纹紧致活水': 0.91 },
    { province: '四川', '云朵防晒霜': 0.81, '净颜洗面奶': 1.22, '双抗小夜灯眼霜': 1.18, '双抗水乳套装': 1.35, '双抗精华3.0': 1.45, '双抗精华水': 1.56, '水动力氨基酸洁面乳': 1.29, '源力面霜2.0': 0.73, '神经酰胺涂抹面膜': 2.66, '红宝石冰陀螺眼霜': 1.25, '红宝石精华3.0': 0.68, '红宝石活肤乳2.0': 1.01, '红宝石抗皱面霜3.0': 0.87, '至简密护安瓶精华液': 1.18, '赋能鲜颜淡纹紧致活水': 1.07 },
    { province: '山东', '云朵防晒霜': 0.81, '净颜洗面奶': 0.90, '双抗小夜灯眼霜': 1.12, '双抗水乳套装': 1.69, '双抗精华3.0': 0.98, '双抗精华水': 0.92, '水动力氨基酸洁面乳': 0.85, '源力面霜2.0': 1.46, '神经酰胺涂抹面膜': 1.04, '红宝石冰陀螺眼霜': 0.93, '红宝石精华3.0': 1.05, '红宝石活肤乳2.0': 0.95, '红宝石抗皱面霜3.0': 0.87, '至简密护安瓶精华液': 0.63, '赋能鲜颜淡纹紧致活水': 1.38 },
    { province: '广东', '云朵防晒霜': 2.77, '净颜洗面奶': 0.79, '双抗小夜灯眼霜': 1.13, '双抗水乳套装': 1.16, '双抗精华3.0': 1.82, '双抗精华水': 1.84, '水动力氨基酸洁面乳': 0.91, '源力面霜2.0': 0.65, '神经酰胺涂抹面膜': 1.39, '红宝石冰陀螺眼霜': 0.84, '红宝石精华3.0': 0.59, '红宝石活肤乳2.0': 0.90, '红宝石抗皱面霜3.0': 1.09, '至简密护安瓶精华液': 0.92, '赋能鲜颜淡纹紧致活水': 0.92 },
    { province: '江苏', '云朵防晒霜': 1.05, '净颜洗面奶': 0.98, '双抗小夜灯眼霜': 0.86, '双抗水乳套装': 1.82, '双抗精华3.0': 1.15, '双抗精华水': 1.22, '水动力氨基酸洁面乳': 0.77, '源力面霜2.0': 1.13, '神经酰胺涂抹面膜': 1.03, '红宝石冰陀螺眼霜': 0.86, '红宝石精华3.0': 0.92, '红宝石活肤乳2.0': 1.05, '红宝石抗皱面霜3.0': 1.24, '至简密护安瓶精华液': 1.24, '赋能鲜颜淡纹紧致活水': 1.48 },
    { province: '河南', '云朵防晒霜': 1.25, '净颜洗面奶': 1.09, '双抗小夜灯眼霜': 0.45, '双抗水乳套装': 2.01, '双抗精华3.0': 0.85, '双抗精华水': 1.42, '水动力氨基酸洁面乳': 1.61, '源力面霜2.0': 1.16, '神经酰胺涂抹面膜': 0.94, '红宝石冰陀螺眼霜': 0.52, '红宝石精华3.0': 0.97, '红宝石活肤乳2.0': 1.12, '红宝石抗皱面霜3.0': 0.77, '至简密护安瓶精华液': 0.46, '赋能鲜颜淡纹紧致活水': 1.45 },
    { province: '浙江', '云朵防晒霜': 0.95, '净颜洗面奶': 1.09, '双抗小夜灯眼霜': 1.49, '双抗水乳套装': 1.73, '双抗精华3.0': 2.23, '双抗精华水': 2.25, '水动力氨基酸洁面乳': 1.39, '源力面霜2.0': 0.92, '神经酰胺涂抹面膜': 1.32, '红宝石冰陀螺眼霜': 1.45, '红宝石精华3.0': 1.17, '红宝石活肤乳2.0': 1.35, '红宝石抗皱面霜3.0': 0.94, '至简密护安瓶精华液': 0.93, '赋能鲜颜淡纹紧致活水': 0.97 },
    { province: '湖北', '云朵防晒霜': 1.21, '净颜洗面奶': 1.08, '双抗小夜灯眼霜': 1.06, '双抗水乳套装': 1.08, '双抗精华3.0': 1.44, '双抗精华水': 1.36, '水动力氨基酸洁面乳': 1.01, '源力面霜2.0': 1.30, '神经酰胺涂抹面膜': 1.14, '红宝石冰陀螺眼霜': 1.00, '红宝石精华3.0': 1.37, '红宝石活肤乳2.0': 1.18, '红宝石抗皱面霜3.0': 1.40, '至简密护安瓶精华液': 1.42, '赋能鲜颜淡纹紧致活水': 1.23 },
    { province: '湖南', '云朵防晒霜': 1.08, '净颜洗面奶': 1.18, '双抗小夜灯眼霜': 1.17, '双抗水乳套装': 0.85, '双抗精华3.0': 1.49, '双抗精华水': 1.45, '水动力氨基酸洁面乳': 1.84, '源力面霜2.0': 1.03, '神经酰胺涂抹面膜': 2.26, '红宝石冰陀螺眼霜': 1.20, '红宝石精华3.0': 0.64, '红宝石活肤乳2.0': 1.09, '红宝石抗皱面霜3.0': 1.18, '至简密护安瓶精华液': 1.23, '赋能鲜颜淡纹紧致活水': 1.27 }
  ];

  // SKU级大促系数数据（从CSV文件导入）
  const skuPromotionData = [
    { id: 1, name: '双抗精华3.0', coefficient: 7.5, series: '双抗系列', level: '高' },
    { id: 2, name: '红宝石抗皱面霜3.0', coefficient: 7.2, series: '红宝石系列', level: '高' },
    { id: 3, name: '红宝石精华3.0', coefficient: 6.8, series: '红宝石系列', level: '高' },
    { id: 4, name: '双抗小夜灯眼霜', coefficient: 5.8, series: '双抗系列', level: '高' },
    { id: 5, name: '红宝石冰陀螺眼霜', coefficient: 5.5, series: '红宝石系列', level: '中' },
    { id: 6, name: '云朵防晒霜', coefficient: 5.5, series: '防晒/基础护理', level: '中' },
    { id: 7, name: '源力面霜2.0', coefficient: 5.2, series: '源力系列', level: '中' },
    { id: 8, name: '双抗精华水', coefficient: 4.5, series: '双抗系列', level: '中' },
    { id: 9, name: '红宝石活肤乳2.0', coefficient: 4.2, series: '红宝石系列', level: '中' },
    { id: 10, name: '双抗水乳套装', coefficient: 4.0, series: '双抗系列', level: '中' },
    { id: 11, name: '净颜洗面奶', coefficient: 3.5, series: '洁面系列', level: '中' },
    { id: 12, name: '水动力氨基酸洁面乳', coefficient: 3.2, series: '洁面系列', level: '低' },
    { id: 13, name: '赋能鲜颜淡纹紧致活肤水', coefficient: 3.0, series: '其他', level: '低' },
    { id: 14, name: '神经酰胺涂抹面膜', coefficient: 3.0, series: '面膜系列', level: '低' },
    { id: 15, name: '至简密护安瓶精华液', coefficient: 2.8, series: '其他', level: '低' }
  ];

  // 桑基图数据
  const skuData = [
    { source: "大促总备货", target: "双抗系列", value: 7.5 + 5.8 + 4.5 + 4.0 },
    { source: "大促总备货", target: "红宝石系列", value: 7.2 + 6.8 + 5.5 + 4.2 },
    { source: "大促总备货", target: "源力系列", value: 5.2 },
    { source: "大促总备货", target: "防晒/基础护理", value: 5.5 },
    { source: "大促总备货", target: "洁面系列", value: 3.5 + 3.2 },
    { source: "大促总备货", target: "面膜系列", value: 3.0 },
    { source: "大促总备货", target: "其他", value: 3.0 + 2.8 },

    // 双抗系列 → 分档
    { source: "双抗系列", target: "高档位(重点备货)", value: 7.5 + 5.8 },
    { source: "双抗系列", target: "中档位(组合清货)", value: 4.5 + 4.0 },

    // 红宝石系列 → 分档
    { source: "红宝石系列", target: "高档位(重点备货)", value: 7.2 + 6.8 },
    { source: "红宝石系列", target: "中档位(组合清货)", value: 5.5 + 4.2 },

    // 其余系列 → 分档
    { source: "源力系列", target: "中档位(防守稳量)", value: 5.2 },
    { source: "防晒/基础护理", target: "中档位(应季备货)", value: 5.5 },
    { source: "洁面系列", target: "中档位(提客单)", value: 3.5 },
    { source: "洁面系列", target: "低档位(清仓/赠品)", value: 3.2 },
    { source: "面膜系列", target: "低档位(清仓/赠品)", value: 3.0 },
    { source: "其他", target: "低档位(清仓/赠品)", value: 3.0 + 2.8 },

    // 高/中/低 → SKU
    { source: "高档位(重点备货)", target: "双抗精华3.0", value: 7.5 },
    { source: "高档位(重点备货)", target: "双抗小夜灯眼霜", value: 5.8 },
    { source: "高档位(重点备货)", target: "红宝石面霜3.0", value: 7.2 },
    { source: "高档位(重点备货)", target: "红宝石精华3.0", value: 6.8 },

    { source: "中档位(组合清货)", target: "双抗精华水", value: 4.5 },
    { source: "中档位(组合清货)", target: "双抗水乳套装", value: 4.0 },
    { source: "中档位(组合清货)", target: "红宝石冰陀螺眼霜", value: 5.5 },
    { source: "中档位(组合清货)", target: "红宝石活肤乳2.0", value: 4.2 },
    { source: "中档位(防守稳量)", target: "源力面霜2.0", value: 5.2 },
    { source: "中档位(应季备货)", target: "云朵防晒霜", value: 5.5 },
    { source: "中档位(提客单)", target: "净颜洗面奶", value: 3.5 },

    { source: "低档位(清仓/赠品)", target: "水动力洁面", value: 3.2 },
    { source: "低档位(清仓/赠品)", target: "淡纹紧致水", value: 3.0 },
    { source: "低档位(清仓/赠品)", target: "神经酰胺面膜", value: 3.0 },
    { source: "低档位(清仓/赠品)", target: "安瓶精华液", value: 2.8 },
  ];

  // 构建节点列表
  const nodes = [];
  for (const item of skuData) {
    if (!nodes.includes(item.source)) {
      nodes.push(item.source);
    }
    if (!nodes.includes(item.target)) {
      nodes.push(item.target);
    }
  }

  // 生成商品区位熵热力图配置
  const getLocationEntropyOption = () => {
    const provinces = locationEntropyData.map(item => item.province);
    const products = Object.keys(locationEntropyData[0]).filter(key => key !== 'province');
    
    const heatmapData = [];
    provinces.forEach((province, i) => {
      products.forEach((product, j) => {
        heatmapData.push([j, i, locationEntropyData[i][product]]);
      });
    });
    
    return {
      title: {
        text: '各省份商品区位熵分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          color: '#2d3748',
          fontFamily: 'Times New Roman, 宋体'
        }
      },
      tooltip: {
        position: 'top',
        formatter: function(params: any) {
          return `${provinces[params.value[1]]}<br/>${products[params.value[0]]}: ${params.value[2]}`;
        }
      },
      grid: {
        height: '60%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: products,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 45,
          fontSize: 12,
          color: '#6b7280'
        }
      },
      yAxis: {
        type: 'category',
        data: provinces,
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#6b7280'
        }
      },
      visualMap: {
        min: 0,
        max: 3,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#f8fafc', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3']
        }
      },
      series: [
        {
          name: '区位熵',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 生成蓝紫色渐变配色
  const getStarGradientColor = (index: number, total: number) => {
    const ratio = index / total;

    // 从蓝色渐变到紫色
    const r = Math.floor(79 + (139 - 79) * ratio);
    const g = Math.floor(70 + (99 - 70) * ratio);
    const b = Math.floor(229 + (192 - 229) * ratio);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
  };

  // 节点颜色（蓝紫色系，从蓝到紫渐变）
  const nodeColors = nodes.map((node, index) => {
    if (node.includes("大促总备货")) {
      return "#3b82f6"; // 深蓝色
    } else if (node.includes("系列")) {
      return "#6366f1"; // 蓝色
    } else if (node.includes("档位")) {
      return "#8b5cf6"; // 蓝紫色
    } else {
      return "#a78bfa"; // 紫色
    }
  });

  // 桑基图配置
  const sankeyOption = {
    title: {
      text: '珀莱雅大促SKU备货策略桑基图',
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#2d3748',
        fontFamily: 'Times New Roman, 宋体'
      }
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency'
        },
        data: nodes.map((name, index) => ({
          name,
          itemStyle: {
            color: nodeColors[index],
            borderColor: 'rgba(150, 150, 170, 0.25)',
            borderWidth: 0.6
          },
          label: {
            fontSize: 11,
            color: '#4a5568',
            fontFamily: 'Times New Roman, 宋体'
          }
        })),
        links: skuData.map((item, index) => ({
          source: item.source,
          target: item.target,
          value: item.value,
          lineStyle: {
            color: getStarGradientColor(index, skuData.length),
            curveness: 0.5
          }
        })),
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">智能补货</h1>
          <p className="text-sm text-gray-500">销量预测、补货决策与动态安全库存管理</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
            <Filter className="w-4 h-4" />
            <span>筛选</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
            <Download className="w-4 h-4" />
            <span>导出补货单</span>
          </button>
        </div>
      </div>



      {/* 销量预测看板 */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">销量预测看板</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">预测值</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">实际值</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                <span className="text-gray-600">目标值</span>
              </div>
            </div>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            <p>基于XGBoost模型的销量预测系统，结合历史销售数据、促销活动、季节性因素等多维度特征，实现高精度的销量预测。预测准确率达到91.8%，为库存管理和补货决策提供有力支持。</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesForecastData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f3e8ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f3e8ff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'forecast' ? '预测值' : name === 'actual' ? '实际值' : '目标值';
                    return [`${value.toFixed(2)}`, label];
                  }}
                  labelFormatter={(label) => `日期: ${label}`}
                />
                <Area type="monotone" dataKey="target" name="目标值" stroke="#c4b5fd" fill="url(#colorTarget)" />
                <Line type="monotone" dataKey="forecast" name="预测值" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" name="实际值" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-3 mt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">MAPE</p>
              <p className="text-base font-semibold text-gray-800">20.78%</p>
              <p className="text-[10px] text-gray-400">误差越小越准确</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">RMSE</p>
              <p className="text-base font-semibold text-gray-800">32.17</p>
              <p className="text-[10px] text-gray-400">反映偏差程度</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">MAE</p>
              <p className="text-base font-semibold text-gray-800">22.44</p>
              <p className="text-[10px] text-gray-400">平均偏差</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">R²</p>
              <p className="text-base font-semibold text-gray-800">0.8427</p>
              <p className="text-[10px] text-gray-400">模型拟合度</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">预测准确率</p>
              <p className="text-base font-semibold text-green-600">79.22%</p>
              <p className="text-[10px] text-gray-400">预测准确程度</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 补货优先级列表 */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">补货优先级列表</h3>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            <p>基于销量预测、库存水平、商品价值等多维度因素，自动计算补货优先级，生成建议补货量。优先级越高的商品应优先安排补货，确保热销商品不缺货。</p>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">商品</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">预测销量</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">单价</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">优先级</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">补货优先级得分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priorityListData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.product}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.forecast.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">¥{item.price}</td>
                    <td className="px-4 py-3">
                        <div className="w-12 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-purple-500 rounded-full" 
                            style={{ width: `${item.priority}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-purple-600 font-semibold">{item.suggestion.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 商品区位熵热力图 */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">商品区位熵热力图</h3>
            </div>
          <div className="mb-4 text-sm text-gray-600">
            <p>展示各省份对不同商品的偏好程度，区位熵值越高表示该省份对该商品的需求相对全国平均水平越高。通过颜色深浅直观呈现，帮助识别区域消费偏好，优化库存布局。</p>
          </div>
          <div className="h-[500px]">
            <ReactECharts 
              option={getLocationEntropyOption()} 
              style={{ width: '100%', height: '100%' }} 
              opts={{ renderer: 'canvas' }} 
            />
          </div>
        </CardContent>
      </Card>



      {/* SKU级大促系数分布 */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">SKU级大促系数分布</h3>
            </div>
          <div className="mb-4 text-sm text-gray-600">
            <p>展示各SKU商品的大促系数分布情况，大促系数越高表示该商品在促销活动中的表现越好，销售增长潜力越大。基于大促系数可将商品分为高、中、低三个档位，制定差异化的促销策略。</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skuPromotionData}
                layout="vertical"
                margin={{ top: 20, right: 100, left: 120, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280" 
                  domain={[0, 8]}
                  tick={{ fontSize: 12 }}
                  label={{ value: '大促系数', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle' } }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value: number) => value.toFixed(1)}
                  labelFormatter={(label) => `商品: ${label}`}
                />
                <Bar 
                  dataKey="coefficient" 
                  fill="url(#salesGradient)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 大促SKU备货策略桑基图 */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">大促SKU备货策略桑基图</h3>
            </div>
          <div className="mb-4 text-sm text-gray-600">
            <p>展示大促总备货量在不同商品系列和SKU之间的分配情况，以及基于大促系数的档位划分。通过桑基图直观呈现备货量的流动关系，帮助优化大促期间的库存分配策略。</p>
          </div>
          <div className="h-[675px]">
            <ReactECharts 
              option={sankeyOption} 
              style={{ width: '100%', height: '100%' }} 
              opts={{ renderer: 'canvas' }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReplenishment;