import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Brain,
  BarChart3,
  Target
} from 'lucide-react';
import { upliftStats, mockUsers, coreMetrics } from '@/data/mockData';

// Qini曲线组件
function QiniCurve() {
  // 模拟Qini曲线数据点
  const curvePoints = [
    { x: 0, y: 0 },
    { x: 10, y: 12 },
    { x: 20, y: 22 },
    { x: 30, y: 32.3 },
    { x: 40, y: 38 },
    { x: 50, y: 42 },
    { x: 60, y: 45 },
    { x: 70, y: 47 },
    { x: 80, y: 48 },
    { x: 90, y: 48.5 },
    { x: 100, y: 48.7 }
  ];
  
  const randomPoints = curvePoints.map(p => ({ x: p.x, y: p.x * 0.5 }));
  
  const width = 500;
  const height = 250;
  const padding = 40;
  
  const xScale = (x: number) => padding + (x / 100) * (width - 2 * padding);
  const yScale = (y: number) => height - padding - (y / 60) * (height - 2 * padding);
  
  const curvePath = curvePoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`
  ).join(' ');
  
  const randomPath = randomPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`
  ).join(' ');
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* 网格线 */}
      {[0, 20, 40, 60, 80, 100].map(tick => (
        <g key={tick}>
          <line 
            x1={xScale(tick)} y1={yScale(0)} 
            x2={xScale(tick)} y2={yScale(60)} 
            stroke="#e5e7eb" strokeDasharray="4"
          />
          <text x={xScale(tick)} y={yScale(0) + 15} textAnchor="middle" className="text-xs fill-gray-400">
            {tick}%
          </text>
        </g>
      ))}
      {[0, 20, 40, 60].map(tick => (
        <g key={tick}>
          <line 
            x1={xScale(0)} y1={yScale(tick)} 
            x2={xScale(100)} y2={yScale(tick)} 
            stroke="#e5e7eb" strokeDasharray="4"
          />
          <text x={xScale(0) - 10} y={yScale(tick) + 4} textAnchor="end" className="text-xs fill-gray-400">
            {tick}%
          </text>
        </g>
      ))}
      
      {/* 随机基线 */}
      <path d={randomPath} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="8" />
      
      {/* Qini曲线 */}
      <path d={curvePath} fill="none" stroke="#f43f5e" strokeWidth="3" />
      
      {/* 区域填充 */}
      <path 
        d={`${curvePath} L ${xScale(100)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`} 
        fill="rgba(244, 63, 94, 0.1)" 
      />
      
      {/* 标签 */}
      <text x={xScale(70)} y={yScale(35)} className="text-sm fill-gray-500">随机基线</text>
      <text x={xScale(50)} y={yScale(48)} className="text-sm fill-rose-500 font-medium">Uplift模型</text>
      
      {/* 轴标签 */}
      <text x={width / 2} y={height - 5} textAnchor="middle" className="text-sm fill-gray-600">
        累计人群比例
      </text>
      <text 
        x={15} y={height / 2} 
        textAnchor="middle" 
        transform={`rotate(-90, 15, ${height / 2})`}
        className="text-sm fill-gray-600"
      >
        累计增益
      </text>
    </svg>
  );
}

// 用户类型卡片
function UserTypeCard({ 
  type, 
  icon: Icon, 
  color, 
  bgColor,
  description,
  recommendation,
  stats 
}: { 
  type: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  recommendation: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <Card className={`hover:shadow-lg transition-shadow border-l-4 ${color}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{type}</h4>
            <p className="text-sm text-gray-500 mb-3">{description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {stats.map((stat, i) => (
                <div key={i} className="px-2 py-1 bg-gray-50 rounded text-xs">
                  <span className="text-gray-400">{stat.label}:</span>
                  <span className="ml-1 font-medium text-gray-700">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-400">策略建议:</span>
              <span className="text-sm text-gray-700">{recommendation}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UpliftDecisionCenter() {
  // 使用useMemo缓存过滤后的用户列表，提高性能
  const sensitiveUsers = useMemo(() => {
    return mockUsers.filter(u => u.upliftType === 'sensitive').slice(0, 50); // 限制最多显示50个用户
  }, []);
  
  const adverseUsers = useMemo(() => {
    return mockUsers.filter(u => u.upliftType === 'adverse').slice(0, 50); // 限制最多显示50个用户
  }, []);
  
  const [selectedSensitiveUser, setSelectedSensitiveUser] = useState(sensitiveUsers[0]?.id || '');
  const [selectedAdverseUser, setSelectedAdverseUser] = useState(adverseUsers[0]?.id || '');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Uplift营销决策中心</h2>
        <p className="text-gray-500">基于因果推断识别营销敏感型用户，实现精准投放</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            模型原理
          </TabsTrigger>
          <TabsTrigger value="qini" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Qini曲线
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            用户分类
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            画像对比
          </TabsTrigger>
        </TabsList>

        {/* 模型原理 */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-500" />
                Uplift模型原理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-rose-50 rounded-xl">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-rose-500">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">潜在结果框架</h4>
                  <p className="text-sm text-gray-600">
                    基于Rubin因果模型，每个用户在干预（发券）和未干预（不发券）两种状态下存在两个"潜在结果"
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-purple-500">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">个体处理效应(ITE)</h4>
                  <p className="text-sm text-gray-600">
                    ITE = Y(1) - Y(0)，表示营销干预带来的真实增量效果，区分自然转化与营销驱动转化
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-blue-500">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">T-Learner估计</h4>
                  <p className="text-sm text-gray-600">
                    分别对处理组和对照组建模，通过两个独立模型的预测差值估计个体因果效应
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">实验设计</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="hover:shadow-lg transition-shadow bg-rose-50">
                    <CardContent className="p-4">
                      <h5 className="text-sm font-medium text-rose-700 mb-2">干预定义</h5>
                      <p className="text-sm text-gray-700">向用户发送"满200减30"通用优惠券，有效期30天</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow bg-purple-50">
                    <CardContent className="p-4">
                      <h5 className="text-sm font-medium text-purple-700 mb-2">分组策略</h5>
                      <p className="text-sm text-gray-700">83,672名用户完全随机分组，50%处理组，50%对照组</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow bg-blue-50">
                    <CardContent className="p-4">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">特征窗口</h5>
                      <p className="text-sm text-gray-700">2025-06-26 ~ 2025-12-23（180天历史行为）</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow bg-green-50">
                    <CardContent className="p-4">
                      <h5 className="text-sm font-medium text-green-700 mb-2">实验窗口</h5>
                      <p className="text-sm text-gray-700">2025-12-23 ~ 2026-03-23（90天观察期）</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  实验样本量 83,672 人，满足因果推断 A/B 实验的样本量要求，分组均衡，实验结果可靠。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qini曲线 */}
        <TabsContent value="qini" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-rose-500" />
                Qini曲线评估
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QiniCurve />
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Qini系数</p>
                    <p className="text-3xl font-bold text-rose-500">{coreMetrics.qiniCoefficient}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      模型排序能力优于随机策略，同等预算下多获得8.0%额外转化
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">真实平均Uplift</p>
                    <p className="text-3xl font-bold text-emerald-500">+{coreMetrics.avgUplift}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      优惠券整体提升8.70个百分点购买转化率
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">关键发现</p>
                    <p className="text-sm text-gray-700">
                      前30%人群贡献了约32.3%的累计增益，说明模型将高敏感用户集中在排序前列
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 用户分类 */}
        <TabsContent value="classification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UserTypeCard
              type="敏感型"
              icon={TrendingUp}
              color="border-rose-500"
              bgColor="bg-rose-100"
              description="营销带来显著正向增量，对优惠券响应积极"
              recommendation="重点投放对象，可配合限时优惠、专属福利等策略"
              stats={[
                { label: '占比', value: '30.0%' },
                { label: '平均ITE', value: '0.126' },
                { label: '人数', value: '7,530' }
              ]}
            />
            <UserTypeCard
              type="自然转化型"
              icon={CheckCircle2}
              color="border-emerald-500"
              bgColor="bg-emerald-100"
              description="不论是否营销都会购买，营销增量效果有限"
              recommendation="避免过度营销浪费预算，适合内容种草、会员权益推送"
              stats={[
                { label: '占比', value: '69.7%' },
                { label: '平均ITE', value: '0.069' },
                { label: '人数', value: '17,507' }
              ]}
            />
            <UserTypeCard
              type="反作用型"
              icon={AlertTriangle}
              color="border-amber-500"
              bgColor="bg-amber-100"
              description="营销反而抑制购买意愿，可能因过度打扰导致流失"
              recommendation="主动规避，停止促销触达，仅保留服务性消息"
              stats={[
                { label: '占比', value: '0.3%' },
                { label: '平均ITE', value: '-0.025' },
                { label: '人数', value: '65' }
              ]}
            />
            <UserTypeCard
              type="沉睡型"
              icon={HelpCircle}
              color="border-gray-400"
              bgColor="bg-gray-100"
              description="任何干预均无效，对营销完全不响应"
              recommendation="低频唤醒尝试，低成本福利试探，降低打扰感"
              stats={[
                { label: '占比', value: '0.0%' },
                { label: '平均ITE', value: '0' },
                { label: '人数', value: '0' }
              ]}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">分类统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upliftStats.map((stat) => (
                  <div key={stat.type} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium">{stat.type}</div>
                    <div className="flex-1">
                      <Progress 
                        value={parseFloat(stat.percentage)} 
                        className="h-3"
                      />
                    </div>
                    <div className="w-20 text-right text-sm">{stat.percentage}</div>
                    <div className="w-24 text-right text-sm text-gray-500">{stat.count.toLocaleString()}人</div>
                    <div className="w-32 text-xs text-gray-400">{stat.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 画像对比 */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">敏感型 vs 反作用型 用户画像对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left text-sm font-medium text-gray-500">指标</th>
                      <th className="p-3 text-center text-sm font-medium text-rose-500">敏感型</th>
                      <th className="p-3 text-center text-sm font-medium text-amber-500">反作用型</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-500">差异解读</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-3 text-gray-700">平均年龄</td>
                      <td className="p-3 text-center font-medium">31.1岁</td>
                      <td className="p-3 text-center font-medium">28.3岁</td>
                      <td className="p-3 text-gray-500">反作用型用户年龄略轻</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-gray-700">历史购买次数</td>
                      <td className="p-3 text-center font-medium">3.9次</td>
                      <td className="p-3 text-center font-medium">4.5次</td>
                      <td className="p-3 text-gray-500">反作用型活跃度更高但转化更差</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-gray-700">会员比例</td>
                      <td className="p-3 text-center font-medium">47.2%</td>
                      <td className="p-3 text-center font-medium">75.4%</td>
                      <td className="p-3 text-gray-500">反作用型会员比例更高，值得警惕</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-gray-700">平均最近购买天数</td>
                      <td className="p-3 text-center font-medium">35天</td>
                      <td className="p-3 text-center font-medium">92天</td>
                      <td className="p-3 text-gray-500">敏感型用户近期活跃度更高</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-gray-700">敏感肌占比</td>
                      <td className="p-3 text-center font-medium">41.2%</td>
                      <td className="p-3 text-center font-medium">23.6%</td>
                      <td className="p-3 text-gray-500">敏感型用户中敏感肌比例更高</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">关键洞察</h4>
                    <p className="text-sm text-amber-700">
                      反作用型用户并非"低价值用户"，而是需要被"静默"对待的群体。他们具有高活跃度、高会员比例的特征，
                      但长期未复购，对营销干预呈现负向响应。盲目营销不仅浪费预算，更可能导致用户永久流失。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                  敏感型用户示例
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedSensitiveUser} onValueChange={setSelectedSensitiveUser}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择用户" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensitiveUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.id} - {user.gender}, {user.age}岁
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSensitiveUser && (
                    <div className="p-3 bg-rose-50 rounded-lg">
                      {(() => {
                        const user = sensitiveUsers.find(u => u.id === selectedSensitiveUser);
                        if (user) {
                          return (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800">{user.id}</span>
                                <Badge className="bg-rose-100 text-rose-700">ITE: {user.ite}</Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.gender}, {user.age}岁, {user.skinType} | {user.userCategory}
                              </div>
                            </>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-amber-500" />
                  反作用型用户示例
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adverseUsers.length > 0 ? (
                    <>
                      <Select value={selectedAdverseUser} onValueChange={setSelectedAdverseUser}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择用户" />
                        </SelectTrigger>
                        <SelectContent>
                          {adverseUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.id} - {user.gender}, {user.age}岁
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedAdverseUser && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                          {(() => {
                            const user = adverseUsers.find(u => u.id === selectedAdverseUser);
                            if (user) {
                              return (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-800">{user.id}</span>
                                    <Badge className="bg-amber-100 text-amber-700">ITE: {user.ite}</Badge>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {user.gender}, {user.age}岁, {user.skinType} | {user.userCategory}
                                  </div>
                                </>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                      模拟数据中暂无反作用型用户
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
