import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// 商品列表
const products = [
  '云朵防晒霜',
  '双抗水乳套装',
  '神经酰胺涂抹面膜',
  '双抗精华3.0',
  '红宝石精华3.0',
  '双抗精华水',
  '至简密护安瓶精华液',
  '净颜洗面奶',
  '源力面霜2.0',
  '红宝石抗皱面霜3.0',
  '红宝石活肤乳2.0',
  '水动力洁面乳',
  '水动力氨基酸洁面乳',
  '赋能鲜颜淡纹紧致活肤水',
  '双抗小夜灯眼霜',
  '红宝石冰陀螺眼霜'
];

// 相似度矩阵数据
const similarityMatrix = [
  [1.00, 0.12, 0.18, 0.10, 0.08, 0.11, 0.22, 0.25, 0.20, 0.07, 0.09, 0.28, 0.26, 0.15, 0.13, 0.06],
  [0.12, 1.00, 0.42, 0.92, 0.55, 0.88, 0.45, 0.30, 0.48, 0.52, 0.49, 0.25, 0.23, 0.58, 0.78, 0.47],
  [0.18, 0.42, 1.00, 0.45, 0.38, 0.40, 0.82, 0.35, 0.90, 0.35, 0.33, 0.28, 0.26, 0.42, 0.43, 0.32],
  [0.10, 0.92, 0.45, 1.00, 0.58, 0.94, 0.47, 0.28, 0.50, 0.55, 0.52, 0.22, 0.20, 0.60, 0.82, 0.50],
  [0.08, 0.55, 0.38, 0.58, 1.00, 0.52, 0.40, 0.25, 0.42, 0.93, 0.88, 0.18, 0.16, 0.75, 0.53, 0.89],
  [0.11, 0.88, 0.40, 0.94, 0.52, 1.00, 0.43, 0.27, 0.46, 0.50, 0.48, 0.21, 0.19, 0.57, 0.79, 0.48],
  [0.22, 0.45, 0.82, 0.47, 0.40, 0.43, 1.00, 0.33, 0.85, 0.37, 0.35, 0.26, 0.24, 0.45, 0.46, 0.34],
  [0.25, 0.30, 0.35, 0.28, 0.25, 0.27, 0.33, 1.00, 0.32, 0.23, 0.21, 0.78, 0.85, 0.29, 0.27, 0.20],
  [0.20, 0.48, 0.90, 0.50, 0.42, 0.46, 0.85, 0.32, 1.00, 0.40, 0.38, 0.27, 0.25, 0.47, 0.49, 0.36],
  [0.07, 0.52, 0.35, 0.55, 0.93, 0.50, 0.37, 0.23, 0.40, 1.00, 0.91, 0.17, 0.15, 0.72, 0.50, 0.92],
  [0.09, 0.49, 0.33, 0.52, 0.88, 0.48, 0.35, 0.21, 0.38, 0.91, 1.00, 0.16, 0.14, 0.69, 0.48, 0.88],
  [0.28, 0.25, 0.28, 0.22, 0.18, 0.21, 0.26, 0.78, 0.27, 0.17, 0.16, 1.00, 0.92, 0.24, 0.22, 0.15],
  [0.26, 0.23, 0.26, 0.20, 0.16, 0.19, 0.24, 0.85, 0.25, 0.15, 0.14, 0.92, 1.00, 0.22, 0.20, 0.13],
  [0.15, 0.58, 0.42, 0.60, 0.75, 0.57, 0.45, 0.29, 0.47, 0.72, 0.69, 0.24, 0.22, 1.00, 0.55, 0.70],
  [0.13, 0.78, 0.43, 0.82, 0.53, 0.79, 0.46, 0.27, 0.49, 0.50, 0.48, 0.22, 0.20, 0.55, 1.00, 0.52],
  [0.06, 0.47, 0.32, 0.50, 0.89, 0.48, 0.34, 0.20, 0.36, 0.92, 0.88, 0.15, 0.13, 0.70, 0.52, 1.00]
];

// 生成echarts热力图数据
const generateEChartsData = () => {
  const data = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products.length; j++) {
      data.push([j, i, similarityMatrix[i][j]]);
    }
  }
  return data;
};

const getOption = () => {
  return {
    tooltip: {
      position: 'top',
      formatter: function(params: any) {
        return `${products[params.value[1]]} → ${products[params.value[0]]}<br/>相似度: ${params.value[2].toFixed(2)}`;
      }
    },
    grid: {
      height: '60%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: products,
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'category',
      data: products,
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 10
      }
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#f472b6']
      }
    },
    series: [
      {
        name: '相似度',
        type: 'heatmap',
        data: generateEChartsData(),
        label: {
          show: true,
          formatter: function(params: any) {
            return params.value[2].toFixed(2);
          },
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

export default function ProductSimilarityHeatmap() {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-pink-400" />
          商品相似度热力图
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <ReactECharts option={getOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  );
}