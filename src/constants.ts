import { SiteContent } from './types';

export const CONTENT: SiteContent = {
  name: {
    zh: "孙卓群",
    en: "Scott Sun"
  },
  bio: {
    zh: "CFA, FRM",
    en: "CFA, FRM"
  },
  categories: [
    {
      id: "dev",
      title: { zh: "独立开发者", en: "Independent Developer" },
      icon: "🛠️",
      items: [
         {
          title: { zh: "个人网站", en: "Personal Website" },
          description: { 
            zh: "基于 React, Vite 和 Tailwind CSS 构建的个人网站", 
            en: "Personal website built with React, Vite, and Tailwind CSS." 
          },
          link: "/"
        },
        {
          title: { zh: "圣诞树", en: "Christmas Tree" },
          description: { 
            zh: "一个精美的交互式 3D 圣诞树项目", 
            en: "A beautiful interactive 3D Christmas tree project." 
          },
          link: "https://tree.blackboxo.top/"
        }
       
      ]
    },
    {
      id: "data",
      title: { zh: "数据科学家", en: "Data Scientist" },
      icon: "📊",
      items: [
        {
          title: { zh: "数据科学与数据分析", en: "Data Science & Analysis" },
          description: { 
            zh: "数据科学与数据分析作品集", 
            en: "Data Science and Data Analysis portfolio." 
          },
          link: "https://docs.qq.com/doc/DTFV2UGNIdk5zSG1x?no_promotion=1"
        },
        {
          title: { zh: "数学建模", en: "Mathematical Modeling" },
          description: { 
            zh: "数学建模项目与研究", 
            en: "Mathematical Modeling projects and research." 
          },
          link: "https://docs.qq.com/doc/DTHdiQ2tiSHJwR25a"
        },
        {
          title: { zh: "大学数学及数学竞赛", en: "University Math & Competitions" },
          description: { 
            zh: "高等数学，高等代数，概率论与数理统计", 
            en: "Advanced Mathematics, Advanced Algebra, Probability and Mathematical Statistics" 
          },
          link: "https://docs.qq.com/doc/DTGFuZ2FheWNKbVh2"
        }
      ]
    },
    {
      id: "finance",
      title: { zh: "金融研究员", en: "Financial Researcher" },
      icon: "📈",
      items: [
        {
          title: { zh: "CFA", en: "CFA" },
          description: { 
            zh: "特许金融分析师持证人", 
            en: "Chartered Financial Analyst charterholder." 
          },
          link: "https://docs.qq.com/doc/DTHZIWkVBa1RUT2Rx"
        },
        {
          title: { zh: "FRM", en: "FRM" },
          description: { 
            zh: "金融风险管理师持证人", 
            en: "Financial Risk Manager charterholder." 
          },
          link: "https://docs.qq.com/doc/DTFRCRmhzUVJtWnRK"
        },
                {
          title: { zh: "经济学", en: "Economics" },
          description: { 
            zh: "经济学研究与分析", 
            en: "Economics research and analysis." 
          },
          link: "https://docs.qq.com/doc/DTE5YZUVrSXpOS3RT"
        }
      ]
    },
    {
      id: "hobbies",
      title: { zh: "爱好与特长", en: "Hobbies & Skills" },
      icon: "🌟",
      items: [
        {
          title: { zh: "国际象棋", en: "Chess" },
          description: { 
            zh: "上海棋协大师，全国一级棋士", 
            en: "Shanghai Chess Association Master, National First-Class Player." 
          },
          // link: ""
        },
        {
          title: { zh: "算命", en: "Fortune-telling" },
          description: { 
            zh: "略懂手相和风水", 
            en: "Basic knowledge of palmistry and Feng Shui." 
          },
          // link: ""
        },
        {
          title: { zh: "语言", en: "Language" },
          description: { 
            zh: "英语可作为工作语言，野生英文导游，托福(104/120)，日语(N5)，韩语(T1)", 
            en: "English: working proficiency, freelance English tour guide, TOEFL 104/120; Japanese(N5); Korean(T1)." 
          },
          link: "https://docs.qq.com/doc/DTHppWVJIWFRPRHV0"
        }
      ]
    }
  ]
};
