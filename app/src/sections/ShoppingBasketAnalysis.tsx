import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Sparkles,
  Star
} from 'lucide-react';
import { associationRules, coreMetrics } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductSimilarityHeatmap from '@/components/ProductSimilarityHeatmap';



// 关联规则数据（从CSV文件导入）
const csvAssociationRules = [
  { id: 1, rule: '双抗精华3.0 → 双抗水乳套装', support: '36%', confidence: '73%', lift: '2.9x' },
  { id: 2, rule: '红宝石精华3.0 → 红宝石抗皱面霜3.0', support: '29%', confidence: '69%', lift: '2.6x' },
  { id: 3, rule: '净颜洗面奶 → 水动力氨基酸洁面乳', support: '43%', confidence: '59%', lift: '2.0x' },
  { id: 4, rule: '云朵防晒霜 → 净颜洗面奶', support: '26%', confidence: '56%', lift: '1.9x' },
  { id: 5, rule: '红宝石冰陀螺眼霜 → 红宝石精华3.0', support: '24%', confidence: '62%', lift: '2.3x' },
  { id: 6, rule: '双抗精华3.0 → 双抗小夜灯眼霜', support: '22%', confidence: '58%', lift: '2.1x' },
  { id: 7, rule: '红宝石抗皱面霜3.0 → 红宝石活肤乳2.0', support: '21%', confidence: '57%', lift: '1.9x' },
  { id: 8, rule: '神经酰胺涂抹面膜 → 源力面霜2.0', support: '18%', confidence: '54%', lift: '1.8x' },
  { id: 9, rule: '至简密护安瓶精华液 → 赋能鲜颜淡纹紧致活肤水', support: '16%', confidence: '53%', lift: '1.7x' },
  { id: 10, rule: '双抗精华水 → 双抗精华3.0', support: '19%', confidence: '55%', lift: '2.2x' }
];

// 推荐套装组合数据（从CSV文件导入）
const recommendedSets = [
  { id: 1, name: '抗老焕颜全能套装', products: '红宝石精华3.0 + 红宝石抗皱面霜3.0 + 红宝石冰陀螺眼霜', originalPrice: '¥988', salePrice: '¥856', matchRate: '95%', description: '早C晚A抗老三件套，珀莱雅抗老线核心爆款' },
  { id: 2, name: '水光亮透焕肤套装', products: '双抗精华3.0 + 双抗水乳套装 + 神经酰胺涂抹面膜', originalPrice: '¥1066', salePrice: '¥899', matchRate: '92%', description: '双抗系列全链路抗氧，搭配面膜提亮，适合熬夜党' },
  { id: 3, name: '净颜清爽防护套装', products: '净颜洗面奶 + 水动力氨基酸洁面乳 + 云朵防晒霜', originalPrice: '¥327', salePrice: '¥279', matchRate: '88%', description: '日常清洁+防晒三件套，油皮/混油刚需，高复购' },
  { id: 4, name: '红宝石抗老水乳套装', products: '红宝石精华3.0 + 红宝石活肤乳2.0 + 赋能鲜颜淡纹紧致活肤水', originalPrice: '¥817', salePrice: '¥699', matchRate: '93%', description: '红宝石系列水乳精华三件套，紧致抗皱，适合25+抗初老' },
  { id: 5, name: '双抗全系列提亮套装', products: '双抗精华3.0 + 双抗水乳套装 + 双抗小夜灯眼霜 + 双抗精华水', originalPrice: '¥1355', salePrice: '¥1129', matchRate: '91%', description: '双抗系列全家桶，全脸抗氧提亮，适合黄皮暗沉肌' },
  { id: 6, name: '敏肌修护舒缓套装', products: '源力面霜2.0 + 神经酰胺涂抹面膜 + 水动力氨基酸洁面乳', originalPrice: '¥527', salePrice: '¥439', matchRate: '89%', description: '敏肌修护三件套，温和清洁+修护+锁水，敏感肌专属' },
  { id: 7, name: '早C晚A黄金套装', products: '双抗精华3.0 + 红宝石精华3.0 + 红宝石抗皱面霜3.0', originalPrice: '¥1107', salePrice: '¥929', matchRate: '94%', description: '经典早C晚A组合，抗氧+抗皱双效，珀莱雅王牌组合' },
  { id: 8, name: '眼周抗老焕亮套装', products: '红宝石冰陀螺眼霜 + 双抗小夜灯眼霜 + 红宝石精华3.0', originalPrice: '¥938', salePrice: '¥799', matchRate: '90%', description: '双眼霜+精华，眼周全维度抗老，适合眼纹、黑眼圈用户' },
  { id: 9, name: '功效护肤入门套装', products: '双抗精华3.0 + 净颜洗面奶 + 云朵防晒霜', originalPrice: '¥696', salePrice: '¥579', matchRate: '87%', description: '入门功效护肤三件套，抗氧+清洁+防晒，新手友好' },
  { id: 10, name: '安瓶密集修护套装', products: '至简密护安瓶精华液 + 源力面霜2.0 + 神经酰胺涂抹面膜', originalPrice: '¥877', salePrice: '¥739', matchRate: '86%', description: '安瓶+面霜+面膜，密集修护，适合换季/医美术后修护' }
];

export default function ShoppingBasketAnalysis() {
  return (
    <div className="space-y-8">
      {/* 标题区 */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-pink-400" />
          <Badge variant="secondary" className="bg-pink-50 text-pink-600 border-pink-200">
            购物篮分析
          </Badge>
          <Sparkles className="w-6 h-6 text-pink-400" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
          购物篮关联分析
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          基于关联规则算法的产品购买模式分析，发现消费者购买行为中的潜在规律
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            {coreMetrics.totalOrders.toLocaleString()} 订单数据
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            10+ 关联规则
          </span>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">平均购物篮商品数</p>
                <h3 className="text-3xl font-bold text-gray-800">2.4</h3>
                <p className="text-xs text-gray-400 mt-1">每笔订单平均商品数</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">最高关联度商品</p>
                <h3 className="text-lg font-bold text-gray-800">双抗精华3.0 → 双抗水乳套装</h3>
                <p className="text-xs text-gray-400 mt-1">提升度: 2.9x</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">关联规则数量</p>
                <h3 className="text-3xl font-bold text-gray-800">10</h3>
                <p className="text-xs text-gray-400 mt-1">有效关联规则</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 商品相似度热力图 */}
      <ProductSimilarityHeatmap />

      {/* 关联规则和推荐套装组合 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 关联规则榜单 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-pink-400" />
              关联规则榜单
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {csvAssociationRules.map((rule) => (
                <div key={rule.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${rule.id <= 3 ? 'bg-orange-500' : 'bg-gray-500'}`}>
                      {rule.id}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800 mb-1">{rule.rule}</div>
                      <div className="flex flex-wrap gap-3">
                        <span className="text-xs text-gray-600">支持度: {rule.support}</span>
                        <span className="text-xs text-gray-600">置信度: {rule.confidence}</span>
                        <span className="text-xs text-pink-600 font-medium">提升度: {rule.lift}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 推荐套装组合 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="w-4 h-4 text-pink-400" />
              推荐套装组合
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedSets.map((set) => (
              <div key={set.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800 mb-0.5">{set.name}</div>
                    <div className="text-xs text-gray-600 mb-0.5">{set.products}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600">匹配度 {set.matchRate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-pink-600">{set.salePrice}</div>
                    <div className="text-xs text-gray-400 line-through">{set.originalPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 购物篮分析洞察 */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-pink-400" />
            购物篮分析洞察
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-semibold text-gray-800">产品组合策略</h4>
              <p className="text-sm text-gray-600">
                基于关联规则，建议将双抗精华3.0与双抗水乳套装、红宝石精华3.0与红宝石抗皱面霜3.0等产品进行组合销售，
                可以提高客单价和整体销售额
              </p>
            </div>
            <div className="space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-semibold text-gray-800">营销策略优化</h4>
              <p className="text-sm text-gray-600">
                针对购买净颜洗面奶的用户，可以推荐水动力氨基酸洁面乳；
                针对购买云朵防晒霜的用户，也可以推荐净颜洗面奶，提高交叉销售率
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
