import React from 'react';
import { useSound } from '../../context/SoundContext';
import SoundLibrary from './SoundLibrary';
import VolumeSlider from './VolumeSlider';

interface MediaPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ isOpen, onClose }) => {
    const {
        globalVolume, setGlobalVolume,
        musicEnabled, setMusicEnabled,
        sfxEnabled, setSfxEnabled,
        currentMusic, isPlaying, playMusic, pauseMusic,
        playNextMusic, playPrevMusic
    } = useSound();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border-4 border-pink-300">
                {/* Header */}
                <div className="bg-pink-50 p-4 flex justify-between items-center border-b border-pink-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-2xl">🎵</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Media Center</h2>
                            <p className="text-xs text-pink-500 font-medium">Sound & Music Control</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left Panel: Global Controls */}
                    <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col space-y-6 border-r border-pink-100">
                        {/* Now Playing */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Now Playing</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-lg font-bold text-pink-600 truncate">
                                    {currentMusic || "No Track Selected"}
                                </div>
                            </div>
                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    onClick={playPrevMusic}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                                    title="Previous Track"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={isPlaying ? pauseMusic : playMusic}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-105 ${isPlaying ? 'bg-pink-500' : 'bg-green-500'
                                        }`}
                                >
                                    {isPlaying ? (
                                        <span className="text-2xl font-bold">||</span>
                                    ) : (
                                        <span className="text-2xl font-bold ml-1">▶</span>
                                    )}
                                </button>
                                <button
                                    onClick={playNextMusic}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                                    title="Next Track"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Global Volume */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Master Volume</h3>
                            <VolumeSlider
                                value={globalVolume}
                                onChange={setGlobalVolume}
                                orientation="horizontal"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Music</span>
                                <button
                                    onClick={() => setMusicEnabled(!musicEnabled)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${musicEnabled ? 'bg-pink-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${musicEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">SFX</span>
                                <button
                                    onClick={() => setSfxEnabled(!sfxEnabled)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${sfxEnabled ? 'bg-pink-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Library */}
                    <div className="w-full md:w-2/3 p-6 bg-white overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Sound Library</h3>
                        <div className="flex-1 overflow-hidden">
                            <SoundLibrary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPlayer;
