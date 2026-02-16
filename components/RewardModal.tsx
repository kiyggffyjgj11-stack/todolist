import React from 'react';
import { Star } from '../types';
import { Check, X, Star as StarIcon } from 'lucide-react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  star: Star | null;
  taskTitle: string;
  isNewDiscovery?: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  star,
  taskTitle,
  isNewDiscovery = true
}) => {
  if (!isOpen || !star) return null;

  const getStarRating = () => {
    switch (star.rarity) {
      case 'legendary': return 3;
      case 'rare': return 2;
      default: return 1;
    }
  };

  const rating = getStarRating();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-[#0f172a] rounded-[3.5rem] p-10 w-full max-w-sm flex flex-col items-center relative border border-white/5 shadow-2xl animate-scale-up">

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-white mt-4 mb-2 tracking-[0.2em] uppercase">
          {isNewDiscovery ? 'DISCOVERED' : 'STAR INFO'}
        </h2>

        {isNewDiscovery && (
          <div className="flex items-center gap-2 text-blue-400 text-[10px] mb-8 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-400/20">
            <Check size={12} className="stroke-[4]" />
            <span className="truncate max-w-[180px] font-black uppercase tracking-widest">{taskTitle}</span>
          </div>
        )}

        {!isNewDiscovery && <div className="mb-8 text-white/30 text-[10px] font-black tracking-widest uppercase">COLLECTION</div>}

        <div className="relative w-full aspect-square mb-8 flex items-center justify-center overflow-hidden">
          {/* 背後グロー: 透過エッジを馴染ませる */}
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse scale-90"></div>
          <img
            src={star.imageUrl}
            alt={star.name}
            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-bounce-slow"
          />
        </div>

        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <StarIcon
              key={i}
              size={32}
              className={`${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-white/5 text-white/5"} transition-all duration-700`}
            />
          ))}
        </div>

        <div className="text-center mb-10 px-2 space-y-2">
          <p className="text-white text-lg font-black tracking-widest">{star.name}</p>

        </div>

        <button
          onClick={onClose}
          className="w-full bg-white text-slate-950 text-xs font-black py-5 rounded-[2rem] transition-all active:scale-95 shadow-xl tracking-[0.3em] uppercase"
        >
          {isNewDiscovery ? 'PLACE IN UNIVERSE' : 'CLOSE'}
        </button>
      </div>
    </div>
  );
};
