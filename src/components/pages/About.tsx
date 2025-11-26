import React from 'react';
import { Link } from 'react-router-dom';
import poster from '../../assets/background.png';
import FixedHeader from '../FixedHeader';
import StickyFooter from '../StickyFooter';

const About: React.FC = () => {
    return (
        <div className="relative w-screen min-h-screen overflow-hidden">
            {/* Fixed background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${poster})`,
                    backgroundAttachment: 'fixed',
                    backgroundPositionY: 'bottom',
                }}
            />

            {/* Gradient overlay */}
            <div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-300 to-transparent"
            />

            {/* Fixed header */}
            <FixedHeader />

            <div className="h-full w-full display-flex flex-col justify-between items-center">
                <div className="flex-grow h-[100px] flex flex-col justify-center items-center text-center px-4">
                    {/* spacer */}
                </div>
                {/* Content */}
                <div className="relative z-10 pt-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-shadow-3d chewy-bubble-font">
                            About MediMixDash Saga
                        </h1>
                        <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg">
                            <p className="text-lg text-gray-800 mb-6">
                                MediMixDash Saga is an innovative puzzle game that combines the excitement of match-3 gameplay with the challenges of medical management. As a hospital administrator, you'll need to match medications, manage patients, and keep your facility running smoothly.
                            </p>
                            <p className="text-lg text-gray-800 mb-6">
                                Inspired by classic candy crush mechanics, this game adds a unique twist by incorporating real-world medical scenarios. Players must balance patient care, resource management, and strategic decision-making to achieve high scores and unlock new levels.
                            </p>
                            <p className="text-lg text-gray-800">
                                Developed with passion for both gaming and healthcare education, MediMixDash Saga aims to entertain while raising awareness about the complexities of medical administration.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Link
                                to="/"
                                className="inline-block px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <StickyFooter />
        </div>
    );
};

export default About;