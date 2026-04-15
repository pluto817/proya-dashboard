import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';

// ROI对比图表
function ROIComparisonChart() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const data = [
    { name: '随机投放', value: 31071, color: '#9ca3af' },
    { name: 'Uplift驱动', value: 54751, color: '#f43f5e' }
  ];
  
  const maxValue = Math.max(...data.map(d => d.value));
  
  // 组件挂载时启动动画
  useEffect(() => {
    const animationDuration = 1500; // 动画持续时间（毫秒）
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / animationDuration, 1);
      
      const newProgress: { [key: string]: number } = {};
      data.forEach(item => {
        newProgress[item.name] = progressRatio;
      });
      
      setProgress(newProgress);
      
      if (progressRatio < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    animateProgress();
  }, []);
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div 
          key={item.name} 
          className="space-y-2"
          onMouseEnter={() => setHovered(item.name)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${hovered === item.name ? 'text-gray-900' : 'text-gray-700'}`}>
              {item.name}
            </span>
            <span 
              className={`text-lg font-bold transition-all duration-300 ${hovered === item.name ? 'scale-105' : ''}`}
              style={{ color: item.color }}
            >
              ¥{item.value.toLocaleString()}
            </span>
          </div>
          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div 
              className="h-full rounded-lg transition-all duration-1000 ease-out"
              style={{ 
                width: `${(item.value / maxValue) * 100 * (progress[item.name] || 0)}%`,
                backgroundColor: item.color,
                transform: hovered === item.name ? 'scaleX(1.02)' : 'scaleX(1)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          {index === 1 && (
            <div className="flex items-center justify-end gap-2 text-sm">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-300">
                <TrendingUp className="w-3 h-3 mr-1" />
                +76.2%
              </Badge>
              <span className="text-gray-500">净收益提升</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 投放人群构成
function AudienceComposition() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const data = [
    { type: '敏感型', percentage: 37.3, color: 'bg-rose-500', count: 7530, description: '对营销活动反应强烈，容易被转化' },
    { type: '自然转化型', percentage: 62.7, color: 'bg-emerald-500', count: 12679, description: '即使没有营销活动也会自然转化' },
    { type: '反作用型', percentage: 0, color: 'bg-amber-500', count: 0, description: '营销活动可能产生负面效果' },
    { type: '沉睡型', percentage: 0, color: 'bg-gray-400', count: 0, description: '对营销活动无反应' }
  ];
  
  // 组件挂载时启动动画
  useEffect(() => {
    const animationDuration = 1500; // 动画持续时间（毫秒）
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / animationDuration, 1);
      
      const newProgress: { [key: string]: number } = {};
      data.forEach(item => {
        newProgress[item.type] = progressRatio;
      });
      
      setProgress(newProgress);
      
      if (progressRatio < 1) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    animateProgress();
  }, []);
  
  return (
    <div className="space-y-3">
      {data.map(item => (
        <div 
          key={item.type} 
          className="flex items-center gap-3 group"
          onMouseEnter={() => setHovered(item.type)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className={`w-20 text-sm ${hovered === item.type ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
            {item.type}
          </div>
          <div className="flex-1">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                style={{ 
                  width: `${item.percentage * (progress[item.type] || 0)}%`,
                  transform: hovered === item.type ? 'scaleX(1.02)' : 'scaleX(1)',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          </div>
          <div className={`w-16 text-right text-sm ${hovered === item.type ? 'font-medium' : ''}`}>
            {item.percentage}%
          </div>
          <div className={`w-16 text-right text-xs ${hovered === item.type ? 'text-gray-600' : 'text-gray-400'}`}>
            {item.count.toLocaleString()}人
          </div>
          {hovered === item.type && (
            <div className="absolute right-4 bg-white p-2 rounded-md shadow-md text-xs text-gray-600 z-10">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 不同投放规模下的收益曲线
function ProfitCurveChart() {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  // 模拟数据
  const data = [
    { scale: 0, uplift: 0, random: 0 },
    { scale: 10, uplift: 18250, random: 10357 },
    { scale: 20, uplift: 36500, random: 20714 },
    { scale: 30, uplift: 54751, random: 31071 }, // 最优投放点
    { scale: 40, uplift: 52500, random: 41428 },
    { scale: 50, uplift: 50250, random: 51785 },
    { scale: 60, uplift: 48000, random: 62142 },
    { scale: 70, uplift: 45750, random: 72499 },
    { scale: 80, uplift: 43500, random: 82856 },
    { scale: 90, uplift: 41250, random: 93213 },
    { scale: 100, uplift: 39000, random: 103570 }
  ];
  
  const handleDotClick = (data: any) => {
    setSelectedPoint(data.scale);
  };
  
  const getSelectedData = () => {
    if (selectedPoint === null) return null;
    return data.find(item => item.scale === selectedPoint);
  };
  
  const selectedData = getSelectedData();
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="scale" 
            label={{ value: '投放规模 (%)', position: 'insideBottom', offset: -5 }} 
            domain={[0, 100]}
          />
          <YAxis 
            label={{ value: '净收益 (元)', angle: -90, position: 'insideLeft' }} 
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [`¥${value.toLocaleString()}`, name === 'uplift' ? 'Uplift策略' : '随机策略']}
            labelFormatter={(label) => `投放规模: ${label}%`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="uplift" 
            name="Uplift策略" 
            stroke="#f43f5e" 
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: '#f43f5e',
              stroke: '#fff',
              strokeWidth: 2,
              cursor: 'pointer'
            }}
            activeDot={{ 
              r: 8, 
              fill: '#ec4899',
              stroke: '#fff',
              strokeWidth: 2
            }}
            onClick={handleDotClick}
          />
          <Line 
            type="monotone" 
            dataKey="random" 
            name="随机策略" 
            stroke="#9ca3af" 
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: '#9ca3af',
              stroke: '#fff',
              strokeWidth: 2,
              cursor: 'pointer'
            }}
            activeDot={{ 
              r: 8, 
              fill: '#6b7280',
              stroke: '#fff',
              strokeWidth: 2
            }}
            onClick={handleDotClick}
          />
          {/* 最优投放点标注 */}
          <ReferenceLine x={30} stroke="#f43f5e" strokeDasharray="3 3" />
          <ReferenceDot x={30} y={54751} r={6} fill="#f43f5e" />
          {/* 选中点标注 */}
          {selectedPoint !== null && (
            <ReferenceLine 
              x={selectedPoint} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              strokeWidth={1}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        {selectedData ? (
          <div className="text-sm text-gray-600">
            选中投放规模：{selectedData.scale}% | Uplift策略收益：¥{selectedData.uplift.toLocaleString()} | 随机策略收益：¥{selectedData.random.toLocaleString()}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            最优投放点：30% 投放规模，净收益 54751 元，ROI 最高
          </div>
        )}
      </div>
    </div>
  );
}

export default function ROIEvaluation() {
  // 业务参数
  const params = {
    orderProfit: 75, // 每单利润
    couponCost: 4.5, // 优惠券成本
    avgOrderValue: 480, // 客单价
    netMargin: 15.6 // 净利率
  };

  // 计算结果
  const randomStrategy = {
    users: 20209,
    netProfit: 31071.34,
    avgProfitPerUser: 1.5375
  };

  const upliftStrategy = {
    users: 20209,
    netProfit: 54751.02,
    avgProfitPerUser: 2.709
  };

  const improvement = {
    netProfit: ((upliftStrategy.netProfit - randomStrategy.netProfit) / randomStrategy.netProfit * 100).toFixed(1),
    avgProfit: ((upliftStrategy.avgProfitPerUser - randomStrategy.avgProfitPerUser) / randomStrategy.avgProfitPerUser * 100).toFixed(1)
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">ROI评估与策略落地</h2>
        <p className="text-gray-500">量化模型业务价值，优化投放预算分配</p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg transition-all duration-300 hover:bg-rose-200">
                <DollarSign className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">每单利润</p>
                <p className="text-xl font-bold transition-all duration-300 hover:scale-105">¥{params.orderProfit}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg transition-all duration-300 hover:bg-purple-200">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">优惠券成本</p>
                <p className="text-xl font-bold transition-all duration-300 hover:scale-105">¥{params.couponCost}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg transition-all duration-300 hover:bg-blue-200">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">客单价</p>
                <p className="text-xl font-bold transition-all duration-300 hover:scale-105">¥{params.avgOrderValue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg transition-all duration-300 hover:bg-emerald-200">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">净利率</p>
                <p className="text-xl font-bold transition-all duration-300 hover:scale-105">{params.netMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-500" />
              净收益对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ROIComparisonChart />
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-500" />
              Uplift策略投放人群构成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AudienceComposition />
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">自动规避反作用型用户</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                模型成功识别并规避了所有反作用型用户（65人），避免了潜在的负面效果
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细对比表 */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">策略对比详情</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-medium text-gray-500">指标</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-500">传统随机投放</th>
                  <th className="p-3 text-center text-sm font-medium text-rose-500">Uplift驱动策略</th>
                  <th className="p-3 text-center text-sm font-medium text-emerald-500">提升幅度</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="p-3 text-gray-700">投放人数</td>
                  <td className="p-3 text-center">{randomStrategy.users.toLocaleString()}人</td>
                  <td className="p-3 text-center font-medium">{upliftStrategy.users.toLocaleString()}人</td>
                  <td className="p-3 text-center text-gray-400">-</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-gray-700">预期净收益</td>
                  <td className="p-3 text-center">¥{randomStrategy.netProfit.toLocaleString()}</td>
                  <td className="p-3 text-center font-medium text-rose-600">¥{upliftStrategy.netProfit.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-100 text-emerald-700">+{improvement.netProfit}%</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-gray-700">人均净收益</td>
                  <td className="p-3 text-center">¥{randomStrategy.avgProfitPerUser.toFixed(2)}</td>
                  <td className="p-3 text-center font-medium text-rose-600">¥{upliftStrategy.avgProfitPerUser.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-100 text-emerald-700">+{improvement.avgProfit}%</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-gray-700">反作用型用户投放</td>
                  <td className="p-3 text-center text-amber-600">约20人（随机）</td>
                  <td className="p-3 text-center font-medium text-emerald-600">0人（完全规避）</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-100 text-emerald-700">100%规避</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-700">敏感型用户占比</td>
                  <td className="p-3 text-center">约30%（随机）</td>
                  <td className="p-3 text-center font-medium text-rose-600">37.3%（精准定位）</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-emerald-100 text-emerald-700">+7.3pp</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 预算优化建议 */}
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            投放预算优化建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-rose-50 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 hover:bg-rose-200">
                <span className="text-lg font-bold text-rose-500 transition-all duration-300 hover:scale-110">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 transition-all duration-300 hover:scale-105">核心预算分配</h4>
              <p className="text-sm text-gray-600">
                建议将营销预算的70%-80%用于投放模型识别出的高ITE用户（敏感型用户和高ITE自然转化型用户），
                这部分人群能带来最高的边际收益。
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 hover:bg-purple-200">
                <span className="text-lg font-bold text-purple-500 transition-all duration-300 hover:scale-110">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 transition-all duration-300 hover:scale-105">动态规模调整</h4>
              <p className="text-sm text-gray-600">
                最优投放规模（20,209人）是基于当前业务参数的理论最优值。实际运营中可根据营销目标（拉新、促活、冲销量）
                和预算总额动态调整。
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 hover:bg-amber-200">
                <span className="text-lg font-bold text-amber-500 transition-all duration-300 hover:scale-110">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 transition-all duration-300 hover:scale-105">黑名单机制</h4>
              <p className="text-sm text-gray-600">
                将反作用型用户（占0.3%）和部分低ITE自然转化型用户自动加入营销排除名单，
                停止发放带成本的优惠券，避免预算浪费和负面效果。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 总结 */}
      <Card className="bg-gradient-to-r from-rose-50 to-purple-50 border-rose-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
              <TrendingUp className="w-6 h-6 text-rose-500 transition-all duration-300 hover:rotate-12" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 transition-all duration-300 hover:scale-105">核心结论</h4>
              <p className="text-gray-700">
                基于Uplift模型的最优投放策略较传统随机投放实现了<span className="font-bold text-rose-600 transition-all duration-300 hover:scale-110">76.2%</span>的净收益提升，
                同时自动规避了所有反作用型用户。这一结果验证了因果推断方法在精准营销中的经济价值，
                为品牌从"经验驱动"向"算法驱动"转型提供了可量化的实践范式。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
