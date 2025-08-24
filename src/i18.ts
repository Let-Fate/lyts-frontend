import i18n  from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          assistants: {
            meihua: "People in the heart of the warp, Plum Blossom I-Count can give you inspiration \n specializing in Plum Blossom I-Count to determine the trigrams \n",
            tarot_common: "I will draw tarot cards for you and guide you through the stars when you are confused. \n specializing in common tarot card analysis \n",
            bazi_solve: "What is destined to happen, must it happen? I'll tell you with eight characters \n good at eight character analysis\n",
            xiaoliuren_solve: "The way of Xiaoliuren, simple but insightful \n good at Xiaoliuren analysis\n",
            tarot_select: "Tell me the tarot cards you have chosen, and I will guide you in the right direction \n good at advanced tarot card analysis\n",
            liuyao_solve: "The omen is in motion, and I never disperse \n good at six yao array\n",
          },
          names: {
            meihua: "Meihua",
            tarot_common: "Tarot Common",
            bazi_solve: "Bazi",
            xiaoliuren_solve: "Xiaoliuren",
            tarot_select: "Tarot Select",
            liuyao_solve: "Liuyao",
          },
          info: {
            coin: "Coin",
            original: "original price",
            current: "current price",
          },
          website: {
            intelligent: {
              title: "Intelligent",
              subTitle: "Adjusted for big data, it has strong metaphysical literacy.",
            },
            mindset: {
              title: "Mindset",
              subTitle: "Ability to think flexibly and not be influenced by emotions"
            },
            knowledge: {
              title: "Knowledge",
              subTitle: "With a huge database, I don't lack knowledge"
            },
            sympathy: {
              title: 'Sympathy',
              subTitle: "Understands your pain and will take care of your emotions"
            }
          }
        }
      },
      zh: {
        translation: {
          assistants: {
            meihua: "人于心上起经纶,梅花易数可以给你启示\n擅长梅花易数断卦\n",
            tarot_common: "我会为你抽塔罗牌，为迷惘的你指引星光。\n擅长普通塔罗牌解析\n",
            bazi_solve: "命中注定的事，一定会发生吗？我用八字告诉你\n擅长八字解析\n",
            xiaoliuren_solve: "小六壬之道，虽简却能洞察天机\n擅长小六壬解盘\n",
            tarot_select: "把你选择好的塔罗牌告诉我，我将为你指引方向\n擅长高阶塔罗牌解析\n",
            liuyao_solve: "神兆机于动，余从来不言散\n擅长六爻排盘\n",
          },
          names: {
            meihua: "天凤",
            tarot_common: "月瑶",
            bazi_solve: "溯明",
            xiaoliuren_solve: "肖琉",
            tarot_select: "灵星",
            liuyao_solve: "柳摇",
          },
          info: {
            coin: "虚拟币",
            original: "原价",
            current: "现价",
          },
          website: {
            intelligent: {
              title: "智能",
              subTitle: "经过大数据调整,拥有强大的玄学素养.",
            },
            mindset: {
              title: "思维",
              subTitle: "具有灵活的思维能力，不受情绪影响"
            },
            knowledge: {
              title: "知识",
              subTitle: "拥有巨大的数据库，我不缺乏知识"
            },
            sympathy: {
              title: '同情',
              subTitle: "懂得你的苦楚，会照顾好你的情绪"
            }
          }
        }
      },
    }
  });

export default i18n;