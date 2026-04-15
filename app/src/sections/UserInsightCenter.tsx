import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InteractiveCrystalBall } from '@/components/InteractiveCrystalBall';
import { mockUsers, rfmStats, skinProductMatrix, productSeries, userProfileDistribution, kmeansClusters } from '@/data/mockData';
import { User, Layers, Sparkles, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// RFM雷达图组件
function RFMRadar({ r, f, m }: { r: number; f: number; m: number }) {
  const [isClicked, setIsClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const size = 120;
  const center = size / 2;
  const radius = 40;
  
  // 初始化动画
  useEffect(() => {
    setProgress(0);
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);
    return () => clearTimeout(timer);
  }, [r, f, m]);
  
  const getPoint = (value: number, angle: number) => {
    const radiusValue = (value / 5) * radius;
    const x = center + radiusValue * Math.cos(angle - Math.PI / 2);
    const y = center + radiusValue * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  };
  
  // 计算当前进度的点
  const getProgressPoint = (value: number, angle: number) => {
    const currentValue = (value * progress) / 100;
    const radiusValue = (currentValue / 5) * radius;
    const x = center + radiusValue * Math.cos(angle - Math.PI / 2);
    const y = center + radiusValue * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  };
  
  const points = [
    getProgressPoint(r, 0),
    getProgressPoint(f, (2 * Math.PI) / 3),
    getProgressPoint(m, (4 * Math.PI) / 3)
  ].join(' ');
  
  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  
  return (
    <div 
      className="mx-auto cursor-pointer transition-all duration-300"
      style={{ 
        transform: isClicked ? 'scale(1.2)' : 'scale(1)',
        filter: isClicked ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 'none'
      }}
      onClick={handleClick}
    >
      <svg 
        width={size} 
        height={size} 
        className="mx-auto"
        style={{ transition: 'all 0.3s ease' }}
      >
        {/* 背景网格 */}
        {[1, 2, 3, 4, 5].map(i => (
          <polygon
            key={i}
            points={[
              getPoint(i, 0),
              getPoint(i, (2 * Math.PI) / 3),
              getPoint(i, (4 * Math.PI) / 3)
            ].join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {/* 轴线 */}
        <line x1={center} y1={center} x2={getPoint(5, 0).split(',')[0]} y2={getPoint(5, 0).split(',')[1]} stroke="#e5e7eb" />
        <line x1={center} y1={center} x2={getPoint(5, (2 * Math.PI) / 3).split(',')[0]} y2={getPoint(5, (2 * Math.PI) / 3).split(',')[1]} stroke="#e5e7eb" />
        <line x1={center} y1={center} x2={getPoint(5, (4 * Math.PI) / 3).split(',')[0]} y2={getPoint(5, (4 * Math.PI) / 3).split(',')[1]} stroke="#e5e7eb" />
        {/* 数据区域 */}
        <polygon 
          points={points} 
          fill="rgba(244, 63, 94, 0.3)" 
          stroke="#f43f5e" 
          strokeWidth="2"
          style={{ 
            transition: 'all 1s ease-out',
            transformOrigin: 'center center'
          }}
        />
        {/* 标签 */}
        <text x={center} y={12} textAnchor="middle" className="text-xs fill-gray-600">R</text>
        <text x={size - 8} y={center + 25} textAnchor="middle" className="text-xs fill-gray-600">F</text>
        <text x={8} y={center + 25} textAnchor="middle" className="text-xs fill-gray-600">M</text>
      </svg>
    </div>
  );
}

// 商品子类似度热力图
function ProductSimilarityHeatmap() {
  // 使用CSV文件中的商品名称和相似度数据
  const products = [
    '云朵防晒霜', '双抗水乳套装', '神经酰胺涂抹面膜', '双抗精华3.0', '红宝石精华3.0',
    '双抗精华水', '至简密护安瓶精华液', '净颜洗面奶', '源力面霜2.0', '红宝石抗皱面霜3.0',
    '红宝石活肤乳2.0', '水动力洁面乳', '水动力氨基酸洁面乳', '赋能鲜颜淡纹紧致活肤水', '双抗小夜灯眼霜', '红宝石冰陀螺眼霜'
  ];
  
  // 从CSV文件中提取的相似度数据
  const similarityData = [
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

  // 冷色调蓝色渐变配色
  const getColor = (score: number) => {
    if (score >= 0.9) return 'bg-blue-900';
    if (score >= 0.8) return 'bg-blue-800';
    if (score >= 0.7) return 'bg-blue-700';
    if (score >= 0.6) return 'bg-blue-600';
    if (score >= 0.5) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-blue-400';
    if (score >= 0.3) return 'bg-blue-300';
    if (score >= 0.2) return 'bg-blue-200';
    return 'bg-blue-100';
  };
  
  return (
    <div className="overflow-x-auto">
      <h4 className="text-sm font-semibold text-center mb-2">商品相似度热力图（冷色调蓝色渐变）</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-left text-xs font-medium text-gray-500 border-r border-b border-gray-200 bg-gray-50"></th>
              {products.map(product => (
                <th key={product} className="p-1 text-center text-xs font-medium text-gray-500 border-r border-b border-gray-200 bg-gray-50">{product}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, rowIndex) => (
              <tr key={product}>
                <td className="p-1 text-xs font-medium text-gray-700 border-r border-b border-gray-200 bg-gray-50">{product}</td>
                {similarityData[rowIndex].map((value, colIndex) => (
                  <td key={colIndex} className="p-0 border-r border-b border-gray-200">
                    <div className={`w-full h-8 ${getColor(value)} flex items-center justify-center`}>
                      <span className="text-xs font-medium text-white">{value.toFixed(2)}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="text-xs text-gray-600">0.0</span>
        <div className="flex-1 h-2 bg-gradient-to-r from-blue-100 via-blue-400 to-blue-900 rounded-full"></div>
        <span className="text-xs text-gray-600">1.0</span>
      </div>
    </div>
  );
}

// 肤质-产品匹配度热力图
function SkinProductHeatmap() {
  const skins = Object.keys(skinProductMatrix);
  const series = Object.keys(skinProductMatrix[skins[0]]);
  
  // 粉色系渐变
  const getColor = (score: number) => {
    if (score >= 0.8) return 'bg-rose-600';
    if (score >= 0.6) return 'bg-rose-500';
    if (score >= 0.4) return 'bg-rose-400';
    return 'bg-rose-300';
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-500 border-r border-b border-gray-200 bg-gray-50">肤质 \ 系列</th>
              {series.map(s => (
                <th key={s} className="p-2 text-center text-xs font-medium text-gray-500 border-r border-b border-gray-200 bg-gray-50">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skins.map(skin => (
              <tr key={skin}>
                <td className="p-2 text-sm text-gray-700 border-r border-b border-gray-200 bg-gray-50">{skin}</td>
                {series.map(ser => (
                  <td key={ser} className="p-0 border-r border-b border-gray-200">
                    <div className={`w-full h-10 ${getColor(skinProductMatrix[skin][ser])} flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer`}>
                      <span className="text-xs font-medium text-white">{skinProductMatrix[skin][ser]}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 地区分布柱状图组件
function ProvinceBarChart() {
  // 准备柱状图数据
  const barData = Object.entries(userProfileDistribution.provinceDistribution)
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value);

  // 计算总用户数
  const totalUsers = barData.reduce((sum, item) => sum + item.value, 0);

  // 自定义 tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalUsers) * 100).toFixed(2);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">用户数: {data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-600">占比: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-white/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4">用户地区分布</h4>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={barData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="provinceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f9a8d4" stopOpacity={1} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="url(#provinceGradient)" 
            radius={[4, 4, 0, 0]}
            barSize={30}
            animationDuration={1500}
            animationEasing="ease-out"
            animationBegin={200}
            onMouseEnter={(data, index, event) => {
              event.target.style.cursor = 'pointer';
            }}
            onMouseLeave={(data, index, event) => {
              event.target.style.cursor = 'default';
            }}
            onClick={(data, index) => {
              console.log('Clicked on:', data.name);
            }}
            emphasis={{
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function UserInsightCenter() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState(kmeansClusters[0]);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowHeight = 70;

  // 过滤用户
  const filteredUsers = useMemo(() => {
    return filterCategory === 'all' 
      ? mockUsers 
      : mockUsers.filter(u => u.userCategory === filterCategory);
  }, [filterCategory, mockUsers]);

  // 计算可见区域的用户
  const visibleUsers = useMemo(() => {
    if (!scrollContainerRef.current) {
      return filteredUsers.slice(0, 20);
    }
    
    const { clientHeight } = scrollContainerRef.current;
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(clientHeight / rowHeight) + 5,
      filteredUsers.length
    );
    
    return filteredUsers.slice(startIndex, endIndex);
  }, [scrollTop, filteredUsers, rowHeight]);

  // 计算可见区域的起始位置
  const visibleStartIndex = useMemo(() => {
    return Math.floor(scrollTop / rowHeight);
  }, [scrollTop, rowHeight]);

  // 处理滚动事件
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop: newScrollTop } = scrollContainerRef.current;
      setScrollTop(newScrollTop);
    }
  };

  // 初始化时设置可见区域
  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollTop(0);
    }
  }, [filteredUsers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用户洞察中心</h2>
          <p className="text-gray-500">全方位用户画像分析，洞察用户价值与偏好</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            用户总体概览
          </TabsTrigger>
          <TabsTrigger value="rfm" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            RFM价值分层
          </TabsTrigger>
          <TabsTrigger value="cluster" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            K-means聚类
          </TabsTrigger>
          <TabsTrigger value="skin" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            肤质-产品匹配
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            用户列表
          </TabsTrigger>
        </TabsList>

        {/* 用户总体概览 */}
        <TabsContent value="overview" className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">用户基本分布</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">用户性别分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-8 py-4">
                    <InteractiveCrystalBall 
                      percentage={70.1} 
                      color="#f472b6" 
                      label="女性用户"
                    />
                    <InteractiveCrystalBall 
                      percentage={29.9} 
                      color="#60a5fa" 
                      label="男性用户"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">会员状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-8 py-4">
                    <InteractiveCrystalBall 
                      percentage={47.0} 
                      color="#34d399" 
                      label="会员用户"
                    />
                    <InteractiveCrystalBall 
                      percentage={53.0} 
                      color="#9ca3af" 
                      label="非会员用户"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">地区分布</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <ProvinceBarChart />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8">肤质分布</h3>
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">肤质分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(userProfileDistribution.skinType).map(([skin, percentage]) => (
                  <div key={skin} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">{skin}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12">{percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFM价值分层 */}
        <TabsContent value="rfm" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RFM用户价值分层统计 */}
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">RFM用户价值分层统计</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户分类</TableHead>
                      <TableHead className="text-right">人数</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                      <TableHead className="text-right">平均R值(天)</TableHead>
                      <TableHead className="text-right">平均F值(次)</TableHead>
                      <TableHead className="text-right">平均M值(元)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfmStats.map((stat) => (
                      <TableRow key={stat.category}>
                        <TableCell className="font-medium">
                          <Badge 
                            variant="secondary"
                            className={
                              stat.category === '核心价值用户' ? 'bg-rose-100 text-rose-700' :
                              stat.category === '潜力发展用户' ? 'bg-purple-100 text-purple-700' :
                              stat.category === '高价值沉睡用户' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }
                          >
                            {stat.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{stat.userCount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{stat.percentage}</TableCell>
                        <TableCell className="text-right">{stat.avgR.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{stat.avgF.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{stat.avgM.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 各分层销售额贡献占比图 */}
            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">各分层销售额贡献占比</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 图例 */}
                <div className="mb-4 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F48FB1' }}></div>
                    <span className="text-sm">核心价值用户</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#9FA8DA' }}></div>
                    <span className="text-sm">潜力发展用户</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFAB91' }}></div>
                    <span className="text-sm">高价值沉睡用户</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#BDBDBD' }}></div>
                    <span className="text-sm">低价值/流失用户</span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '核心价值用户', value: 60.91, color: '#F48FB1' },
                          { name: '潜力发展用户', value: 30.93, color: '#9FA8DA' },
                          { name: '高价值沉睡用户', value: 7.65, color: '#FFAB91' },
                          { name: '低价值/流失用户', value: 0.52, color: '#BDBDBD' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                        labelLine={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                        animationBegin={200}
                        onMouseEnter={(data, index, event) => {
                          event.target.style.cursor = 'pointer';
                        }}
                        onMouseLeave={(data, index, event) => {
                          event.target.style.cursor = 'default';
                        }}
                        onClick={(data, index) => {
                          console.log('Clicked on:', data.name);
                        }}
                        emphasis={{
                          itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                          },
                          label: {
                            fontSize: 16,
                            fontWeight: 'bold'
                          }
                        }}
                      >
                        {
                          [
                            { name: '核心价值用户', value: 60.91, color: '#F48FB1' },
                            { name: '潜力发展用户', value: 30.93, color: '#9FA8DA' },
                            { name: '高价值沉睡用户', value: 7.65, color: '#FFAB91' },
                            { name: '低价值/流失用户', value: 0.52, color: '#BDBDBD' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, '销售额占比']}
                        labelFormatter={(label) => `${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rfmStats.map((stat) => (
              <Card key={stat.category} className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">{stat.category}</span>
                    <RFMRadar r={stat.avgRScore} f={stat.avgFScore} m={stat.avgMScore} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">综合得分</span>
                      <span className="font-semibold">{stat.compositeScore.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">R评分</span>
                      <span>{stat.avgRScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">F评分</span>
                      <span>{stat.avgFScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">M评分</span>
                      <span>{stat.avgMScore.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* K-means聚类 */}
        <TabsContent value="cluster" className="space-y-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">K-means聚类结果（K=10）</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 肘部法则图和轮廓系数图 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* 肘部法则图 */}
                <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-sm">肘部法则图（Elbow Method）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { k: 2, sse: 118600 },
                            { k: 3, sse: 91200 },
                            { k: 4, sse: 76400 },
                            { k: 5, sse: 66100 },
                            { k: 6, sse: 58900 },
                            { k: 7, sse: 53800 },
                            { k: 8, sse: 49900 },
                            { k: 9, sse: 47100 },
                            { k: 10, sse: 43800 },
                            { k: 11, sse: 43000 },
                            { k: 12, sse: 42300 },
                            { k: 13, sse: 41700 },
                            { k: 14, sse: 41200 },
                            { k: 15, sse: 40800 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="k" label={{ value: 'K值', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'SSE（簇内平方和）', angle: -90, position: 'insideLeft', offset: 10 }} />
                          <Tooltip 
                            formatter={(value) => [`${value}`, 'SSE']}
                            labelFormatter={(label) => `K=${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sse" 
                            stroke="#f472b6" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#f472b6' }}
                            activeDot={{ r: 6, fill: '#ec4899' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-xs text-gray-600 text-left ml-4">
                      K=10 处为肘部拐点，SSE 下降趋势明显放缓
                    </div>
                  </CardContent>
                </Card>
                
                {/* 轮廓系数图 */}
                <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-sm">轮廓系数图（Silhouette Score）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { k: 2, score: 0.40 },
                            { k: 3, score: 0.43 },
                            { k: 4, score: 0.46 },
                            { k: 5, score: 0.48 },
                            { k: 6, score: 0.50 },
                            { k: 7, score: 0.51 },
                            { k: 8, score: 0.52 },
                            { k: 9, score: 0.52 },
                            { k: 10, score: 0.53 },
                            { k: 11, score: 0.52 },
                            { k: 12, score: 0.51 },
                            { k: 13, score: 0.50 },
                            { k: 14, score: 0.49 },
                            { k: 15, score: 0.48 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="k" label={{ value: 'K值', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: '轮廓系数', angle: -90, position: 'insideLeft' }} domain={[0.35, 0.55]} />
                          <Tooltip 
                            formatter={(value) => {
                              const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
                              return [`${numericValue.toFixed(2)}`, '轮廓系数'];
                            }}
                            labelFormatter={(label) => `K=${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#a855f7" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#a855f7' }}
                            activeDot={{ r: 6, fill: '#7e22ce' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="mt-2 text-xs text-gray-600 text-center">
                        K=10 处达到最高值，聚类效果最优
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-6 text-sm text-gray-600 text-center">
                通过肘部法则与轮廓系数双重验证，确定 K=10 为最优聚类数，聚类结果科学有效。
              </div>
              
              {/* 簇类用户分布和核心簇特征详情 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* 簇类用户分布气泡图 */}
                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">簇类用户分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={kmeansClusters.map((cluster, index) => ({
                            name: cluster.name,
                            value: cluster.count,
                            x: Math.cos((index / kmeansClusters.length) * 2 * Math.PI) * 200 + 320,
                            y: Math.sin((index / kmeansClusters.length) * 2 * Math.PI) * 200 + 250,
                            r: Math.sqrt(cluster.count) * 1.2,
                            color: cluster.color
                          }))}
                          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" domain={[0, 600]} hide />
                          <YAxis type="number" domain={[0, 500]} hide />
                          <Tooltip 
                            formatter={(value, name, props) => {
                              const cluster = kmeansClusters.find(c => c.name === props.payload.name);
                              return [
                                `${cluster?.count} 用户`,
                                `${cluster?.name}`,
                                `${cluster?.percentage}`
                              ];
                            }}
                          />
                          {/* 绘制背景晕染圈 */}
                          <circle cx={320} cy={250} r={240} fill="none" stroke="#f9a8d4" strokeWidth={1} strokeOpacity={0.2} />
                          <circle cx={320} cy={250} r={200} fill="none" stroke="#d8b4fe" strokeWidth={1} strokeOpacity={0.2} />
                          <circle cx={320} cy={250} r={160} fill="none" stroke="#c4b5fd" strokeWidth={1} strokeOpacity={0.2} />
                          <circle cx={320} cy={250} r={120} fill="none" stroke="#fcd34d" strokeWidth={1} strokeOpacity={0.2} />
                          {/* 绘制气泡 */}
                          {kmeansClusters.map((cluster, index) => {
                            const angle = (index / kmeansClusters.length) * 2 * Math.PI;
                            const x = Math.cos(angle) * 200 + 320;
                            const y = Math.sin(angle) * 200 + 250;
                            const r = Math.sqrt(cluster.count) * 1.2;
                            
                            return (
                              <g key={index}>
                                {/* 气泡晕染效果 */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={r * 1.4}
                                  fill={cluster.color}
                                  fillOpacity={0.2}
                                />
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={r * 1.1}
                                  fill={cluster.color}
                                  fillOpacity={0.4}
                                />
                                {/* 主气泡 */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={r}
                                  fill={cluster.color}
                                  fillOpacity={0.7}
                                  stroke={cluster.color}
                                  strokeWidth={2}
                                  style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease'
                                  }}
                                  onMouseEnter={(event) => {
                                    event.target.style.transform = 'scale(1.1)';
                                    setSelectedCluster(cluster);
                                  }}
                                  onMouseLeave={(event) => {
                                    event.target.style.transform = 'scale(1)';
                                  }}
                                  onClick={() => {
                                    setSelectedCluster(cluster);
                                  }}
                                />
                                <text
                                  x={x}
                                  y={y}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill="white"
                                  fontSize={14}
                                  fontWeight="bold"
                                >
                                  {cluster.name.split('_')[0]}
                                </text>
                              </g>
                            );
                          })}
                          {/* 绘制中心圆 */}
                          <circle cx={320} cy={250} r={70} fill="#f3f4f6" stroke="#e5e7eb" strokeWidth={2} />
                          <text
                            x={320}
                            y={245}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#1f2937"
                            fontSize={18}
                            fontWeight="bold"
                          >
                            用户分群
                          </text>
                          <text
                            x={320}
                            y={265}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#6b7280"
                            fontSize={16}
                          >
                            K=10
                          </text>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 核心簇特征详细 */}
                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">核心簇族特征详细</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    <div className="space-y-3">
                      {kmeansClusters.map((cluster, index) => {
                        const clusterId = cluster.name.split('_')[0].replace('簇', '');
                        return (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg border ${selectedCluster.name === cluster.name ? 'border-rose-300 bg-rose-50/50' : 'border-gray-200'} cursor-pointer transition-all duration-200 hover:border-rose-200 hover:bg-rose-50/30`}
                            onClick={() => setSelectedCluster(cluster)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: cluster.color }}
                                />
                                <span className="text-sm font-medium">
                                  {cluster.name}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {cluster.percentage}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              <div className="flex justify-between mb-0.5">
                                <span>用户数:</span>
                                <span>{cluster.count}</span>
                              </div>
                              <div className="flex justify-between mb-0.5">
                                <span>价值等级:</span>
                                <span>{cluster.valueLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>核心需求:</span>
                                <span>{cluster.coreNeeds}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 聚类结果解读 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer shadow-md bg-gradient-to-br from-pink-50 to-pink-100/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-pink-500" />
                      </div>
                      <h4 className="font-semibold text-gray-800">高价值用户</h4>
                      <p className="text-sm text-gray-600">
                        簇 0（高价值_抗衰+修护）是规模最大的群体（20.8%），RFM 评分均处于极高水平，且几乎覆盖全部六大功效。这类用户是品牌的"全能型"核心用户，消费力强、活跃度高、功效需求广泛。
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-purple-500" />
                      </div>
                      <h4 className="font-semibold text-gray-800">中价值用户</h4>
                      <p className="text-sm text-gray-600">
                        簇 3、4、5、8、9、2均为"中价值"用户，人数合计约 60.0%。他们的 M 分（4.0—4.8）处于高价值区间，但 R 分和 F 分略低于簇 0。功效偏好各有侧重：簇 3 偏好全功效；簇 4 偏好抗衰+抗氧化；簇 5 偏好清爽+保湿；簇 8 偏好抗衰+抗氧化；簇 9 偏好抗衰+清爽；簇 2 偏好修护+保湿。
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-gray-800">低价值用户</h4>
                      <p className="text-sm text-gray-600">
                        簇 1、6、7为"低价值"用户，总占比约 19.4%。RFM 评分均较低，功效偏好相对单一：簇 1 偏好修护+保湿，簇 6 偏好抗氧化+清爽，簇 7 偏好抗衰+抗皱。这部分用户多为一次性或低频购买者，价值贡献有限。
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 肤质-产品匹配 */}
        <TabsContent value="skin" className="space-y-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">肤质-产品匹配度矩阵</CardTitle>
            </CardHeader>
            <CardContent>
              <SkinProductHeatmap />
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>匹配度:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-300 rounded"></div>
                  <span>低</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-400 rounded"></div>
                  <span>中</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-500 rounded"></div>
                  <span>较高</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-600 rounded"></div>
                  <span>高</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                匹配度基于用户购买行为、复购率、Uplift 增益效果综合计算，范围 0-1，数值越高适配性越强。
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productSeries.map((series) => (
              <Card key={series.name} className="hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-1">{series.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{series.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {series.suitableSkin.map(skin => (
                      <Badge key={skin} variant="outline" className="text-xs">
                        {skin}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-rose-400">主打功效: {series.mainEffect}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 用户列表 */}
        <TabsContent value="users" className="space-y-4">
          <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">用户列表</CardTitle>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="筛选用户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部用户</SelectItem>
                  <SelectItem value="核心价值用户">核心价值用户</SelectItem>
                  <SelectItem value="潜力发展用户">潜力发展用户</SelectItem>
                  <SelectItem value="高价值沉睡用户">高价值沉睡用户</SelectItem>
                  <SelectItem value="低价值/流失用户">低价值/流失用户</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {/* 虚拟滚动容器 */}
              <div 
                className="max-h-[400px] overflow-y-auto"
                ref={scrollContainerRef}
                onScroll={handleScroll}
              >
                {/* 虚拟滚动内容 */}
                <div 
                  style={{
                    height: `${filteredUsers.length * rowHeight}px`,
                    position: 'relative'
                  }}
                >
                  {/* 只渲染可见区域的用户 */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: `${visibleStartIndex * rowHeight}px`,
                      width: '100%'
                    }}
                  >
                    <Table className="min-w-full">
                      <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                          <TableHead>用户ID</TableHead>
                          <TableHead>性别</TableHead>
                          <TableHead>年龄</TableHead>
                          <TableHead>肤质</TableHead>
                          <TableHead>会员</TableHead>
                          <TableHead>RFM分类</TableHead>
                          <TableHead>聚类</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleUsers.map((user) => (
                          <TableRow 
                            key={user.id} 
                            className="cursor-pointer hover:bg-gray-50 transition-all duration-200"
                            onClick={() => setSelectedUser(user)}
                          >
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.gender}</TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>{user.skinType}</TableCell>
                            <TableCell>
                              {user.isMember ? (
                                <Badge className="bg-rose-100 text-rose-700">是</Badge>
                              ) : (
                                <Badge variant="secondary">否</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  user.userCategory === '核心价值用户' ? 'border-rose-300 text-rose-600' :
                                  user.userCategory === '潜力发展用户' ? 'border-purple-300 text-purple-600' :
                                  user.userCategory === '高价值沉睡用户' ? 'border-amber-300 text-amber-600' :
                                  'border-gray-300 text-gray-600'
                                }
                              >
                                {user.userCategory}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500">{user.clusterName}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedUser && (
            <Card className="border-rose-200 bg-rose-50/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-500" />
                  选中用户详情: {selectedUser.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">基本信息</p>
                    <p className="text-sm">{selectedUser.gender}, {selectedUser.age}岁</p>
                    <p className="text-sm">{selectedUser.skinType}</p>
                    <p className="text-sm">{selectedUser.province}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">RFM评分</p>
                    <p className="text-sm">R: {selectedUser.rScore}</p>
                    <p className="text-sm">F: {selectedUser.fScore}</p>
                    <p className="text-sm">M: {selectedUser.mScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">用户分类</p>
                    <p className="text-sm">{selectedUser.userCategory}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedUser.clusterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">偏好系列</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.preferredSeries.map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
