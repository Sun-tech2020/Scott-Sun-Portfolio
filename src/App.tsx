import { useState, useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Instagram, Github, Linkedin, Mail, Search, ArrowLeft } from 'lucide-react';
import { CONTENT } from './constants';
import { Language, Theme } from './types';

// 修改为严格的相对路径
// const diamondImg = "./diamond.png";
// const rubyImg = "./ruby.png"; 

const diamondImg = "https://i-blog.csdnimg.cn/direct/ec1cb058c19649a49e7190103bdf9cde.png";
const rubyImg = "https://i-blog.csdnimg.cn/direct/48de652213b74daea90519c42d99f99c.png"; 

const Layout = ({ children, theme, setTheme, lang, setLang }: { 
  children: ReactNode, 
  theme: Theme, 
  setTheme: (t: Theme) => void, 
  lang: Language, 
  setLang: (l: Language) => void 
}) => {
  const [stats, setStats] = useState<{ visitors: number, views: number }>({ visitors: 0, views: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isNewVisitor = !sessionStorage.getItem('visited');
        const response = await fetch('/api/stats/increment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isNewVisitor })
        });
        const data = await response.json();
        setStats(data);
        if (isNewVisitor) {
          sessionStorage.setItem('visited', 'true');
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium opacity-70">
        </nav>
      </header>
      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        {children}
      </main>
      <footer className="p-8 text-center text-[10px] opacity-40 font-mono">
        © {new Date().getFullYear()} <span>Scott's Blog</span>
      </footer>
    </div>
  );
};

const HomePage = ({ lang, theme }: { lang: Language, theme: Theme }) => {
  const [copied, setCopied] = useState(false);
  const email = "sunzhuoqun@sina.com";
  
  // 这里直接使用顶部定义好的变量
  const avatarUrl = lang === 'zh' ? diamondImg : rubyImg;

  const handleEmailClick = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
          // <motion.img
          //   key={avatarUrl}
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          //   transition={{ duration: 0.4 }}
          //   src={avatarUrl}
          //   alt="Avatar"
          //   className="w-full h-full object-cover"
          // />
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-2 -right-2 bg-white text-black text-[10px] px-2 py-1 rounded-full border border-black/10 font-bold rotate-12">
          ok, fine
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-2 tracking-tight">{CONTENT.name[lang]}</h1>
      <p className="text-lg opacity-60 mb-6 font-medium">{CONTENT.bio[lang]}</p>

      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="flex gap-4 opacity-70">
          <a href="https://www.instagram.com/syy_szq/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Instagram size={20} /></a>
          <a href="https://github.com/Sun-tech" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Github size={20} /></a>
          <a href="https://www.linkedin.com/in/scott-sun-bb56b1224/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><Linkedin size={20} /></a>
          <button 
            onClick={handleEmailClick}
            className="hover:scale-110 transition-transform cursor-pointer outline-none"
            title={email}
          >
            <Mail size={20} />
          </button>
        </div>
        
        <AnimatePresence>
          {copied && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[10px] font-mono opacity-50 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full"
            >
              {email} {lang === 'zh' ? '已复制' : 'Copied'}
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