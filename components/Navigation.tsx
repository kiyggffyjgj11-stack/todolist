
import React from 'react';
import { Plus, Calendar, Archive, Search, BookOpen } from 'lucide-react';

interface NavigationProps {
  onAddClick: () => void;
  onArchiveClick: () => void;
  onStatsClick: () => void;
  onSearchOpen: () => void;
  onGuideOpen: () => void;
  isArchiveOpen: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onAddClick,
  onArchiveClick,
  onStatsClick,
  onSearchOpen,
  onGuideOpen,
  isArchiveOpen
}) => {
  const navItems = [
    {
      icon: <Search size={22} strokeWidth={2.5} />,
      label: '検索',
      onClick: onSearchOpen,
      active: false,
    },
    {
      icon: <BookOpen size={22} strokeWidth={2.5} />,
      label: '図鑑',
      onClick: onGuideOpen,
      active: false,
    },
    {
      icon: <Calendar size={22} strokeWidth={2.5} />,
      label: '記録',
      onClick: onStatsClick,
      active: false,
    },
    {
      icon: <Archive size={22} strokeWidth={2.5} />,
      label: 'アーカイブ',
      onClick: onArchiveClick,
      active: isArchiveOpen,
    },
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-xl border border-white/10 h-20 rounded-[2.5rem] px-4 flex items-center shadow-2xl mx-4 mb-4 relative overflow-hidden">

      {/* 左端：追加ボタン（ラベルなし） */}
      <div className="flex-none">
        <button
          onClick={onAddClick}
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-90 transition-all group"
        >
          <Plus size={32} className="text-slate-900 group-hover:rotate-90 transition-transform duration-300" strokeWidth={4} />
        </button>
      </div>

      {/* 中央：ナビゲーションボタン群（中央揃え、ラベルあり） */}
      <div className="flex-1 flex justify-center items-center gap-6 sm:gap-10">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[48px] ${item.active
                ? 'text-blue-400 scale-110'
                : 'text-white/40 hover:text-white hover:scale-110'
              }`}
          >
            <div className="p-1">
              {item.icon}
            </div>
            <span className="text-[9px] font-black tracking-widest uppercase">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* 右側のスペーサー（追加ボタンと対称にするためのダミー領域） */}
      <div className="flex-none w-14 pointer-events-none opacity-0 invisible"></div>
    </div>
  );
};
