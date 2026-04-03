// 豆包AI API服务

// 豆包AI API配置
const DOUBAO_API_KEY = 'YOUR_DOBAO_API_KEY'; // 请替换为真实的API密钥
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 用户标签接口
export interface UserTags {
  id: string;
  gender: string;
  age: number;
  skinType: string;
  isMember: boolean;
  userCategory: string;
  upliftType: string;
  ite: number;
  preferredSeries: string[];
}

// 策略建议接口
export interface StrategySuggestion {
  shouldContact: boolean;
  recommendedSeries: string;
  discountStrategy: string;
  tone: string;
  messageFocus: string[];
  reason: string;
}

// 生成个性化文案
export async function generateAIContent(user: UserTags, style: 'gentle' | 'promotional' | 'vip'): Promise<{ strategy: StrategySuggestion; message: string }> {
  try {
    // 构建用户标签描述
    const userTagsDescription = `
    用户ID: ${user.id}
    基本信息: ${user.gender}, ${user.age}岁
    肤质: ${user.skinType}
    会员状态: ${user.isMember ? '会员' : '非会员'}
    RFM分类: ${user.userCategory}
    Uplift类型: ${user.upliftType === 'sensitive' ? '敏感型' : user.upliftType === 'natural' ? '自然转化型' : user.upliftType === 'adverse' ? '反作用型' : '沉睡型'}
    ITE值: ${user.ite > 0 ? '+' : ''}${user.ite}
    偏好系列: ${user.preferredSeries.join(', ')}
    `;

    // 构建文案风格描述
    const styleDescription = {
      gentle: '温和关怀版，语气亲切，注重情感交流',
      promotional: '促销转化版，强调优惠信息，促进立即购买',
      vip: '会员专属版，突出尊贵感和专属权益'
    }[style];

    // 构建请求体
    const requestBody = {
      model: 'ep-20260403163853-6w5hn', // 豆包AI模型，根据实际情况替换
      messages: [
        {
          role: 'system',
          content: `你是一个专业的护肤品营销顾问，负责根据用户标签为珀莱雅品牌生成个性化的营销策略和私信文案。
          
          请根据用户的标签信息，提供以下内容：
          1. 营销策略建议，包括：
             - 是否建议触达该用户
             - 推荐的产品系列
             - 优惠策略
             - 建议的语气
             - 消息重点
             - 推荐理由
          
          2. 个性化私信文案，根据指定的风格生成，包括：
             - 问候语
             - 基于肤质的个性化开场白
             - 推荐的产品系列及功效
             - 优惠信息
             - 结束语
          
          请以JSON格式返回结果，包含strategy和message两个字段。`
        },
        {
          role: 'user',
          content: `用户标签信息：${userTagsDescription}
          文案风格：${styleDescription}
          请生成营销策略建议和个性化私信文案。`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    // 发送API请求
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // 解析AI返回的JSON结果
    const result = JSON.parse(aiResponse);
    return result;
  } catch (error) {
    console.error('豆包AI API调用失败:', error);
    // 失败时返回默认策略和文案
    return {
      strategy: {
        shouldContact: user.upliftType !== 'adverse',
        recommendedSeries: '源力系列',
        discountStrategy: user.upliftType === 'sensitive' ? '满200减30' : '内容种草，弱化优惠',
        tone: user.userCategory === '核心价值用户' ? '尊享专属' : '亲切关怀',
        messageFocus: user.upliftType === 'sensitive' ? ['限时优惠', '专属福利', '立即行动'] : ['产品功效', '成分科普', '会员权益'],
        reason: `AI调用失败，使用默认策略。用户属于${user.upliftType === 'sensitive' ? '敏感型' : '自然转化型'}，肤质为${user.skinType}`
      },
      message: `亲爱的用户，

感谢您一直以来对珀莱雅的支持。我们为您精选了源力系列，修护屏障，舒缓敏感。

期待为您带来更好的护肤体验。`
    };
  }
}
