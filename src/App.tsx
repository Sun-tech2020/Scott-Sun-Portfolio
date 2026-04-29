import { useState, useEffect, useRef, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Instagram, Github, Linkedin, Mail, Search, ArrowLeft } from 'lucide-react';
import { CONTENT } from './constants';
import { Language, Theme } from './types';
import { createClient } from '@supabase/supabase-js';

// =================================================================
// 🟢 1. 初始化 Supabase 客户端 (我们会在下一步教你怎么获取这两个值)
// =================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const diamondImg = "https://bmdgcropuyywoyrvaijs.supabase.co/storage/v1/object/public/avatars/diamond.mp4"; 
const rubyImg = "https://bmdgcropuyywoyrvaijs.supabase.co/storage/v1/object/public/avatars/ruby1.mp4";
const diamondPoster = "https://bmdgcropuyywoyrvaijs.supabase.co/storage/v1/object/public/avatars/diamond.png";
const rubyPoster = "https://bmdgcropuyywoyrvaijs.supabase.co/storage/v1/object/public/avatars/ruby1.png";

// 🟢 针对移动端优化的视频组件 (Senior Expert Version - Unified Aspect Ratio)
const VideoAvatar = ({ src, poster }: { src: string, poster: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 0. 重置状态
    setIsReady(false);

    // 强制静音和内联播放属性，确保移动端合规
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const attemptPlay = () => {
      // 1. Load First: 强制唤醒媒体引擎
      video.load(); 
      
      // 2. Timeout Retry: 避开首屏 JS 任务高峰 (100ms & 300ms)
      const t1 = setTimeout(() => {
        video.play().catch(() => {});
      }, 100);

      const t2 = setTimeout(() => {
        video.play().catch(() => {});
      }, 300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    const cleanup = attemptPlay();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      cleanup?.();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [src]);

  return (
    <div className="w-full h-full relative bg-white">
      {/* 
        海报层：由于源文件已经是 1:1，我们不再需要 object-fit 覆盖。
        它将完美填满容器，并在视频播放后平滑淡出。
      */}
      <img 
        src={poster} 
        alt="" 
        className={`absolute inset-0 w-full h-full block transition-opacity duration-500 z-0 ${isReady ? 'opacity-0' : 'opacity-100'}`}
      />
      {/* 
        视频层：保持样式干净。
        依靠 onPlaying 事件触发 isReady，实现从海报到视频的丝滑切换。
      */}
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        onPlaying={() => setIsReady(true)}
        className={`w-full h-full block relative z-10 transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const Layout = ({ children, theme, setTheme, lang, setLang }: { 
  children: ReactNode, 
  theme: Theme, 
  setTheme: (t: Theme) => void, 
  lang: Language, 
  setLang: (l: Language) => void 
}) => {
  const [stats, setStats] = useState<{ visitors: number, views: number }>({ visitors: 0, views: 0 });

  // 🟢 预加载优化：同时预加载视频和海报图
  useEffect(() => {
    const preloadMedia = (url: string, type: 'video' | 'image') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = type;
      link.href = url;
      document.head.appendChild(link);
    };
    
    preloadMedia(diamondImg, 'video');
    preloadMedia(rubyImg, 'video');
    preloadMedia(diamondPoster, 'image');
    preloadMedia(rubyPoster, 'image');
  }, []);

  // useEffect(() => {
  //   const updateAndFetchStats = async () => {
  //     if (supabaseUrl.includes('placeholder')) return;

  //     try {
  //       const isNewVisitor = !localStorage.getItem('visited_scotts_blog');

  //       const { data, error } = await supabase.rpc('increment_page_stats', {
  //         is_new_visitor: isNewVisitor
  //       });

  //       if (error) throw error;

  //       if (data) {
  //         // 🟢 修复这里的核心逻辑：处理 Supabase 返回的数组结构
  //         const result = Array.isArray(data) ? data[0] : data;
  //         if (result) {
  //           setStats({ visitors: result.visitors, views: result.views });
  //         }
  //       }

  //       if (isNewVisitor) {
  //         localStorage.setItem('visited_scotts_blog', 'true');
  //       }
  //     } catch (error) {
  //       console.error('Failed to connect to Supabase stats:', error);
  //     }
  //   };

  //   updateAndFetchStats();
  // }, []);

useEffect(() => {
    const updateAndFetchStats = async () => {
      if (supabaseUrl.includes('placeholder')) return;

      try {
        const USE_EVENT_LOG_MODEL = true; 

        let userUuid = localStorage.getItem('scotts_blog_user_uuid');
        if (!userUuid) {
          userUuid = crypto.randomUUID(); 
          localStorage.setItem('scotts_blog_user_uuid', userUuid);
        }
        const isNewVisitor = !localStorage.getItem('visited_scotts_blog');

        if (USE_EVENT_LOG_MODEL) {
          // A 作为主力：发请求并等待结果用来展示
          const { data, error } = await supabase.rpc('log_page_view', { p_user_uuid: userUuid });
          
          // 🟢 修复核心：改用 .then()，既能拦截错误，又能真正并行触发方案 B 的请求
          supabase.rpc('increment_page_stats', { is_new_visitor: isNewVisitor }).then(({ error }) => {
            if (error) console.error('Shadow request error B:', error);
          });

          if (!error && data) {
            const result = Array.isArray(data) ? data[0] : data;
            if (result) setStats({ visitors: result.visitors, views: result.views });
          }
        } else {
          // B 作为主力：发请求并极速返回结果用来展示
          const { data, error } = await supabase.rpc('increment_page_stats', { is_new_visitor: isNewVisitor });
          
          // 🟢 修复核心：同上，并行触发方案 A 的请求
          supabase.rpc('log_page_view', { p_user_uuid: userUuid }).then(({ error }) => {
             if (error) console.error('Shadow request error A:', error);
          });

          if (!error && data) {
            const result = Array.isArray(data) ? data[0] : data;
            if (result) setStats({ visitors: result.visitors, views: result.views });
          }
        }

        if (isNewVisitor) {
          localStorage.setItem('visited_scotts_blog', 'true');
        }

      } catch (error) {
        console.error('Failed to connect to Supabase stats:', error);
      }
    };

    updateAndFetchStats();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f5] text-black'}`}>
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold hover:opacity-70 transition-opacity">Home</Link>
          <div className="flex items-center gap-2 text-sm opacity-60">
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
            >
              {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span>|</span>
            <button 
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="hover:opacity-100 transition-opacity"
            >
              {lang === 'zh' ? '中文🇨🇳' : 'English🇺🇸'}
            </button>
          </div>
        </div>
      </header>
      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        {children}
      </main>

      {/* ================================================================= */}
      {/* 🟢 3. 按照你截图的样式更新的底部 Footer */}
      {/* ================================================================= */}
      <footer className="p-8 text-center text-[12px] opacity-60 font-mono flex items-center justify-center gap-2 flex-wrap">
        <span>© {new Date().getFullYear()} </span>
        <span className="underline decoration-white/20 underline-offset-4">Scott's Blog</span>
        <span className="opacity-50">|</span>
        <span>
          Visitors: {stats.visitors > 0 ? stats.visitors.toLocaleString() : '...'}
        </span>
        <span>
          Views: {stats.views > 0 ? stats.views.toLocaleString() : '...'}
        </span>
      </footer>
    </div>
  );
};

const HomePage = ({ lang, theme }: { lang: Language, theme: Theme }) => {
  const [copyStatus, setCopyStatus] = useState<{ text: string, type: 'email' | 'wechat' } | null>(null);
  const email = "sunzhuoqun@sina.com";
  const wechat = "y8kVX6D5szq";
  
  const avatarUrl = lang === 'zh' ? diamondImg : rubyImg;
  const avatarPoster = lang === 'zh' ? diamondPoster : rubyPoster;

  const handleCopy = (text: string, type: 'email' | 'wechat') => {
    navigator.clipboard.writeText(text);
    setCopyStatus({ text, type });
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="relative mb-8">
        <div className="avatar-container w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-white flex items-center justify-center">
          <VideoAvatar src={avatarUrl} poster={avatarPoster} />
        </div>
        <div className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-2 py-1 rounded-full border border-black/10 font-bold rotate-12">
          ok, fine
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2 tracking-tight">{CONTENT.name[lang]}</h1>
      <p className="text-lg opacity-60 mb-6 font-medium">{CONTENT.bio[lang]}</p>

      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="flex gap-4 opacity-70">
          <button 
            onClick={() => handleCopy(wechat, 'wechat')}
            className="hover:scale-110 transition-transform cursor-pointer outline-none"
            title={wechat}
          >
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5" 
              fill="currentColor" // 微信绿通常用 #07C160，或者随系统 currentColor
            >
              <path d="M8.288 3.5c-3.834 0-6.938 2.652-6.938 5.923 0 1.828.966 3.463 2.476 4.567l-.63 2.308 2.7-.1.455.289c.58.369 1.25.576 1.937.576.438 0 .866-.084 1.267-.246-.4-.84-.627-1.758-.627-2.73 0-3.33 3.033-6.033 6.772-6.033.284 0 .564.015.84.045C15.656 5.485 12.305 3.5 8.288 3.5zm9.034 5.308c-3.15 0-5.703 2.222-5.703 4.962 0 2.739 2.553 4.962 5.703 4.962.565 0 1.11-.072 1.62-.21l1.65.918-.415-1.517c.92-.816 1.498-1.97 1.498-3.243 0-2.74-2.553-4.962-5.703-4.962z"/>
            </svg>
          </button>
          <a href="https://www.instagram.com/syy_szq/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Instagram size={20} /></a>
          <a href="https://github.com/Sun-tech" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Github size={20} /></a>
          <a href="https://www.linkedin.com/in/scott-sun-bb56b1224/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Linkedin size={20} /></a>
          <button 
            onClick={() => handleCopy(email, 'email')}
            className="hover:scale-110 transition-transform cursor-pointer outline-none"
            title={email}
          >
            <Mail size={20} />
          </button>
        </div>
        
        <AnimatePresence>
          {copyStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[10px] font-mono opacity-50 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full"
            >
              {copyStatus.text} {lang === 'zh' ? '已复制' : 'Copied'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
        {CONTENT.categories.map((cat) => (
          <Link 
            key={cat.id}
            to={`/category/${cat.id}`}
            className="px-6 py-3 bg-black/5 dark:bg-[#333333] hover:bg-black/10 dark:hover:bg-[#444444] rounded-xl transition-all text-sm font-medium border border-transparent hover:border-black/10 dark:hover:border-white/10 min-w-[120px] text-center"
          >
            {cat.title[lang]}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

const CategoryPage = ({ lang, theme }: { lang: Language, theme: Theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = CONTENT.categories.find(c => c.id === id);

  if (!category) return <div>Category not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 mb-8 transition-opacity"
      >
        <ArrowLeft size={16} /> {lang === 'zh' ? '返回' : 'Back'}
      </button>

      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-5xl font-bold tracking-tighter">{category.title[lang]}</h2>
        <span className="text-4xl">{category.icon}</span>
      </div>

      <div className="space-y-4">
        {category.items.map((item, idx) => {
          const content = (
            <>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{item.title[lang]}</h3>
              </div>
              <p className="text-sm opacity-60 leading-relaxed">{item.description[lang]}</p>
            </>
          );
          
          const className = `block p-6 rounded-2xl border transition-all ${
            theme === 'dark' 
              ? 'bg-[#262626] border-white/5 hover:bg-[#333333]' 
              : 'bg-white border-black/5 hover:shadow-lg shadow-sm'
          } ${item.link ? 'cursor-pointer' : 'cursor-default'}`;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {item.link ? (
                item.link.startsWith('/') ? (
                  <Link to={item.link} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
                    {content}
                  </a>
                )
              ) : (
                <div className={className}>
                  {content}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Language>('zh');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <Layout theme={theme} setTheme={setTheme} lang={lang} setLang={setLang}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage lang={lang} theme={theme} />} />
            <Route path="/category/:id" element={<CategoryPage lang={lang} theme={theme} />} />
            <Route path="*" element={<div className="text-center py-20 opacity-50">Coming Soon...</div>} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}