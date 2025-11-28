import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MUSIC_TRACKS, SFX_TRACKS } from '../config/soundAssets';

interface SoundContextType {
    globalVolume: number;
    setGlobalVolume: (volume: number) => void;
    musicEnabled: boolean;
    setMusicEnabled: (enabled: boolean) => void;
    sfxEnabled: boolean;
    setSfxEnabled: (enabled: boolean) => void;
    trackVolumes: Record<string, number>;
    setTrackVolume: (trackName: string, volume: number) => void;
    currentMusic: string | null;
    isPlaying: boolean;
    playMusic: () => void;
    pauseMusic: () => void;
    playSFX: (sfxName: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State
    const [globalVolume, setGlobalVolume] = useState<number>(() => {
        const saved = localStorage.getItem('sound_globalVolume');
        return saved ? parseFloat(saved) : 0.5;
    });
    const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('sound_musicEnabled');
        return saved ? JSON.parse(saved) : true;
    });
    const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
        const saved = localStorage.getItem('sound_sfxEnabled');
        return saved ? JSON.parse(saved) : true;
    });
    const [trackVolumes, setTrackVolumes] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem('sound_trackVolumes');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentMusic, setCurrentMusic] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Refs for audio objects
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const sfxAudioRefs = useRef<Record<string, HTMLAudioElement>>({});

    // Persistence
    useEffect(() => {
        localStorage.setItem('sound_globalVolume', globalVolume.toString());
    }, [globalVolume]);

    useEffect(() => {
        localStorage.setItem('sound_musicEnabled', JSON.stringify(musicEnabled));
    }, [musicEnabled]);

    useEffect(() => {
        localStorage.setItem('sound_sfxEnabled', JSON.stringify(sfxEnabled));
    }, [sfxEnabled]);

    useEffect(() => {
        localStorage.setItem('sound_trackVolumes', JSON.stringify(trackVolumes));
    }, [trackVolumes]);

    // Helper to get effective volume for a track
    const getEffectiveVolume = useCallback((trackName: string, isMusic: boolean) => {
        const trackVol = trackVolumes[trackName] ?? 0.5;
        const categoryEnabled = isMusic ? musicEnabled : sfxEnabled;
        if (!categoryEnabled) return 0;
        return trackVol * globalVolume;
    }, [globalVolume, musicEnabled, sfxEnabled, trackVolumes]);

    // Music Logic
    const playNextRandomMusic = useCallback(() => {
        const tracks = Object.keys(MUSIC_TRACKS);
        if (tracks.length === 0) return;

        let nextTrack = tracks[Math.floor(Math.random() * tracks.length)];
        // Try to avoid repeating the same track immediately if possible
        if (currentMusic && tracks.length > 1 && nextTrack === currentMusic) {
            const remaining = tracks.filter(t => t !== currentMusic);
            nextTrack = remaining[Math.floor(Math.random() * remaining.length)];
        }

        setCurrentMusic(nextTrack);
    }, [currentMusic]);

    const playMusic = useCallback(() => {
        if (!musicEnabled) return;
        if (!currentMusic) {
            playNextRandomMusic();
        } else if (musicAudioRef.current) {
            musicAudioRef.current.play().catch(e => console.warn("Audio play failed:", e));
            setIsPlaying(true);
        }
    }, [musicEnabled, currentMusic, playNextRandomMusic]);

    const pauseMusic = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    // Effect to handle music track changes and playback
    useEffect(() => {
        if (!currentMusic || !musicEnabled) {
            if (musicAudioRef.current) {
                musicAudioRef.current.pause();
                musicAudioRef.current = null;
                setIsPlaying(false);
            }
            return;
        }

        const src = MUSIC_TRACKS[currentMusic];
        if (!src) return;

        // If we already have an audio object for this track, just ensure it's playing
        // But here we switch tracks, so we likely need a new audio object or update src
        if (musicAudioRef.current && musicAudioRef.current.src.endsWith(src.split('/').pop()!)) {
            // Same track, update volume
            musicAudioRef.current.volume = getEffectiveVolume(currentMusic, true);
            if (!isPlaying) {
                musicAudioRef.current.play().catch(e => console.warn("Audio play failed:", e));
                setIsPlaying(true);
            }
            return;
        }

        // New track
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
        }

        const audio = new Audio(src);
        audio.volume = getEffectiveVolume(currentMusic, true);
        audio.onended = () => {
            playNextRandomMusic();
        };

        musicAudioRef.current = audio;
        audio.play().then(() => setIsPlaying(true)).catch(e => console.warn("Audio play failed:", e));

        return () => {
            // Cleanup on unmount or track change is handled by the next effect run or pause logic
        };
    }, [currentMusic, musicEnabled, getEffectiveVolume, playNextRandomMusic]);

    // Update volume of currently playing music when volume settings change
    useEffect(() => {
        if (musicAudioRef.current && currentMusic) {
            musicAudioRef.current.volume = getEffectiveVolume(currentMusic, true);
        }
    }, [globalVolume, musicEnabled, trackVolumes, currentMusic, getEffectiveVolume]);

    // SFX Logic
    const playSFX = useCallback((sfxName: string) => {
        if (!sfxEnabled) return;
        const src = SFX_TRACKS[sfxName];
        if (!src) return;

        const audio = new Audio(src);
        audio.volume = getEffectiveVolume(sfxName, false);
        audio.play().catch(e => console.warn("SFX play failed:", e));
    }, [sfxEnabled, getEffectiveVolume]);

    const setTrackVolume = (trackName: string, volume: number) => {
        setTrackVolumes(prev => ({ ...prev, [trackName]: volume }));
    };

    return (
        <SoundContext.Provider value={{
            globalVolume,
            setGlobalVolume,
            musicEnabled,
            setMusicEnabled,
            sfxEnabled,
            setSfxEnabled,
            trackVolumes,
            setTrackVolume,
            currentMusic,
            isPlaying,
            playMusic,
            pauseMusic,
            playSFX
        }}>
            {children}
        </SoundContext.Provider>
    );
};
