import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import LogoGrid from './components/LogoGrid';
import WebShowcase from './components/WebShowcase';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <div className="font-sans antialiased text-white bg-matriz-black selection:bg-matriz-purple selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <LogoGrid />
        <WebShowcase />
        <Portfolio />
        <About />
      </main>
      <Contact />
      <BackToTop />
    </div>
  );
}

export default App;