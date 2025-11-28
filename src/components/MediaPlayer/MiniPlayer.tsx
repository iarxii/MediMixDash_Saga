import React from 'react';
import { useSound } from '../../context/SoundContext';

interface MiniPlayerProps {
    onOpenFull: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onOpenFull }) => {
    const { isPlaying, playMusic, pauseMusic, currentMusic } = useSound();

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    return (
        <div
            onClick={onOpenFull}
            className="flex items-center bg-white/80 backdrop-blur-md rounded-full px-3 py-1 shadow-sm border border-pink-200 mr-4 cursor-pointer hover:bg-white transition-colors"
            title="Open Media Player"
        >
            <button
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors mr-3"
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? (
                    <span className="font-bold text-xs">||</span>
                ) : (
                    <span className="font-bold text-xs">▶</span>
                )}
            </button>

            <div className="flex flex-col mr-3 max-w-[100px] md:max-w-[150px]">
                <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Now Playing</span>
                <div className="text-xs font-medium text-gray-700 truncate scrolling-text-container">
                    <span className="scrolling-text">{currentMusic || "No Track"}</span>
                </div>
            </div>

            <div className="text-pink-500 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            </div>
        </div>
    );
};

export default MiniPlayer;
