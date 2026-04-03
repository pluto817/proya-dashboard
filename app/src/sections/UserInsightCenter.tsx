import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers, rfmStats, skinProductMatrix, productSeries, userProfileDistribution, kmeansClusters } from '@/data/mockData';
import { User, Layers, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// RFM雷达图组件
function RFMRadar({ r, f, m }: { r: number; f: number; m: number }) {
  const size = 120;
  const center = size / 2;
  const radius = 40;
  
  const getPoint = (value: number, angle: number) => {
    const r = (value / 5) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  };
  
  const points = [
    getPoint(r, 0),
    getPoint(f, (2 * Math.PI) / 3),
    getPoint(m, (4 * Math.PI) / 3)
  ].join(' ');
  
  return (
    <svg width={size} height={size} className="mx-auto">
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
      <polygon points={points} fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="2" />
      {/* 标签 */}
      <text x={center} y={12} textAnchor="middle" className="text-xs fill-gray-600">R</text>
      <text x={size - 8} y={center + 25} textAnchor="middle" className="text-xs fill-gray-600">F</text>
      <text x={8} y={center + 25} textAnchor="middle" className="text-xs fill-gray-600">M</text>
    </svg>
  );
}

// 肤质-产品匹配度热力图
function SkinProductHeatmap() {
  const skins = Object.keys(skinProductMatrix);
  const series = Object.keys(skinProductMatrix[skins[0]]);
  
  const getColor = (score: number) => {
    if (score >= 0.8) return 'bg-rose-500';
    if (score >= 0.6) return 'bg-rose-400';
    if (score >= 0.4) return 'bg-rose-300';
    return 'bg-rose-100';
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-500">肤质 \ 系列</th>
            {series.map(s => (
              <th key={s} className="p-2 text-center text-xs font-medium text-gray-500">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skins.map(skin => (
            <tr key={skin}>
              <td className="p-2 text-sm text-gray-700">{skin}</td>
              {series.map(ser => (
                <td key={ser} className="p-2">
                  <div className={`w-10 h-10 rounded-lg ${getColor(skinProductMatrix[skin][ser])} flex items-center justify-center mx-auto`}>
                    <span className="text-xs font-medium text-white">{skinProductMatrix[skin][ser]}</span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    .sort((a, b) => b.value - a.value); // 按用户数量降序排序

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
            fill="#f472b6" 
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function UserInsightCenter() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowHeight = 70; // 每行的高度（像素）

  // 过滤用户
  const filteredUsers = useMemo(() => {
    return filterCategory === 'all' 
      ? mockUsers 
      : mockUsers.filter(u => u.userCategory === filterCategory);
  }, [filterCategory, mockUsers]);

  // 计算可见区域的用户
  const visibleUsers = useMemo(() => {
    if (!scrollContainerRef.current) {
      // 初始渲染时，返回前20个用户
      return filteredUsers.slice(0, 20);
    }
    
    const { clientHeight } = scrollContainerRef.current;
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(clientHeight / rowHeight) + 5, // 额外渲染5行，避免滚动时出现空白
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
      // 初始滚动位置为0
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
            <PieChart className="w-4 h-4" />
            用户总体概览
          </TabsTrigger>
          <TabsTrigger value="rfm" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">用户性别分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-rose-500">{userProfileDistribution.gender['女']}%</span>
                      </div>
                      <p className="text-sm text-gray-600">女性用户</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-blue-500">{userProfileDistribution.gender['男']}%</span>
                      </div>
                      <p className="text-sm text-gray-600">男性用户</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">会员状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-green-500">47.0%</span>
                      </div>
                      <p className="text-sm text-gray-600">会员用户</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold text-gray-500">53.0%</span>
                      </div>
                      <p className="text-sm text-gray-600">非会员用户</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">地区分布</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)]">
                <ProvinceBarChart />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-8">肤质分布</h3>
          <Card>
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
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">各分层销售额贡献占比</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '核心价值用户', value: 60.91, color: '#f472b6' },
                          { name: '潜力发展用户', value: 30.93, color: '#a855f7' },
                          { name: '高价值沉睡用户', value: 7.65, color: '#f59e0b' },
                          { name: '低价值/流失用户', value: 0.52, color: '#6b7280' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
                        labelLine={false}
                      >
                        {[
                          { name: '核心价值用户', value: 60.91, color: '#f472b6' },
                          { name: '潜力发展用户', value: 30.93, color: '#a855f7' },
                          { name: '高价值沉睡用户', value: 7.65, color: '#f59e0b' },
                          { name: '低价值/流失用户', value: 0.52, color: '#6b7280' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
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
              <Card key={stat.category} className="hover:shadow-lg transition-shadow">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">K-means聚类结果（K=10）</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 肘部法则图和轮廓系数图 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 肘部法则图 */}
                <Card>
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
                          <YAxis label={{ value: 'SSE（簇内平方和）', angle: -90, position: 'insideLeft' }} />
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
                      <div className="mt-2 text-xs text-gray-600 text-center">
                        K=10 处为肘部拐点，SSE 下降趋势明显放缓
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* 轮廓系数图 */}
                <Card>
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
              
              {/* 核心簇特征详情 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">核心簇特征详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kmeansClusters
                      .map((cluster, index) => {
                        // 从聚类名称中提取簇ID
                        const clusterId = cluster.name.split('_')[0].replace('簇', '');
                        
                        return (
                          <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">簇 {clusterId}</p>
                                  <p className="text-xs text-gray-500">{cluster.name.replace('簇' + clusterId + '_', '')}</p>
                                </div>
                                <Badge variant="secondary">{cluster.percentage}</Badge>
                              </div>
                              <div className="space-y-1">
                                <Badge className="bg-rose-100 text-rose-700">{cluster.valueLevel}</Badge>
                                <p className="text-xs text-gray-600">用户数: {cluster.count}</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 肤质-产品匹配 */}
        <TabsContent value="skin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">肤质-产品匹配度矩阵</CardTitle>
            </CardHeader>
            <CardContent>
              <SkinProductHeatmap />
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>匹配度:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-100 rounded"></div>
                  <span>低</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-300 rounded"></div>
                  <span>中</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-400 rounded"></div>
                  <span>较高</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-500 rounded"></div>
                  <span>高</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                匹配度基于用户购买行为、复购率、Uplift 增益效果综合计算，范围 0-1，数值越高适配性越强。
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productSeries.map(series => (
              <Card key={series.name} className="hover:shadow-lg transition-shadow">
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
                  <p className="text-xs text-rose-500">主打功效: {series.mainEffect}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 用户列表 */}
        <TabsContent value="users" className="space-y-4">
          <Card>
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
                            className="cursor-pointer hover:bg-gray-50"
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
            <Card className="border-rose-200 bg-rose-50/30">
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
