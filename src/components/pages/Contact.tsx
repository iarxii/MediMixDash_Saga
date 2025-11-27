import React from 'react';
import { Link } from 'react-router-dom';
import poster from '../../assets/carousel-bg/cartoon-carousel-bgimg_2.png';
import FixedHeader from '../FixedHeader';
import StickyFooter from '../StickyFooter';

const Contact: React.FC = () => {
    return (
        <div className="relative w-screen min-h-screen overflow-hidden">
            {/* Fixed background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${poster})`,
                    backgroundAttachment: 'fixed',
                    backgroundPositionY: 'top',
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
                            Contact Us
                        </h1>
                        <div className="my-8">
                            <Link
                                to="/"
                                className="inline-block px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                        <div className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg mb-8">
                            <p className="text-lg text-gray-800 mb-6">
                                We'd love to hear from you! Whether you have feedback, suggestions, or just want to say hello, feel free to reach out.
                            </p>
                            <div className="space-y-4 text-left">
                                <div>
                                    <h3 className="text-xl font-semibold text-pink-600 mb-2">Developer</h3>
                                    <p className="text-gray-700">Thabang Mposula (@iarxii)</p>
                                    <a href="https://github.com/iarxii" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        GitHub Profile
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-pink-600 mb-2">Email</h3>
                                    <p className="text-gray-700">For inquiries, please use the GitHub repository's issue tracker or discussion section.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-pink-600 mb-2">Community</h3>
                                    <p className="text-gray-700">Join the conversation on our GitHub repository. We welcome contributions, bug reports, and feature requests from the community.</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <a
                                    href="https://github.com/iarxii/MediMixDash_Saga/issues/new"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    Open an Issue
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StickyFooter />
        </div>
    );
};

export default Contact;