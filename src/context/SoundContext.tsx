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
    playNextMusic: () => void;
    playPrevMusic: () => void;
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
        return saved ? parseFloat(saved) : 0.8; // Default 80%
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
    const [currentMusic, setCurrentMusic] = useState<string | null>('Fun Game');
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    // Refs for audio objects
    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timer | null>(null);

    // Helper to get effective volume for a track
    const getEffectiveVolume = useCallback((trackName: string, isMusic: boolean) => {
        const trackVol = trackVolumes[trackName] ?? 0.5;
        const categoryEnabled = isMusic ? musicEnabled : sfxEnabled;
        if (!categoryEnabled) return 0;
        return trackVol * globalVolume;
    }, [globalVolume, musicEnabled, sfxEnabled, trackVolumes]);

    // Ref for getEffectiveVolume to use in effects without dependency cycles
    const getEffectiveVolumeRef = useRef(getEffectiveVolume);
    useEffect(() => {
        getEffectiveVolumeRef.current = getEffectiveVolume;
    }, [getEffectiveVolume]);

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

    const playNextMusic = useCallback(() => {
        const tracks = Object.keys(MUSIC_TRACKS);
        if (tracks.length === 0) return;
        const currentIndex = currentMusic ? tracks.indexOf(currentMusic) : -1;
        const nextIndex = (currentIndex + 1) % tracks.length;
        setCurrentMusic(tracks[nextIndex]);
    }, [currentMusic]);

    const playPrevMusic = useCallback(() => {
        const tracks = Object.keys(MUSIC_TRACKS);
        if (tracks.length === 0) return;
        const currentIndex = currentMusic ? tracks.indexOf(currentMusic) : -1;
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        setCurrentMusic(tracks[prevIndex]);
    }, [currentMusic]);

    const playMusic = useCallback(() => {
        if (!musicEnabled) return;
        if (!currentMusic) {
            playNextRandomMusic();
        } else if (musicAudioRef.current) {
            // Fade in if paused
            const targetVol = getEffectiveVolume(currentMusic, true);
            musicAudioRef.current.volume = targetVol; // Fix: Use targetVol
            musicAudioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    console.warn("Audio play failed:", e);
                    setIsPlaying(false);
                });
        }
    }, [musicEnabled, currentMusic, playNextRandomMusic, getEffectiveVolume]);

    const pauseMusic = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    // Effect to handle music track changes and playback with crossfade
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

        // Use ref to avoid dependency on getEffectiveVolume
        const targetVolume = getEffectiveVolumeRef.current(currentMusic, true);

        // If we already have an audio object for this track, just ensure it's playing
        if (musicAudioRef.current && musicAudioRef.current.src.endsWith(src.split('/').pop()!)) {
            musicAudioRef.current.volume = targetVolume;
            if (musicAudioRef.current.paused) { // Fix: Check paused instead of isPlaying
                musicAudioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(e => {
                        console.warn("Audio play failed:", e);
                        setIsPlaying(false);
                    });
            }
            return;
        }

        // Crossfade Logic
        const prevAudio = musicAudioRef.current;
        const newAudio = new Audio(src);

        // Start new audio at 0 volume
        newAudio.volume = 0;
        newAudio.onended = () => {
            playNextRandomMusic();
        };

        musicAudioRef.current = newAudio;
        newAudio.play()
            .then(() => setIsPlaying(true))
            .catch(e => {
                console.warn("Audio play failed:", e);
                setIsPlaying(false);
            });

        // Fade out previous, Fade in new
        const fadeDuration = 1000; // 1 second
        const steps = 20;
        const intervalTime = fadeDuration / steps;
        const volStep = targetVolume / steps;

        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        let stepCount = 0;
        fadeIntervalRef.current = setInterval(() => {
            stepCount++;

            // Fade In New
            if (newAudio.volume + volStep <= targetVolume) {
                newAudio.volume = Math.min(newAudio.volume + volStep, targetVolume);
            } else {
                newAudio.volume = targetVolume;
            }

            // Fade Out Old
            if (prevAudio) {
                if (prevAudio.volume - volStep >= 0) {
                    prevAudio.volume = Math.max(prevAudio.volume - volStep, 0);
                } else {
                    prevAudio.volume = 0;
                }
            }

            if (stepCount >= steps) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                if (prevAudio) {
                    prevAudio.pause();
                }
                newAudio.volume = targetVolume; // Ensure final volume is exact
            }
        }, intervalTime);

        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        };
    }, [currentMusic, musicEnabled, playNextRandomMusic]); // Removed getEffectiveVolume dependency

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
            playNextMusic,
            playPrevMusic,
            playSFX
        }}>
            {children}
        </SoundContext.Provider>
    );
};
