import React from 'react';
import { Link } from 'react-router-dom';

const FixedFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-10 bg-transparent p-4 text-center text-white text-sm text-shadow-3d">
      &copy; 2024 MediMixDash Saga. All rights reserved. <br/>
      Developed by <Link to="https://github.com/iarxii" target="_blank" rel="noopener noreferrer">Thabang Mposula (@iarxii)</Link> | 
      Forked from <Link to="https://github.com/koolkishan/candy-crush-clone-react" target="_blank" rel="noopener noreferrer">Candy Crush Clone by @koolkishan</Link>
    </footer>
  );
};

export default FixedFooter;