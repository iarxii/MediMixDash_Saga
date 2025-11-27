import React from 'react';
import { Link } from 'react-router-dom';
import poster from '../../assets/carousel-bg/cartoon-carousel-bgimg_3.png';
import githubLogo from '../../assets/icons/github-mark-c791e9551fe4/github-mark/github-mark-white.svg';
import FixedHeader from '../FixedHeader';
import StickyFooter from '../StickyFooter';

const Github: React.FC = () => {
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
                <div className="flex-grow h-[50vh] flex flex-col justify-center items-center text-center px-4">
                    {/* spacer */}
                </div>
                {/* Content */}
                <div className="relative z-10 pt-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-shadow-3d chewy-bubble-font">
                            GitHub Repository
                        </h1>
                        <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg">
                            <p className="text-lg text-gray-800 mb-6">
                                Explore the source code, contribute to the project, and stay updated with the latest developments of MediMixDash Saga.
                            </p>
                            <div className="space-y-4">
                                <a
                                    href="https://github.com/iarxii/MediMixDash_Saga"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors align-center"
                                >
                                    <img
                                        src={githubLogo}
                                        alt="GitHub"
                                        width="30"
                                        height="30"
                                        className="inline-block align-middle mr-3"
                                    />
                                    View Repository on GitHub
                                </a>
                                <a
                                    href="https://github.com/iarxii/MediMixDash_Saga/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Report Issues
                                </a>
                                <a
                                    href="https://github.com/iarxii/MediMixDash_Saga/pulls"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Submit Pull Requests
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 mt-6">
                                This project is open source. Feel free to fork, star, and contribute to make MediMixDash Saga even better!
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

export default Github;