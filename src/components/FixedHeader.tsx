import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/medimixdash_saga_logo_dynamic_transp.png';
import puzzleIcon from '../assets/icons/puzzle-svgrepo-com.svg';
import MiniPlayer from './MediaPlayer/MiniPlayer';
import MediaPlayer from './MediaPlayer/MediaPlayer';

const FixedHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-20 bg-transparent px-4 pt-6">
                <div className="max-w-7xl mx-auto flex items-top justify-between px-4">
                    <Link to="/"><img src={logo} alt="MediMixDash Saga Logo" className="h-30 md:h-40 logo-fun" /></Link>
                    <div className="flex items-top">
                        <MiniPlayer onOpenFull={() => setIsMediaPlayerOpen(true)} />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-pink-500 font-bold p-2 border-2 border-pink-500 rounded-lg bg-pink-300 hover:bg-pink-500 hover:text-white transition-colors mr-2 z-20"
                        >
                            ☰
                        </button>
                        <nav className={`md:flex space-x-0 ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row max-h-[72px] items-center absolute md:relative top-full md:top-auto left-4 md:left-auto bg-white/75 backdrop-blur-sm p-4 md:p-0 rounded-xl md:rounded-md shadow-md md:shadow-none z-20`}>
                            <Link to="/game" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0 p-4">
                                <img src={puzzleIcon} alt="Play" className="inline-block w-10 h-10 mr-1 rounded-full elem-animation" />
                                <span className="nav-underline">Play</span>
                            </Link>
                            <Link to="/about" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0 p-4">
                                <span className="nav-underline">About</span>
                            </Link>
                            <Link to="/github" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0 p-4">
                                <span className="nav-underline">Github</span>
                            </Link>
                            <Link to="/contact" className="text-pink-500 font-bold hover:text-pink-700 p-4">
                                <span className="nav-underline">Contact</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <MediaPlayer isOpen={isMediaPlayerOpen} onClose={() => setIsMediaPlayerOpen(false)} />
        </>
    );
};

export default FixedHeader;