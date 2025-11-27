
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import MasterPortfolio from './components/MasterPortfolio'; // New unified component
import About from './components/About';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simple routing check
    const checkRoute = () => {
        if (window.location.hash === '#admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    // Check on load
    checkRoute();

    // Check on hash change
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  if (isAdmin) {
      return <AdminDashboard />;
  }

  return (
    <div className="font-sans antialiased text-white bg-matriz-black selection:bg-matriz-purple selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        
        {/* Master Portfolio now contains Logos, Web Showcase, and General Projects */}
        <MasterPortfolio />
        
        <About />
      </main>
      <Contact />
      
      {/* Floating Elements */}
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

export default App;
