exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { user, skill } = body;

    // 你的真实 API Key（仅在这里出现，绝对安全）
    const API_KEY = "9cc65851-cf9c-4966-81d0-bc016bb4c6a4";
    const API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses";
    const MODEL_ID = "doubao-seed-2-0-pro-260215";

    const prompt = `
你是珀莱雅智能营销AI助手。
根据用户的全维度标签，分析用户特征并生成完整的营销策略建议和个性化私信文案。

用户全维度标签：
性别：${user.gender}
年龄：${user.age}岁
肤质：${user.skinType}
会员状态：${user.isMember ? '会员' : '非会员'}
RFM分层：${user.userCategory}
Uplift类型：${user.upliftType === 'sensitive' ? '敏感型' : user.upliftType === 'natural' ? '自然转化型' : user.upliftType === 'adverse' ? '反作用型' : '沉睡型'}
ITE值：${user.ite > 0 ? '+' : ''}${user.ite}
偏好系列：${user.preferredSeries.join(', ')}
${skill ? `自定义Skill：${skill}` : ''}

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

    const resp = await fetch(API_URL, {
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

    const data = await resp.json();
    
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

    try {
      // 解析AI返回的JSON结果
      const result = JSON.parse(aiResponse);
      
      if (!result.strategy || !result.message) {
        throw new Error('AI返回JSON格式错误，缺少strategy或message字段');
      }
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          success: true,
          strategy: result.strategy,
          message: result.message,
          reason: "✅ AI 调用成功，已生成个性化文案"
        })
      };
    } catch (parseError) {
      throw new Error(`解析AI返回结果失败: ${parseError.message}`);
    }
  } catch (err) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: false,
        strategy: {
          shouldContact: false,
          recommendedSeries: '无',
          discountStrategy: '无',
          tone: '无',
          messageFocus: ['无'],
          reason: `⚠️ AI调用失败: ${err.message}`
        },
        message: "AI调用失败，请稍后再试",
        reason: `⚠️ AI调用失败: ${err.message}`
      })
    };
  }
};
