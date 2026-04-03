import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Sparkles
} from 'lucide-react';
import { associationRules, coreMetrics } from '@/data/mockData';

interface RuleCardProps {
  antecedents: string;
  consequents: string;
  support: number;
  confidence: number;
  lift: number;
}

function RuleCard({ antecedents, consequents, support, confidence, lift }: RuleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-pink-100 text-pink-600 border-pink-200">
              关联规则
            </Badge>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {antecedents} → {consequents}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="text-center">
              <p className="text-xs text-gray-500">支持度</p>
              <p className="text-lg font-bold text-pink-500">{support.toFixed(3)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">置信度</p>
              <p className="text-lg font-bold text-pink-500">{confidence.toFixed(3)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">提升度</p>
              <p className="text-lg font-bold text-pink-500">{lift.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
            6+ 关联规则
          </span>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
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

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">最高关联度商品</p>
                <h3 className="text-2xl font-bold text-gray-800">面霜 → 精华</h3>
                <p className="text-xs text-gray-400 mt-1">提升度: 1.265</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">关联规则数量</p>
                <h3 className="text-3xl font-bold text-gray-800">6</h3>
                <p className="text-xs text-gray-400 mt-1">有效关联规则</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 关联规则列表 */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pink-400" />
            产品关联规则
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {associationRules.map((rule, index) => (
              <RuleCard
                key={index}
                antecedents={rule.antecedents}
                consequents={rule.consequents}
                support={rule.support}
                confidence={rule.confidence}
                lift={rule.lift}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 购物篮分析洞察 */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-pink-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-pink-400" />
            购物篮分析洞察
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-semibold text-gray-800">产品组合策略</h4>
              <p className="text-sm text-gray-600">
                基于关联规则，建议将面霜、精华、眼霜等产品进行组合销售，
                可以提高客单价和整体销售额
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-pink-500" />
              </div>
              <h4 className="font-semibold text-gray-800">营销策略优化</h4>
              <p className="text-sm text-gray-600">
                针对购买面霜的用户，可以推荐精华产品；
                针对购买套装的用户，也可以推荐精华产品，提高交叉销售率
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
