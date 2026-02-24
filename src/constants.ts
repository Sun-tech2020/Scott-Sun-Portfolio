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
          title: "圣诞树",
          description: "A beautiful interactive 3D Christmas tree project.",
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
          title: "数据科学与数据分析",
          description: "Data Science and Data Analysis portfolio.",
          link: "https://docs.qq.com/doc/DTFV2UGNIdk5zSG1x?no_promotion=1"
        },
        {
          title: "数学建模",
          description: "Mathematical Modeling projects and research.",
          link: "https://docs.qq.com/doc/DTHdiQ2tiSHJwR25a"
        },
        {
          title: "大学数学及数学竞赛",
          description: "University Mathematics and Competition achievements.",
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
          title: "经济学",
          description: "Economics research and analysis.",
          link: "https://docs.qq.com/doc/DTE5YZUVrSXpOS3RT"
        },
        {
          title: "CFA",
          description: "Chartered Financial Analyst program progress and notes.",
          link: "https://docs.qq.com/doc/DTHZIWkVBa1RUT2Rx"
        },
        {
          title: "FRM",
          description: "Financial Risk Manager certification materials.",
          link: "https://docs.qq.com/doc/DTFRCRmhzUVJtWnRK"
        }
      ]
    },
    {
      id: "hobbies",
      title: { zh: "爱好与特长", en: "Hobbies & Skills" },
      icon: "🌟",
      items: [
        {
          title: "国际象棋",
          description: "上海棋协大师，全国一级棋士",
          // link: ""
        },
        {
          title: "英语",
          description: "TOEFL 104/120, working proficiency.",
          link: "https://docs.qq.com/doc/DTHppWVJIWFRPRHV0"
        },
        {
          title: "日语",
          description: "TOPIK N5 certified.",
          // link: ""
        },
        {
          title: "韩语",
          description: "TOPIK T1 certified.",
          // link: ""
        }
      ]
    }
  ]
};
