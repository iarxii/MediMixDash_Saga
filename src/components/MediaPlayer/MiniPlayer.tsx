import React from 'react';
import { useSound } from '../../context/SoundContext';

interface MiniPlayerProps {
    onOpenFull: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onOpenFull }) => {
    const { isPlaying, playMusic, pauseMusic, currentMusic } = useSound();

    const togglePlay = () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    return (
        <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full px-3 py-1 shadow-sm border border-pink-200 mr-4">
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

            <button
                onClick={onOpenFull}
                className="text-pink-500 hover:text-pink-700 p-1"
                title="Open Media Player"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
        </div>
    );
};

export default MiniPlayer;
