import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, TrendingUp, ArrowRight, BarChart3, MapPin, Cpu } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const RiskWarning = () => {
  const [selectedProduct, setSelectedProduct] = useState('云朵防晒霜小银伞防晒');

  // 商品风险指标数据（从CSV文件导入）
  const riskData = [
    { name: '云朵防晒霜小银伞防晒', cv: 0.99, inventoryShare: 0.141736266, concentration: 0.600808703, timeConcentration: 0.94639767, compositeScore: 0.66973566, riskLevel: '高风险' },
    { name: '红宝石冰陀螺眼霜', cv: 0.418073912, inventoryShare: 0.99, concentration: 0.491703126, timeConcentration: 0.467822606, compositeScore: 0.591899911, riskLevel: '中风险' },
    { name: '红宝石精华3.0', cv: 0.654080103, inventoryShare: 0.836544361, concentration: 0.269344514, timeConcentration: 0.546269255, compositeScore: 0.576559558, riskLevel: '中风险' },
    { name: '双抗水乳套装', cv: 0.362562348, inventoryShare: 0.752653246, concentration: 0.042007398, timeConcentration: 0.99, compositeScore: 0.536805748, riskLevel: '中风险' },
    { name: '双抗精华3.0', cv: 0.322371548, inventoryShare: 0.809100368, concentration: 0.431364202, timeConcentration: 0.333908978, compositeScore: 0.474186274, riskLevel: '中风险' },
    { name: '水动力洁面', cv: 0.817970611, inventoryShare: 0.079648827, concentration: 0.01, timeConcentration: 0.938068561, compositeScore: 0.461422, riskLevel: '中风险' },
    { name: '赋能鲜颜淡纹紧致活肤水', cv: 0.154005187, inventoryShare: 0.532825803, concentration: 0.99, timeConcentration: 0.03436821, compositeScore: 0.4277998, riskLevel: '中风险' },
    { name: '双抗精华水', cv: 0.385690866, inventoryShare: 0.718247692, concentration: 0.416952698, timeConcentration: 0.119859719, compositeScore: 0.410187744, riskLevel: '中风险' },
    { name: '红宝石活肤乳2.0', cv: 0.485243622, inventoryShare: 0.265757726, concentration: 0.580776308, timeConcentration: 0.155243653, compositeScore: 0.371755327, riskLevel: '中风险' },
    { name: '双抗小夜灯眼霜', cv: 0.01, inventoryShare: 0.764127599, concentration: 0.322392123, timeConcentration: 0.175840956, compositeScore: 0.31809017, riskLevel: '低风险' },
    { name: '水动力氨基酸洁面乳', cv: 0.2111515, inventoryShare: 0.522917787, concentration: 0.09987869, timeConcentration: 0.297723651, compositeScore: 0.282917907, riskLevel: '低风险' },
    { name: '源力面霜2.0', cv: 0.324023848, inventoryShare: 0.426059492, concentration: 0.305869503, timeConcentration: 0.070458323, compositeScore: 0.281602791, riskLevel: '低风险' },
    { name: '红宝石抗皱面霜3.0', cv: 0.400601614, inventoryShare: 0.312012774, concentration: 0.14895016, timeConcentration: 0.196766636, compositeScore: 0.264582796, riskLevel: '低风险' },
    { name: '水动力氨基酸洁面乳涂抹式', cv: 0.01, inventoryShare: 0.320964562, concentration: 0.184085611, timeConcentration: 0.485219525, compositeScore: 0.250067424, riskLevel: '低风险' },
    { name: '红宝石面颈精华棒', cv: 0.258167393, inventoryShare: 0.231344896, concentration: 0.058181532, timeConcentration: 0.01, compositeScore: 0.139423455, riskLevel: '低风险' },
    { name: '净颜洁面泡泡', cv: 0.075375386, inventoryShare: 0.01, concentration: 0.340077149, timeConcentration: 0.126142856, compositeScore: 0.137898848, riskLevel: '低风险' }
  ];

  const highRiskCount = riskData.filter(item => item.riskLevel === '高风险').length;
  const mediumRiskCount = riskData.filter(item => item.riskLevel === '中风险').length;
  const lowRiskCount = riskData.filter(item => item.riskLevel === '低风险').length;

  const top5Products = riskData.slice(0, 5);

  const selectedData = riskData.find(item => item.name === selectedProduct) || riskData[0];

  const radarOption = {
    title: {
      text: '五维风险画像',
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#2d3748',
        fontFamily: 'Times New Roman, 宋体'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params: any) {
        const data = params.data;
        return `
          <div style="font-weight: bold; margin-bottom: 5px;">${data.name}</div>
          <div>需求波动风险: ${(data.value[0] * 100).toFixed(1)}%</div>
          <div>用户敏感风险: ${(data.value[1] * 100).toFixed(1)}%</div>
          <div>地理集中风险: ${(data.value[2] * 100).toFixed(1)}%</div>
          <div>时间集中风险: ${(data.value[3] * 100).toFixed(1)}%</div>
          <div>综合风险评分: ${(data.value[4] * 100).toFixed(1)}%</div>
        `;
      }
    },
    radar: {
      indicator: [
        { name: '需求波动风险', max: 1 },
        { name: '用户敏感风险', max: 1 },
        { name: '地理集中风险', max: 1 },
        { name: '时间集中风险', max: 1 },
        { name: '综合风险评分', max: 1 }
      ],
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#6b7280',
        fontSize: 11,
        padding: [5, 5]
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(236, 72, 153, 0.2)'
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(249, 168, 212, 0.05)', 'rgba(249, 168, 212, 0.1)', 'rgba(249, 168, 212, 0.15)', 'rgba(249, 168, 212, 0.2)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(236, 72, 153, 0.3)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              selectedData.cv,
              selectedData.inventoryShare,
              selectedData.concentration,
              selectedData.timeConcentration,
              selectedData.compositeScore
            ],
            name: selectedProduct,
            lineStyle: {
              color: '#ec4899',
              width: 2
            },
            areaStyle: {
              color: 'rgba(236, 72, 153, 0.3)'
            },
            itemStyle: {
              color: '#ec4899'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* 标题区 */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
          双碳导向・全域智慧供应链智能决策引擎
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          基于智能规则的供应链决策系统，融合双碳理念，实现高效运营与绿色发展
        </p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-red-200 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">高风险商品</h4>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{highRiskCount}</p>
            <p className="text-sm text-gray-500">需立即处理</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-orange-200 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">中风险商品</h4>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{mediumRiskCount}</p>
            <p className="text-sm text-gray-500">需密切关注</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-blue-200 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">低风险商品</h4>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{lowRiskCount}</p>
            <p className="text-sm text-gray-500">正常运行</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-purple-200 rounded-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">今日新增风险</h4>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">5</p>
            <p className="text-sm text-gray-500">较昨日 +2</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="space-y-6">
        {/* 五维风险画像和商品风险指标筛选 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 五维风险画像 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                五维风险画像
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-72">
                <ReactECharts 
                  option={radarOption} 
                  style={{ width: '100%', height: '100%' }} 
                  opts={{ renderer: 'canvas' }} 
                />
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500">需求波动风险</p>
                  <p className="font-semibold text-pink-600">{selectedData.cv.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">用户敏感风险</p>
                  <p className="font-semibold text-pink-600">{selectedData.inventoryShare.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">地理集中风险</p>
                  <p className="font-semibold text-pink-600">{selectedData.concentration.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">时间集中风险</p>
                  <p className="font-semibold text-pink-600">{selectedData.timeConcentration.toFixed(3)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">综合风险评分</p>
                  <p className="font-semibold text-pink-600">{selectedData.compositeScore.toFixed(3)}</p>
                </div>
              </div>
              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-semibold mb-2">五维风险指标说明：</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• <strong>需求波动风险</strong>：基于变异系数，衡量销量稳定性</li>
                  <li>• <strong>用户敏感风险</strong>：敏感型用户占比，对促销活动的敏感度</li>
                  <li>• <strong>地理集中风险</strong>：赫芬达尔指数，衡量区域集中度</li>
                  <li>• <strong>时间集中风险</strong>：大促依赖度，对促销活动的依赖程度</li>
                  <li>• <strong>综合风险评分</strong>：综合以上四个维度的风险指数</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 商品风险指标筛选 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                商品风险指标筛选
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                {top5Products.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      selectedProduct === item.name 
                        ? 'bg-pink-100 border-2 border-pink-400' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedProduct(item.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.riskLevel === '高风险' ? 'bg-red-100' :
                        item.riskLevel === '中风险' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <span className={`text-sm font-bold ${
                          item.riskLevel === '高风险' ? 'text-red-500' :
                          item.riskLevel === '中风险' ? 'text-orange-500' : 'text-blue-500'
                        }`}>{index + 1}</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                        <p className={`text-xs ${
                          item.riskLevel === '高风险' ? 'text-red-500' :
                          item.riskLevel === '中风险' ? 'text-orange-500' : 'text-blue-500'
                        }`}>
                          CV: {item.cv.toFixed(3)} | 库存占比: {item.inventoryShare.toFixed(3)} | 综合分: {item.compositeScore.toFixed(3)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.riskLevel === '高风险' ? 'bg-red-100 text-red-600' :
                        item.riskLevel === '中风险' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.riskLevel}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 区域库存布局和智能规则执行时序 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 区域库存布局 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                区域库存布局
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-pink-50">
                    <tr>
                      <th scope="col" className="px-4 py-3">省份</th>
                      <th scope="col" className="px-4 py-3">区位熵均值</th>
                      <th scope="col" className="px-4 py-3">库存配置策略</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">上海</td>
                      <td className="px-4 py-3">1.47</td>
                      <td className="px-4 py-3">战略核心囤货，前置仓极速保供</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">浙江</td>
                      <td className="px-4 py-3">1.35</td>
                      <td className="px-4 py-3">战略核心囤货，中心仓全域覆盖</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">湖南</td>
                      <td className="px-4 py-3">1.26</td>
                      <td className="px-4 py-3">稳健标准备货，动态安全补货</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">四川</td>
                      <td className="px-4 py-3">1.22</td>
                      <td className="px-4 py-3">稳健标准备货，智能按需调拨</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">湖北</td>
                      <td className="px-4 py-3">1.22</td>
                      <td className="px-4 py-3">稳健标准备货，弹性敏捷补给</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">广东</td>
                      <td className="px-4 py-3">1.18</td>
                      <td className="px-4 py-3">精益降本备货，成本效率最优</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">北京</td>
                      <td className="px-4 py-3">1.18</td>
                      <td className="px-4 py-3">精益降本备货，精准库存管控</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">江苏</td>
                      <td className="px-4 py-3">1.12</td>
                      <td className="px-4 py-3">精益降本备货，高周转运营</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-pink-50">
                      <td className="px-4 py-3">河南</td>
                      <td className="px-4 py-3">1.07</td>
                      <td className="px-4 py-3">精益降本备货，轻量化储备</td>
                    </tr>
                    <tr className="bg-white hover:bg-pink-50">
                      <td className="px-4 py-3">山东</td>
                      <td className="px-4 py-3">1.04</td>
                      <td className="px-4 py-3">精益降本备货，风险严控备货</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 智能规则执行时序 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                智能规则执行时序
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {[
                  { time: '07:55', rule: '季节备货规则', action: '云朵防晒霜安全库存上调 30%' },
                  { time: '08:20', rule: '物流调度规则', action: '华东区域切换优先物流方案' },
                  { time: '08:45', rule: '爆品识别规则', action: '红宝石精华 3.0 纳入重点监控' },
                  { time: '09:15', rule: '产能锁定规则', action: '双抗精华水锁定产能 20000 件' },
                  { time: '09:30', rule: '库存预警规则', action: '净颜洗面奶上调安全库存 50%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-sm font-semibold text-pink-600">{item.time}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">{item.rule}</div>
                        <p className="text-xs text-gray-600">{item.action}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 决策逻辑与低碳策略解析 - 5张卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 季节备货规则 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-pink-700">季节备货规则</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-2"><strong>判断依据：</strong>区位熵区域偏好+ 春夏消费周期趋势</p>
              <p className="text-xs text-gray-600 mb-3"><strong>决策目标：</strong>前置布局季节热销品，降低断货风险</p>
              <div className="p-2 bg-pink-50 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-900 mb-2">执行与低碳策略：</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 按区位熵精准配置库存</li>
                  <li>• 减少过量生产与库存积压</li>
                  <li>• 降低全链路资源消耗与碳足迹</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500"><strong>体系归属：</strong>日常精益供应链</p>
            </CardContent>
          </Card>
          
          {/* 物流调度规则 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-pink-700">物流调度规则</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-2"><strong>判断依据：</strong>区域库存分布+ 履约时效风险监测</p>
              <p className="text-xs text-gray-600 mb-3"><strong>决策目标：</strong>保障高偏好区域订单稳定送达</p>
              <div className="p-2 bg-pink-50 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-900 mb-2">执行与低碳策略：</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 跨区域智能调仓</li>
                  <li>• 推动就近发货、短链配送</li>
                  <li>• 构建绿色低碳物流体系</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500"><strong>体系归属：</strong>全域风险预警</p>
            </CardContent>
          </Card>
          
          {/* 爆品识别规则 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-pink-700">爆品识别规则</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-2"><strong>判断依据：</strong>大促系数分布+ 销量波动监测</p>
              <p className="text-xs text-gray-600 mb-3"><strong>决策目标：</strong>快速识别潜力爆品，抢占市场窗口期</p>
              <div className="p-2 bg-pink-50 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-900 mb-2">执行与低碳策略：</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 资源向高周转单品倾斜</li>
                  <li>• 减少资源错配</li>
                  <li>• 实现商业效率与低碳发展同步提升</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500"><strong>体系归属：</strong>大促敏捷供应链</p>
            </CardContent>
          </Card>
          
          {/* 产能锁定规则 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-pink-700">产能锁定规则</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-2"><strong>判断依据：</strong>需求预测结果+ 档位柔性池机制</p>
              <p className="text-xs text-gray-600 mb-3"><strong>决策目标：</strong>保障核心单品持续供应，稳定大促供给能力</p>
              <div className="p-2 bg-pink-50 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-900 mb-2">执行与低碳策略：</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 按真实需求量级锁定产能</li>
                  <li>• 避免盲目排产与产能浪费</li>
                  <li>• 以按需生产践行绿色生产理念</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500"><strong>体系归属：</strong>大促敏捷供应链</p>
            </CardContent>
          </Card>
          
          {/* 库存预警规则 */}
          <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-pink-700">库存预警规则</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-2"><strong>判断依据：</strong>动态安全库存模型+ 五维风险综合评分</p>
              <p className="text-xs text-gray-600 mb-3"><strong>决策目标：</strong>降低断货风险，提升高风险商品供给稳定性</p>
              <div className="p-2 bg-pink-50 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-900 mb-2">执行与低碳策略：</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 维持健康库存水位</li>
                  <li>• 减少过期损耗与应急调运</li>
                  <li>• 降低仓储能耗与逆向物流成本</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500"><strong>体系归属：</strong>日常精益供应链</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskWarning;