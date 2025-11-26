import React from 'react';
import { Link } from 'react-router-dom';
import poster from '../../assets/background.png';
import FixedHeader from '../FixedHeader';
import FixedFooter from '../FixedFooter';

const Home: React.FC = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Fixed background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${poster})`,
                    backgroundAttachment: 'fixed',
                    backgroundPositionY: 'bottom',
                }}
            />

            {/* Gradient overlay at bottom */}
            <div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-300 to-transparent"
            />

            {/* Fixed header */}
            <FixedHeader />

            <div className="h-full w-full display-flex flex-col justify-between items-center">
                <div className="flex-grow h-[20vh] flex flex-col justify-center items-center text-center px-4">
                    {/* spacer */}
                </div>

                {/* Content */}
                <div className="relative z-20 flex items-center justify-center h-full">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white px-4 mb-8 text-shadow-3d">Welcome to 
                            <span className="chewy-bubble-font luckiest-guy-fontz text-shadow-3dz text-embossedz text-pink-glowz"><span style={{ color: 'var(--powder-blue)' }}>Medi</span><span style={{ color: 'var(--light-orange)' }}>Mix</span><span style={{ color: 'var(--bright-pink)' }}>Dash</span> <span style={{ color: 'var(--bright-purple)' }}>Saga</span></span>
                        </h1>
                        <Link
                            to="/game"
                            className="inline-block px-8 py-4 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors shadow-lg elem-animation hover:shadow-xl"
                        >
                            Start Game
                        </Link>
                    </div>
                </div>
            </div>

            {/* fixed bottom footer */}
            <FixedFooter />

        </div>
    );
};

export default Home;