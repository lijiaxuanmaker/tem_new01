const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');

// 加载环境变量
function loadEnv() {
  try {
    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = output.trim().split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) continue;
      const eqIndex = line.indexOf('=');
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        process.env[key] = value;
      }
    }
  } catch (e) {
    console.error('加载环境变量失败:', e.message);
  }
}

loadEnv();

const supabaseUrl = process.env.COZE_SUPABASE_URL;
const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('请配置 COZE_SUPABASE_URL 和 COZE_SUPABASE_ANON_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertQuestion() {
  const questionData = {
    title: '血源性肺脓肿案例 - 万古霉素TDM',
    content: `患者王××，男，26岁，农民，体重111 kg

【诊断】
1.血源性肺脓肿（金黄色葡萄球菌感染）
2.左侧臀部脓肿（已切开引流）

【案例情景】
患者来药学门诊咨询："医生您好，我因为肺脓肿住院治疗，刚出院，现在需要继续用万古霉素。我想问问这个药有什么需要注意的？听说要抽血测浓度，这是怎么回事？我应该怎么配合？"

【当前用药】
万古霉素 1g ivgtt q12h（出院带药，建议门诊继续治疗）

【现病史】
患者于2018年4月1日突发左侧胸痛，伴发热、咳嗽、咳暗黑色痰。入院前有左臀部脓肿。4月4日入院，胸部CT示双肺多发结节，部分空洞样改变，考虑血源性肺脓肿。初始抗感染方案为头孢哌酮/舒巴坦3g q12h + 左氧氟沙星0.4g qd + 氟康唑0.2g qd。4月6日G试验、GM试验阴性，停用氟康唑。4月8日臀部脓液培养回报：金黄色葡萄球菌（MSSA），对万古霉素敏感。4月13日换用万古霉素1g q12h。经治疗好转，于4月18日出院。

请回答以下问题：
1. 如何评估该患者的病情与诊断？
2. 初始抗感染方案是否合理？
3. 抗感染方案调整是否恰当？
4. 如何制定万古霉素TDM计划？
5. 如何进行用药教育与不良反应监护？
6. 随访方案应如何制定？`,
    correct_answer: `【病情评估与诊断分析】
患者青年男性，肥胖，有左臀部皮肤软组织感染史，随后出现发热、胸痛、咳嗽、咳暗黑色痰，胸部CT示双肺多发结节伴空洞，符合血源性肺脓肿的典型表现。

【初始抗感染方案评价】
初始方案选用头孢哌酮/舒巴坦联合左氧氟沙星及氟康唑，属于广覆盖经验性治疗，合理且必要。

【万古霉素TDM计划】
推荐在第4-5剂给药前监测谷浓度，目标10-20 mg/L。应教育患者按时采血，并告知需监测肾功能、听力。`,
    scoring_criteria: `【评分标准】
总分100分：
一、服务流程（20分）
二、专业能力（60分）：病情评估(8分)、方案评价(8分)、方案调整(8分)、TDM(20分)、用药教育(8分)、随访方案(8分)
三、沟通和人文（20分）`,
    difficulty: 3,
  };

  const { data, error } = await supabase
    .from('questions')
    .insert(questionData)
    .select()
    .single();

  if (error) {
    console.error('插入题目失败:', error);
    process.exit(1);
  }

  console.log('题目插入成功:', JSON.stringify(data, null, 2));
}

insertQuestion();
