import React from 'react';
import { UI_TEXT } from '../textConstants';

interface StartScreenProps {
    onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            {/* Background Image */}
            <img
                src="start-screen/background.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {/* Overlay to ensure text legibility if needed, though design seems to rely on image dark areas */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full animate-fade-in overflow-hidden">

                {/* Title Logo Wrapper */}
                <div className="relative flex flex-col items-center justify-center w-[180vw] sm:w-[140vh] max-w-none">
                    <img
                        src="start-screen/title_logo.png"
                        alt="星に願いを ToDoリスト"
                        className="w-full h-auto drop-shadow-2xl"
                    />

                    {/* Start Button - Overlaying the logo */}
                    <button
                        onClick={onStart}
                        className="absolute bottom-[20%] sm:bottom-[25%] group px-12 py-3 sm:px-16 sm:py-4 bg-black/30 border-[3px] border-white/80 backdrop-blur-md rounded-full text-white font-bold text-xl sm:text-2xl tracking-[0.2em] transition-all duration-300 hover:bg-white/20 active:scale-95 hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        style={{ fontFamily: '"M PLUS Rounded 1c", sans-serif' }}
                    >
                        <span className="relative z-10 drop-shadow-md">{UI_TEXT.START_BUTTON}</span>
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }
      `}</style>
        </div>
    );
};
