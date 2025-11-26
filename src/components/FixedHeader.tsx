import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/medimixdash_saga_logo_dynamic_transp.png';
import puzzleIcon from '../assets/icons/puzzle-svgrepo-com.svg';

const FixedHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-20 bg-transparent px-4 pt-6">
            <div className="max-w-7xl mx-auto flex items-top justify-between px-4">
                <Link to="/"><img src={logo} alt="MediMixDash Saga Logo" className="h-30 md:h-40 logo-fun" /></Link>
                <div className="flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-pink-500 font-bold p-2 border-2 border-pink-500 rounded-lg bg-pink-300 hover:bg-pink-500 hover:text-white transition-colors mr-2"
                    >
                        ☰
                    </button>
                    <nav className={`md:flex space-x-3 ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row absolute md:relative top-full md:top-auto left-0 md:left-auto bg-white md:bg-transparent p-4 md:p-0 rounded md:rounded-none shadow md:shadow-none`}>
                        <Link to="/game" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0"><img src={puzzleIcon} alt="Play" className="inline-block w-5 h-5 mr-1" /><span className="nav-underline">Play</span></Link>
                        <Link to="/about" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0"><span className="nav-underline">About</span></Link>
                        <Link to="/github" className="text-pink-500 font-bold hover:text-pink-700 mb-2 md:mb-0"><span className="nav-underline">Github</span></Link>
                        <Link to="/contact" className="text-pink-500 font-bold hover:text-pink-700"><span className="nav-underline">Contact</span></Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default FixedHeader;