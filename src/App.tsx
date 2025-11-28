import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Github from './components/pages/Github';
import Contact from './components/pages/Contact';
import Game from './Game';
import { SoundProvider } from './context/SoundContext';

function App() {
  return (
    <SoundProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/github" element={<Github />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </SoundProvider>
  );
}

export default App;
