import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Sparkles,
  Target,
  BarChart3,
  MessageSquare,
  LineChart
} from 'lucide-react';
import { coreMetrics, monthlySales } from '@/data/mockData';
import { LineChart as RechartsLineChart, Line, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
  borderColor?: string;
}

function MetricCard({ title, value, subtitle, icon, trend, color, borderColor = 'border-gray-200' }: MetricCardProps) {
  const [borderWidth, setBorderWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setBorderWidth(2);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 rounded-xl shadow-md bg-white backdrop-blur-sm relative`} style={{ borderWidth: borderWidth, borderColor: borderColor.replace('border-', ''), transition: 'border-width 1s ease-out' }}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              {trend && (
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-emerald-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {trend}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



export default function HomeOverview() {
  return (
    <div className="space-y-8">
      {/* 标题区 */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          解码"她"的数据
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          基于Uplift因果推断的珀莱雅精准营销智能决策系统
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {coreMetrics.totalUsers.toLocaleString()} 用户
          </span>
          <span className="flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            {coreMetrics.totalOrders.toLocaleString()} 订单
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            10+ 分析维度
          </span>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricCard
          title="总销售额"
          value={`¥${(coreMetrics.totalSales / 10000).toFixed(0)}万`}
          subtitle={`${coreMetrics.totalOrders.toLocaleString()} 订单`}
          icon={<ShoppingBag className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-purple-400 to-purple-500"
          borderColor="border-2 border-purple-400"
        />
        <MetricCard
          title="总销售数量"
          value={coreMetrics.totalSalesQuantity.toLocaleString()}
          subtitle="件商品"
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-amber-400 to-amber-500"
          borderColor="border-2 border-amber-400"
        />
      </div>

      {/* 月销量柱状图 */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-gray-800">月销量趋势</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlySales}
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 70000]}
                  label={{ value: '月销量（订单数）', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} 订单`, '月销量']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar 
                  dataKey="sales" 
                  fill="url(#salesGradient)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 月总收入折线图 */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-gray-800">月总收入趋势</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={monthlySales}
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}`}
                  tick={{ fontSize: 12 }}
                  domain={[0, 3000]}
                  label={{ value: '月总收入（万元）', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} 万元`, '月总收入']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="url(#revenueGradient)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#7c3aed' }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 核心创新点 */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-rose-400" />
        核心创新点
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-rose-50/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="font-semibold text-gray-800">技术融合创新</h4>
              <p className="text-sm text-gray-600">
                将描述性分析（RFM、肤质矩阵、关联规则）与因果推断（Uplift模型）有机结合，
                形成"洞察-归因-优化"完整方法论
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-purple-50/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-800">业务场景深度</h4>
              <p className="text-sm text-gray-600">
                聚焦美妆行业特有属性，构建"用户-肤质-产品-敏感度"四维标签体系，
                实现产品适配性与用户敏感度的交叉分析
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-blue-50/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="font-semibold text-gray-800">应用模式创新</h4>
              <p className="text-sm text-gray-600">
                模型可直接输出敏感型用户名单与个性化营销策略，
                提供从用户洞察到营销执行的全链路决策支持
              </p>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
