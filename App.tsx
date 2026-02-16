import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Check, Archive, ArrowLeft, ChevronDown, ChevronUp, Search, X, Globe, Zap, Calendar, List, TrendingUp, Lock } from 'lucide-react';
import { STAR_DATABASE, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { Star, Task, Category, CollectedStar } from './types';
import { RewardModal } from './components/RewardModal';
import { Navigation } from './components/Navigation';
import { StartScreen } from './components/StartScreen';
import { UI_TEXT } from './textConstants';

interface CompletedTaskRecord extends Task {
  completedAt: Date;
}

const App: React.FC = () => {
  // --- Persistence Logic ---
  const loadData = <T,>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      const parsed = JSON.parse(saved);
      if (key === 'completedHistory') {
        return parsed.map((item: any) => ({
          ...item,
          completedAt: new Date(item.completedAt)
        })) as unknown as T;
      }
      return parsed as T;
    } catch (e) {
      console.error(`Failed to load ${key}`, e);
      return defaultValue;
    }
  };

  // --- States ---
  const [tasks, setTasks] = useState<Task[]>(() => loadData('tasks', [
    { id: '1', title: '部屋の掃除をする', category: 'housework', completed: false },
    { id: '2', title: '英単語を10個覚える', category: 'study', completed: false },
    { id: '3', title: '数学の課題', category: 'study', completed: false },
  ]));

  const [completedHistory, setCompletedHistory] = useState<CompletedTaskRecord[]>(() => loadData('completedHistory', []));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [categories, setCategories] = useState<Category[]>(() => loadData('categories', INITIAL_CATEGORIES));
  const [activeCategory, setActiveCategory] = useState('housework');
  const [collectedStars, setCollectedStars] = useState<CollectedStar[]>(() => loadData('collectedStars', []));
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const [isArchiveViewOpen, setIsArchiveViewOpen] = useState(false);
  const [isStatsViewOpen, setIsStatsViewOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [includeArchived] = useState(false);

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState('');

  const [isSheetMinimized, setIsSheetMinimized] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(360);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const minHeight = 180;
  const maxHeight = window.innerHeight * 0.85;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justDiscoveredStar, setJustDiscoveredStar] = useState<Star | null>(null);
  const [completedTaskTitle, setCompletedTaskTitle] = useState('');
  const [isNewDiscovery, setIsNewDiscovery] = useState(true);

  const [isStarted, setIsStarted] = useState(false);

  // --- Auto Save Effect ---
  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('collectedStars', JSON.stringify(collectedStars)); }, [collectedStars]);
  useEffect(() => { localStorage.setItem('completedHistory', JSON.stringify(completedHistory)); }, [completedHistory]);

  // --- Background Logic ---
  const bgParticles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5,
    }));
  }, []);

  const visibleCategories = categories.filter(c => !c.isArchived);
  const archivedCategories = categories.filter(c => c.isArchived);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const targetCategoryIds = includeArchived
      ? categories.map(c => c.id)
      : visibleCategories.map(c => c.id);

    return tasks.filter(task =>
      targetCategoryIds.includes(task.category) &&
      task.title.toLowerCase().includes(query)
    );
  }, [searchQuery, includeArchived, tasks, visibleCategories, categories]);

  const activeSectorStars = useMemo(() => {
    return collectedStars.filter(s => s.categoryId === activeCategory);
  }, [collectedStars, activeCategory]);

  const getTaskCount = (catId: string) => {
    return tasks.filter(t => t.category === catId && !t.completed).length;
  };

  const currentMonthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  }, [selectedDate]);

  const tasksOnSelectedDate = useMemo(() => {
    return completedHistory.filter(h =>
      h.completedAt.getDate() === selectedDate.getDate() &&
      h.completedAt.getMonth() === selectedDate.getMonth() &&
      h.completedAt.getFullYear() === selectedDate.getFullYear()
    );
  }, [completedHistory, selectedDate]);

  const monthlyCompletionCount = useMemo(() => {
    return completedHistory.filter(h =>
      h.completedAt.getMonth() === selectedDate.getMonth() &&
      h.completedAt.getFullYear() === selectedDate.getFullYear()
    ).length;
  }, [completedHistory, selectedDate]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: activeCategory,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowInput(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryLabel.trim()) return;
    const newId = `cat_${Date.now()}`;
    setCategories([...categories, { id: newId, label: newCategoryLabel, count: 0 }]);
    setNewCategoryLabel('');
    setShowCategoryInput(false);
    setActiveCategory(newId);
  };

  const handleArchiveCategory = (catId: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, isArchived: true } : c));
    if (activeCategory === catId) {
      const nextCat = categories.find(c => c.id !== catId && !c.isArchived);
      if (nextCat) setActiveCategory(nextCat.id);
    }
  };

  const handleRestoreCategory = (catId: string) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, isArchived: false } : c));
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));

    setTimeout(() => {
      const rand = Math.random() * 100;
      let selectedRarity: 'legendary' | 'rare' | 'common' = 'common';

      // 排出率調整: 星3(3%), 星2(18%), 星1(79% - ユーザー要望の78%に近い調整)
      if (rand < 3) selectedRarity = 'legendary';
      else if (rand < 21) selectedRarity = 'rare';
      else selectedRarity = 'common';

      const possibleStars = STAR_DATABASE.filter(s => s.rarity === selectedRarity);
      const discovered = possibleStars[Math.floor(Math.random() * possibleStars.length)];
      const isFirstTime = !collectedStars.some(s => s.id === discovered.id);

      setCollectedStars(prev => [...prev, { ...discovered, categoryId: task.category }]);
      setCompletedHistory(prev => [...prev, { ...task, completed: true, completedAt: new Date() }]);

      setJustDiscoveredStar(discovered);
      setCompletedTaskTitle(task.title);
      setIsNewDiscovery(isFirstTime);
      setIsModalOpen(true);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }, 600);
  };

  const handleWarpToTask = (task: Task) => {
    const category = categories.find(c => c.id === task.category);
    if (category?.isArchived) handleRestoreCategory(category.id);
    setActiveCategory(task.category);
    setIsSearchViewOpen(false);
    setSearchQuery('');
    setIsSheetMinimized(false);
    setSheetHeight(Math.max(sheetHeight, 300));
  };

  const onStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSheetMinimized) return;
    isDragging.current = true;
    setIsDraggingActive(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = sheetHeight;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = startY.current - clientY;
      const newHeight = startHeight.current + deltaY;
      if (newHeight >= minHeight && newHeight <= maxHeight) setSheetHeight(newHeight);
    };
    const onEnd = () => { isDragging.current = false; setIsDraggingActive(false); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [maxHeight]);

  const renderStarField = (stars: CollectedStar[]) => {
    return stars.map((star, index) => {
      const hash = star.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + index;
      const isMobile = window.innerWidth < 640;
      // Reduce offset on mobile to avoid overflow/off-center look, especially with larger stars
      const offsetX = isMobile ? (hash % 10) - 5 : (hash % 60) - 30;
      const offsetY = (hash % 40) - 20;
      return (
        <div
          key={`${star.id}-${index}`}
          className="flex flex-col items-center justify-center transition-all duration-1000 cursor-pointer hover:z-20 group relative"
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${0.85 + (hash % 15) * 0.01})`,
            minHeight: window.innerWidth < 640 ? '180px' : '200px'
          }}
          onClick={() => (setJustDiscoveredStar(star), setIsNewDiscovery(false), setCompletedTaskTitle(''), setIsModalOpen(true))}
        >
          <div className="relative flex flex-col items-center w-full h-full max-w-[180px] sm:max-w-[180px] aspect-square">
            <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-400/20 transition-all duration-700 scale-125"></div>
            <img
              src={star.imageUrl}
              alt={star.name}
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-[float_6s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * -1.2}s` }}
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap z-30 pointer-events-none">
              <span className="text-[8px] font-black text-white tracking-[0.1em] uppercase">{star.name}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-slate-950 overflow-hidden select-none items-center text-white">

      {!isStarted && <StartScreen onStart={() => setIsStarted(true)} />}

      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1e293b,#020617)] opacity-80"></div>
        {bgParticles.map(p => (
          <div key={p.id} className="absolute bg-white rounded-full opacity-20 animate-pulse" style={{ top: p.top, left: p.left, width: `${p.size}px`, height: `${p.size}px`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}></div>
        ))}
      </div>

      {/* ナビゲーション（上部セクター選択） */}
      <div className="fixed top-0 left-0 right-0 px-6 pt-6 z-50 flex justify-center">
        <div className="bg-slate-900 border border-white/10 rounded-full pl-2 pr-1 py-1 flex items-center gap-1 shadow-2xl max-w-[95vw] overflow-hidden">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1">
            {visibleCategories.map(cat => {
              const count = getTaskCount(cat.id);
              const isActive = activeCategory === cat.id;
              return (
                <div key={cat.id} className="relative group flex-shrink-0">
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all px-4 py-2 rounded-full border ${isActive
                      ? 'bg-white text-slate-950 border-white shadow-lg scale-105'
                      : 'text-white/40 border-transparent hover:bg-white/10'
                      }`}
                  >
                    {cat.label}
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold ${isActive ? 'bg-slate-900/10 text-slate-900' : 'bg-white/5 text-white/20'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                  {isActive && (
                    <button
                      onClick={() => handleArchiveCategory(cat.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Archive size={8} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="w-[1px] h-4 bg-white/10 mx-1 flex-shrink-0"></div>
          <button
            onClick={() => setShowCategoryInput(true)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-white/20 transition-all flex-shrink-0"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 宇宙空間 */}
      <div className="flex-1 relative w-full overflow-y-scroll overflow-x-hidden custom-scrollbar z-10 px-4 sm:px-12 flex justify-center">
        <div className="min-h-full pb-96 pt-28 sm:pt-36 w-full max-w-7xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-12 gap-x-4">
            {renderStarField(activeSectorStars)}
          </div>
        </div>
      </div>

      {/* 検索コンソール */}
      {isSearchViewOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/95 animate-fade-in flex flex-col items-center p-6 pt-24">
          <div className="w-full max-w-lg flex flex-col h-full space-y-8 animate-scale-up">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-black tracking-widest flex items-center gap-4">
                <Globe size={24} className="text-blue-400" /> {UI_TEXT.APP_TITLE_OMNI_SCANNER}
              </h2>
              <button onClick={() => setIsSearchViewOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-lg font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {searchResults.map(task => (
                <button
                  key={task.id}
                  onClick={() => handleWarpToTask(task)}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-2xl p-5 flex items-center justify-between transition-all group"
                >
                  <div className="text-left">
                    <p className="text-white font-bold group-hover:text-blue-400 transition-colors">{task.title}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">{UI_TEXT.LABEL_SECTOR} {categories.find(c => c.id === task.category)?.label}</p>
                  </div>
                  <Zap size={20} className="text-blue-400 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAR ATLAS (図鑑画面) */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950 animate-fade-in flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col h-full">
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setIsGuideOpen(false)} className="text-white flex items-center gap-4 font-black tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={18} /> {UI_TEXT.APP_TITLE_STAR_ATLAS}
              </button>
              <div className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">
                {UI_TEXT.formatCollectedCount(collectedStars.length, STAR_DATABASE.length)}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {STAR_DATABASE.map(star => {
                  const occurrences = collectedStars.filter(s => s.id === star.id);
                  const isFound = occurrences.length > 0;
                  const discoveredSectors = Array.from(new Set(occurrences.map(o => categories.find(c => c.id === o.categoryId)?.label))).filter(Boolean);

                  return (
                    <div
                      key={star.id}
                      className={`relative bg-slate-900 rounded-3xl p-6 border transition-all duration-500 flex flex-col items-center ${isFound ? 'border-white/10 hover:border-blue-500/50 cursor-pointer' : 'border-white/5 opacity-50 grayscale'}`}
                      onClick={() => isFound && (setJustDiscoveredStar(star), setIsNewDiscovery(false), setCompletedTaskTitle(''), setIsModalOpen(true))}
                    >
                      <div className="w-full aspect-square mb-6 flex items-center justify-center relative">
                        {isFound ? (
                          <>
                            <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full"></div>
                            <img src={star.imageUrl} alt={star.name} className="w-full h-full object-contain relative z-10" />
                          </>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Lock size={32} className="text-white/10" />
                          </div>
                        )}
                      </div>

                      <div className="text-center w-full">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isFound ? 'text-white' : 'text-white/20'}`}>
                          {isFound ? star.name : '???'}
                        </p>

                        {isFound ? (
                          <div className="flex flex-wrap justify-center gap-1 mt-3">
                            {discoveredSectors.map(label => (
                              <span key={label} className="text-[7px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">
                                {label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[7px] font-black uppercase tracking-widest text-white/10">{UI_TEXT.LABEL_LOCKED}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Logs (Calendar) */}
      {isStatsViewOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950 animate-fade-in flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col h-full">
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setIsStatsViewOpen(false)} className="text-white flex items-center gap-4 font-black tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={18} /> {UI_TEXT.APP_TITLE_MISSION_TERMINAL}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-10">
                  <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-blue-500" size={24} />
                        <h3 className="text-lg font-black tracking-widest uppercase">{currentMonthDays.year}.{String(currentMonthDays.month + 1).padStart(2, '0')}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedDate(new Date(currentMonthDays.year, currentMonthDays.month - 1, 1))} className="p-2 hover:bg-white/5 rounded-full"><ArrowLeft size={16} /></button>
                        <button onClick={() => setSelectedDate(new Date(currentMonthDays.year, currentMonthDays.month + 1, 1))} className="p-2 hover:bg-white/5 rounded-full transform rotate-180"><ArrowLeft size={16} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4 mb-4">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest">{d}</div>)}
                      {Array.from({ length: currentMonthDays.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                      {Array.from({ length: currentMonthDays.daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateObj = new Date(currentMonthDays.year, currentMonthDays.month, day);
                        const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonthDays.month;
                        const hasTasks = completedHistory.some(h => h.completedAt.getDate() === day && h.completedAt.getMonth() === currentMonthDays.month && h.completedAt.getFullYear() === currentMonthDays.year);
                        return (
                          <button key={day} onClick={() => setSelectedDate(dateObj)} className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-bold transition-all relative ${isSelected ? 'bg-blue-600 text-white scale-110' : 'hover:bg-white/5 text-white/60'}`}>
                            {day}{hasTasks && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{UI_TEXT.LABEL_MONTHLY_COMPLETION}</p>
                        <p className="text-3xl font-black">{monthlyCompletionCount}</p>
                      </div>
                      <TrendingUp className="text-blue-500/50" size={32} />
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{UI_TEXT.LABEL_TOTAL_COMPLETION}</p>
                        <p className="text-3xl font-black">{completedHistory.length}</p>
                      </div>
                      <Globe className="text-blue-500/50" size={32} />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 flex flex-col min-h-[400px]">
                  <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                    <List className="text-blue-500" size={20} />
                    <h3 className="text-sm font-black tracking-widest uppercase">{UI_TEXT.LABEL_LOG_PREFIX} {selectedDate.getMonth() + 1}.{selectedDate.getDate()}</h3>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                    {tasksOnSelectedDate.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-4 py-20"><Search size={40} strokeWidth={1} /><p className="text-[10px] font-black tracking-widest uppercase italic">{UI_TEXT.LABEL_NO_RECORDS}</p></div> :
                      tasksOnSelectedDate.map(h => (
                        <div key={h.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl group flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0"><Check size={16} strokeWidth={3} /></div>
                          <div><p className="text-sm font-bold text-white/90">{h.title}</p><p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1">{UI_TEXT.formatSectorLog(categories.find(c => c.id === h.category)?.label, h.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</p></div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* アーカイブ画面 */}
      {isArchiveViewOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950 animate-fade-in flex flex-col items-center">
          <div className="w-full max-w-4xl flex flex-col h-full">
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setIsArchiveViewOpen(false)} className="text-white flex items-center gap-4 font-black tracking-widest text-sm"><ArrowLeft size={18} /> {UI_TEXT.APP_TITLE_SECTORS_ARCHIVE}</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
              {archivedCategories.map(cat => (
                <div key={cat.id} className="bg-slate-900 rounded-3xl p-8 border border-white/5 flex justify-between items-center group">
                  <div><h4 className="text-white text-lg font-black tracking-widest uppercase">{cat.label}</h4><p className="text-white/30 text-[10px] mt-2 font-bold tracking-widest uppercase">{UI_TEXT.LABEL_DISCOVERED_IN_SECTOR}</p></div>
                  <button onClick={() => handleRestoreCategory(cat.id)} className="bg-white text-slate-950 px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest uppercase shadow-lg active:scale-95 transition-all">{UI_TEXT.BUTTON_RESTORE}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* タスク操作シート */}
      <div className={`fixed bottom-0 z-40 w-full max-w-2xl flex flex-col transition-transform duration-500 ease-in-out ${isSheetMinimized ? 'items-start px-8' : ''}`} style={{ height: isSheetMinimized ? '120px' : `${sheetHeight}px` }}>
        <div className={`h-full flex flex-col relative transition-all duration-500 ${isSheetMinimized ? 'bg-transparent border-none' : 'bg-slate-900 rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] w-full'}`}>

          {/* ドラッグハンドル・縮小ボタン */}
          {!isSheetMinimized ? (
            <div className="w-full h-12 flex items-center justify-between px-10 cursor-ns-resize flex-shrink-0 touch-none" onMouseDown={onStartDrag} onTouchStart={onStartDrag}>
              <div className="w-8"></div>
              <div className={`w-16 h-1.5 rounded-full ${isDraggingActive ? 'bg-blue-500' : 'bg-white/20'}`}></div>
              <button onClick={() => setIsSheetMinimized(true)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors pointer-events-auto">
                <ChevronDown size={18} className="text-white/40" />
              </button>
            </div>
          ) : (
            <div className="absolute -top-10 left-10">
              <button onClick={() => setIsSheetMinimized(false)} className="bg-slate-900 border border-white/5 px-6 py-2 rounded-full text-white/40 flex flex-row items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
                <ChevronUp size={14} /> {UI_TEXT.BUTTON_RESUME_MISSION}
              </button>
            </div>
          )}

          {/* タスクリスト表示エリア（縮小時は非表示） */}
          {!isSheetMinimized && (
            <div className="flex-1 px-8 sm:px-16 pb-4 overflow-y-auto no-scrollbar space-y-3">
              {tasks.filter(t => t.category === activeCategory).map(task => (
                <div key={task.id} className="flex items-center gap-4 text-white group cursor-pointer animate-fade-in py-1.5" onClick={() => handleCompleteTask(task.id)}>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${task.completed ? 'bg-white border-white' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                    <Check size={18} className={task.completed ? "text-slate-950 stroke-[4]" : "opacity-0"} />
                  </div>
                  <span className="text-base font-bold opacity-60 group-hover:opacity-100 truncate tracking-tight transition-all">{task.title}</span>
                </div>
              ))}
              {showInput && (
                <div className="pt-2 animate-fade-in">
                  <input autoFocus type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={UI_TEXT.NEW_TASK_PLACEHOLDER} className="w-full bg-white/5 text-white rounded-2xl px-6 py-4 text-base outline-none border border-white/5 focus:border-white/20 transition-all font-bold" onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                </div>
              )}
            </div>
          )}

          {/* 下部ナビゲーション */}
          <div className={`pb-4 pt-2 flex-shrink-0 flex justify-start w-full`}>
            {isSheetMinimized ? (
              /* ミニマイズモード: プラスボタンのみを左端に配置 */
              <button
                onClick={() => { setIsSheetMinimized(false); setShowInput(true); }}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-90 transition-all transform -translate-y-2 ml-4"
              >
                <Plus size={36} className="text-slate-950" strokeWidth={4} />
              </button>
            ) : (
              /* 通常モード: Navigationコンポーネントを表示 */
              <div className="w-full">
                <Navigation
                  onAddClick={() => { setShowInput(!showInput); if (!showInput && sheetHeight < 280) setSheetHeight(280); }}
                  onArchiveClick={() => setIsArchiveViewOpen(!isArchiveViewOpen)}
                  onStatsClick={() => setIsStatsViewOpen(true)}
                  onSearchOpen={() => setIsSearchViewOpen(true)}
                  onGuideOpen={() => setIsGuideOpen(true)}
                  isArchiveOpen={isArchiveViewOpen}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* カテゴリ追加モーダル */}
      {showCategoryInput && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 animate-fade-in">
          <div className="bg-slate-900 p-10 rounded-[3rem] w-full max-w-sm border border-white/5 shadow-2xl">
            <h3 className="text-white text-base font-black mb-10 tracking-[0.4em] uppercase text-center">{UI_TEXT.NEW_SECTOR_TITLE}</h3>
            <input autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white mb-10 text-center outline-none focus:border-white/30 transition-all font-black uppercase tracking-widest" value={newCategoryLabel} onChange={(e) => setNewCategoryLabel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} placeholder={UI_TEXT.NEW_SECTOR_PLACEHOLDER} />
            <div className="flex gap-4">
              <button onClick={() => setShowCategoryInput(false)} className="flex-1 text-white/20 font-black tracking-widest text-[10px] uppercase">{UI_TEXT.BUTTON_ABORT}</button>
              <button onClick={handleAddCategory} className="flex-1 bg-white text-slate-950 font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-[10px] uppercase">{UI_TEXT.BUTTON_CONNECT}</button>
            </div>
          </div>
        </div>
      )}

      <RewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} star={justDiscoveredStar} taskTitle={completedTaskTitle} isNewDiscovery={isNewDiscovery} />

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .touch-none { touch-action: none; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
