import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  User as UserIcon, 
  Send,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { messageUsers } from '@/data/mockData';
import type { User } from '@/types';

interface GeneratedStrategy {
  shouldContact: boolean;
  recommendedSeries: string;
  discountStrategy: string;
  tone: string;
  messageFocus: string[];
  reason: string;
}

function generateStrategy(user: User): GeneratedStrategy {
  // 根据Uplift类型决定策略
  if (user.upliftType === 'adverse') {
    return {
      shouldContact: false,
      recommendedSeries: '',
      discountStrategy: '不建议发放优惠券',
      tone: '静默',
      messageFocus: ['停止营销触达'],
      reason: '该用户属于反作用型，营销干预会抑制购买意愿'
    };
  }

  if (user.upliftType === 'sleeping') {
    return {
      shouldContact: true,
      recommendedSeries: productSeries[4].name, // 基础保湿系列
      discountStrategy: '低成本福利试探',
      tone: '轻柔唤醒',
      messageFocus: ['温和关怀', '低频触达'],
      reason: '沉睡型用户需用低成本方式试探响应'
    };
  }

  // 根据肤质推荐产品
  const skinScores = skinProductMatrix[user.skinType];
  const bestSeries = Object.entries(skinScores)
    .sort((a, b) => b[1] - a[1])[0][0];

  // 根据用户类型调整策略
  const isSensitive = user.upliftType === 'sensitive';
  const isHighValue = user.userCategory === '核心价值用户';

  return {
    shouldContact: true,
    recommendedSeries: bestSeries,
    discountStrategy: isSensitive 
      ? (isHighValue ? '满300减50' : '满200减30')
      : '内容种草，弱化优惠',
    tone: isHighValue ? '尊享专属' : '亲切关怀',
    messageFocus: isSensitive 
      ? ['限时优惠', '专属福利', '立即行动']
      : ['产品功效', '成分科普', '会员权益'],
    reason: `该用户属于${user.upliftType === 'sensitive' ? '敏感型' : '自然转化型'}，` +
           `肤质为${user.skinType}，推荐${bestSeries}（匹配度${skinScores[bestSeries]}）`
  };
}

function generateMessage(user: User, style: 'gentle' | 'promotional' | 'vip', strategy: GeneratedStrategy): string {
  const skinType = user.skinType;
  const series = strategy.recommendedSeries;
  const discount = strategy.discountStrategy;
  
  const greetings: Record<string, string> = {
    gentle: `亲爱的用户，`,
    promotional: `限时特惠！`,
    vip: `尊敬的VIP会员，`
  };

  const skinDescriptions: Record<string, string> = {
    '敏感肌': '敏感肌需要特别呵护',
    '油性/混油': '清爽控油是您的护肤关键',
    '干性/混干': '深层补水滋养您的肌肤',
    '中性': '维持肌肤平衡状态'
  };

  const seriesEffects: Record<string, string> = {
    '源力系列': '修护屏障，舒缓敏感',
    '红宝石系列': '抗皱紧致，焕活年轻',
    '双抗系列': '抗氧化提亮，告别暗沉',
    '能量系列': '抗衰紧致，重塑轮廓',
    '基础保湿系列': '温和补水，日常护理'
  };

  const endings: Record<string, string> = {
    gentle: `期待为您带来温柔的护肤体验。`,
    promotional: `库存有限，立即抢购！`,
    vip: `感谢您一直以来的信任与支持。`
  };

  if (!strategy.shouldContact) {
    return '【系统建议】该用户属于反作用型，不建议发送营销私信，避免造成用户流失。';
  }

  return `${greetings[style]}\n\n${skinDescriptions[skinType]}，我们为您精选了${series}，${seriesEffects[series] || '满足您的护肤需求'}。${style === 'promotional' ? `现在下单立享${discount}！` : `专属礼遇：${discount}。`}\n\n${endings[style]}`;
}

export default function SmartMessageAssistant() {
  const [selectedUser, setSelectedUser] = useState<User>(messageUsers[0]);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [strategy, setStrategy] = useState<GeneratedStrategy | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customSkill, setCustomSkill] = useState<string>('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 首先尝试使用后端API
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skill: customSkill,
            user: {
              gender: selectedUser.gender,
              age: selectedUser.age,
              skinType: selectedUser.skinType,
              isMember: selectedUser.isMember,
              userCategory: selectedUser.userCategory,
              upliftType: selectedUser.upliftType,
              ite: selectedUser.ite,
              preferredSeries: selectedUser.preferredSeries
            }
          })
        });

        const data = await res.json();
        console.log('后端API响应:', data);
        
        if (data.success) {
          setGeneratedMessage(data.message);
          setStrategy(data.strategy);
          return;
        }
      } catch (backendError) {
        console.error('后端API调用失败，尝试使用前端直接调用:', backendError);
      }

      // 后端API失败时，使用前端直接调用作为fallback
      console.log('使用前端直接调用作为fallback');
      const API_KEY = "9cc65851-cf9c-4966-81d0-bc016bb4c6a4";
      const API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses";
      const MODEL_ID = "doubao-seed-2-0-pro-260215";

      const prompt = `
你是珀莱雅智能营销AI助手。
根据用户的全维度标签，分析用户特征并生成完整的营销策略建议和个性化私信文案。

用户全维度标签：
性别：${selectedUser.gender}
年龄：${selectedUser.age}岁
肤质：${selectedUser.skinType}
会员状态：${selectedUser.isMember ? '会员' : '非会员'}
RFM分层：${selectedUser.userCategory}
Uplift类型：${selectedUser.upliftType === 'sensitive' ? '敏感型' : selectedUser.upliftType === 'natural' ? '自然转化型' : selectedUser.upliftType === 'adverse' ? '反作用型' : '沉睡型'}
ITE值：${selectedUser.ite > 0 ? '+' : ''}${selectedUser.ite}
偏好系列：${selectedUser.preferredSeries.join(', ')}
${customSkill ? `自定义Skill：${customSkill}` : ''}

请根据以上信息，完成以下分析：
1. 是否建议触达该用户？
2. 推荐什么产品系列？
3. 使用什么优惠策略？
4. 使用什么语气？
5. 消息重点是什么？
6. 推荐理由是什么？
7. 生成符合该用户特征的个性化私信文案

请严格按照以下JSON格式返回结果，不要添加任何额外的解释或说明：
{
  "strategy": {
    "shouldContact": true,
    "recommendedSeries": "推荐的产品系列",
    "discountStrategy": "优惠策略",
    "tone": "建议的语气",
    "messageFocus": ["消息重点1", "消息重点2", "消息重点3"],
    "reason": "推荐理由"
  },
  "message": "个性化私信文案"
}
`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_ID,
          input: [
            {
              role: "user",
              content: [{ type: "input_text", text: prompt }]
            }
          ]
        })
      });

      const data = await res.json();
      console.log('前端直接调用响应:', data);
      
      // 检查API响应状态
      if (!res.ok) {
        throw new Error(`API请求失败: ${res.status} ${res.statusText}`);
      }
      
      // 尝试不同的响应结构
      let aiResponse = '';
      
      // 豆包AI的实际结构: data.output[1].content[0].text (type: "message")
      if (data.output && data.output[1] && data.output[1].content && data.output[1].content[0] && data.output[1].content[0].text) {
        aiResponse = data.output[1].content[0].text;
      }
      // 尝试第一种结构: data.output[0].content[0].text
      else if (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) {
        aiResponse = data.output[0].content[0].text;
      }
      // 尝试第二种结构: data.choices[0].message.content
      else if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        aiResponse = data.choices[0].message.content;
      }
      // 尝试第三种结构: data.result
      else if (data.result) {
        aiResponse = data.result;
      }
      // 尝试第四种结构: data.data
      else if (data.data) {
        aiResponse = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
      }
      else {
        throw new Error(`API返回结果格式错误，无法识别的响应结构`);
      }
      
      console.log('AI返回文本:', aiResponse);

      try {
        // 解析AI返回的JSON结果
        const result = JSON.parse(aiResponse);
        
        if (!result.strategy || !result.message) {
          throw new Error('AI返回JSON格式错误，缺少strategy或message字段');
        }
        
        setGeneratedMessage(result.message);
        setStrategy(result.strategy);
      } catch (parseError) {
        console.error('解析AI返回结果失败:', parseError);
        throw new Error(`解析AI返回结果失败: ${parseError.message}`);
      }
    } catch (err) {
      console.error('生成文案失败:', err);
      const errorMsg = err.message || '未知错误';
      setGeneratedMessage(`AI调用失败: ${errorMsg}`);
      setStrategy({
        shouldContact: false,
        recommendedSeries: '无',
        discountStrategy: '无',
        tone: '无',
        messageFocus: ['无'],
        reason: `⚠️ AI调用失败: ${errorMsg}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">智能私信助手</h2>
        <p className="text-gray-500">基于用户标签自动生成个性化营销策略与私信文案</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：用户选择 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-rose-500" />
              选择目标用户
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={selectedUser.id} 
              onValueChange={(id) => setSelectedUser(messageUsers.find(u => u.id === id) || messageUsers[0])}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择用户" />
              </SelectTrigger>
              <SelectContent>
                {messageUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.id} - {user.skinType} - {user.userCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedUser && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">用户ID</span>
                  <span className="font-medium">{selectedUser.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">基本信息</span>
                  <span className="text-sm">{selectedUser.gender}, {selectedUser.age}岁</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">肤质</span>
                  <Badge variant="secondary">{selectedUser.skinType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">会员状态</span>
                  <Badge className={selectedUser.isMember ? 'bg-rose-100 text-rose-700' : ''}>
                    {selectedUser.isMember ? '会员' : '非会员'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">RFM分类</span>
                  <Badge variant="outline" className="text-xs">{selectedUser.userCategory}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Uplift类型</span>
                  <Badge 
                    className={
                      selectedUser.upliftType === 'sensitive' ? 'bg-rose-100 text-rose-700' :
                      selectedUser.upliftType === 'natural' ? 'bg-emerald-100 text-emerald-700' :
                      selectedUser.upliftType === 'adverse' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  >
                    {selectedUser.upliftType === 'sensitive' ? '敏感型' :
                     selectedUser.upliftType === 'natural' ? '自然转化型' :
                     selectedUser.upliftType === 'adverse' ? '反作用型' : '沉睡型'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ITE值</span>
                  <span className={`font-medium ${selectedUser.ite > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedUser.ite > 0 ? '+' : ''}{selectedUser.ite}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">偏好系列</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedUser.preferredSeries.map((s: string) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 右侧：策略生成 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              智能策略生成
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 自定义营销Skill */}
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">自定义营销Skill</label>
                <p className="text-sm text-gray-500 mb-2">输入自定义营销Skill（如：直播口播/朋友圈文案/短信营销/温柔关怀/促销转化）</p>
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="输入自定义营销Skill..."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div className="w-full lg:w-auto flex items-end">
                <Button 
                  onClick={handleGenerate}
                  className="w-full lg:w-40 bg-gradient-to-r from-rose-400 to-purple-400 hover:from-rose-500 hover:to-purple-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      一键生成文案
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 策略卡片 */}
            {strategy && (
              <Card className="border-rose-200 bg-rose-50/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    推荐策略
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">是否建议触达:</span>
                      <span className={`ml-2 font-medium ${strategy.shouldContact ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {strategy.shouldContact ? '是' : '否'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">推荐产品系列:</span>
                      <span className="ml-2 font-medium">{strategy.recommendedSeries || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">优惠策略:</span>
                      <span className="ml-2 font-medium">{strategy.discountStrategy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">建议语气:</span>
                      <span className="ml-2 font-medium">{strategy.tone}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-rose-200">
                    <span className="text-gray-500 text-sm">推荐理由:</span>
                    <p className="text-sm text-gray-700 mt-1">{strategy.reason}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 生成的文案 */}
            {generatedMessage && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">生成文案</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="text-gray-500"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1">{copied ? '已复制' : '复制'}</span>
                  </Button>
                </div>
                <Textarea 
                  value={generatedMessage}
                  readOnly
                  className="min-h-[200px] bg-gray-50 resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
}
