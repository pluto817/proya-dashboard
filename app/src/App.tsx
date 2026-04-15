import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  DollarSign,
  Sparkles,
  ShoppingCart,
  LogOut,
  Package,
  AlertTriangle
} from 'lucide-react';
import HomeOverview from '@/sections/HomeOverview';
import UserInsightCenter from '@/sections/UserInsightCenter';
import UpliftDecisionCenter from '@/sections/UpliftDecisionCenter';
import SmartMessageAssistant from '@/sections/SmartMessageAssistant';
import ROIEvaluation from '@/sections/ROIEvaluation';
import ShoppingBasketAnalysis from '@/sections/ShoppingBasketAnalysis';
import SmartReplenishment from '@/sections/SmartReplenishment';
import RiskWarning from '@/sections/RiskWarning';
import Login from '@/sections/Login';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 检查本地存储中的token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-purple-50/30 to-blue-50/50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
                  解码"她"的数据
                </h1>
                <p className="text-xs text-gray-500">珀莱雅精准营销智能决策系统</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-rose-500"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">退出登录</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8 bg-white/60 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">首页总览</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insight"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-400 data-[state=active]:to-rose-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">用户洞察</span>
            </TabsTrigger>
            <TabsTrigger 
              value="uplift"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Uplift决策</span>
            </TabsTrigger>
            <TabsTrigger 
              value="basket"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">购物篮分析</span>
            </TabsTrigger>
            <TabsTrigger 
              value="roi"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">ROI评估</span>
            </TabsTrigger>
            <TabsTrigger 
              value="replenishment"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-400 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">智能补货</span>
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">风险预警</span>
            </TabsTrigger>
            <TabsTrigger 
              value="message"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">智能私信</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <HomeOverview />
          </TabsContent>

          <TabsContent value="insight" className="mt-0">
            <UserInsightCenter />
          </TabsContent>

          <TabsContent value="replenishment" className="mt-0">
            <SmartReplenishment />
          </TabsContent>

          <TabsContent value="risk" className="mt-0">
            <RiskWarning />
          </TabsContent>

          <TabsContent value="uplift" className="mt-0">
            <UpliftDecisionCenter />
          </TabsContent>

          <TabsContent value="basket" className="mt-0">
            <ShoppingBasketAnalysis />
          </TabsContent>

          <TabsContent value="roi" className="mt-0">
            <ROIEvaluation />
          </TabsContent>

          <TabsContent value="message" className="mt-0">
            <SmartMessageAssistant />
          </TabsContent>
        </Tabs>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-rose-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              基于Uplift因果推断的珀莱雅精准营销增效模型
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>100,000+ 用户数据</span>
              <span>393,211 订单数据</span>
              <span>Qini系数: 0.080</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
