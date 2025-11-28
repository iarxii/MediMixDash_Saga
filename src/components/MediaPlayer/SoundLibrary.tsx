import React, { useState } from 'react';
import { useSound } from '../../context/SoundContext';
import { MUSIC_TRACKS, SFX_TRACKS } from '../../config/soundAssets';
import VolumeSlider from './VolumeSlider';

const SoundLibrary: React.FC = () => {
    const { trackVolumes, setTrackVolume } = useSound();
    const [activeTab, setActiveTab] = useState<'music' | 'sfx'>('music');

    const tracks = activeTab === 'music' ? MUSIC_TRACKS : SFX_TRACKS;

    return (
        <div className="flex flex-col h-full bg-white/50 rounded-lg p-4 backdrop-blur-sm border border-pink-200">
            <div className="flex space-x-4 mb-4 border-b border-pink-200 pb-2">
                <button
                    onClick={() => setActiveTab('music')}
                    className={`text-sm font-bold px-4 py-1 rounded-full transition-colors ${activeTab === 'music'
                            ? 'bg-pink-500 text-white'
                            : 'text-pink-500 hover:bg-pink-100'
                        }`}
                >
                    Music Library
                </button>
                <button
                    onClick={() => setActiveTab('sfx')}
                    className={`text-sm font-bold px-4 py-1 rounded-full transition-colors ${activeTab === 'sfx'
                            ? 'bg-pink-500 text-white'
                            : 'text-pink-500 hover:bg-pink-100'
                        }`}
                >
                    SFX Library
                </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex space-x-6 h-full items-center p-2 min-w-max">
                    {Object.keys(tracks).length === 0 ? (
                        <div className="text-gray-500 italic w-full text-center">No tracks available</div>
                    ) : (
                        Object.keys(tracks).map((trackName) => (
                            <div key={trackName} className="flex flex-col items-center space-y-2 min-w-[80px] h-full justify-end">
                                <div className="h-32 flex items-center justify-center">
                                    <VolumeSlider
                                        value={trackVolumes[trackName] ?? 0.5}
                                        onChange={(val) => setTrackVolume(trackName, val)}
                                        orientation="vertical"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700 text-center w-24 truncate" title={trackName}>
                                    {trackName}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SoundLibrary;
