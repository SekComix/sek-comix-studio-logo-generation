
import React, { useState } from 'react';
import { BrandLogo } from './components/BrandLogo';
import ImageEditor from './components/ImageEditor';
import { BrandKit } from './components/BrandKit';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Stato globale del Brand per sincronizzare Header e Editor
  const [brandState, setBrandState] = useState({
    text1: 'SEK',
    text2: 'COMIX',
    subtitle: 'STUDIO',
    color: '#00f260',
    iconKey: 'palette',
    customImage: null as string | null,
    font: 'orbitron' as any,
    iconScale: 1
  });

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-black overflow-x-hidden">
      
      {/* Header dinamico che riflette le scelte dell'utente */}
      <header className="sticky top-0 z-50 bg-[#0f0c29]/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <BrandLogo 
            size="md" 
            text1={brandState.text1}
            text2={brandState.text2}
            subtitle={brandState.subtitle}
            customColor={brandState.color}
            customImageSrc={brandState.customImage}
            font={brandState.font}
            iconScale={brandState.iconScale * 0.8}
            className="scale-75 md:scale-90 origin-left" 
          />
          
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Creative Hub</span>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Gemini Engine</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 w-full py-6 md:py-12">
          <div className="text-center mb-6 md:mb-10 px-4 animate-fade-in-down">
            <h1 className="text-3xl md:text-6xl font-black mb-4 font-brand tracking-tight">
              AI CREATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent2">STUDIO</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              Disegna la tua identità visiva unica con l'intelligenza artificiale.
            </p>
          </div>

          <ImageEditor />
          
          {/* Passiamo stato e setter a BrandKit */}
          <BrandKit globalState={brandState} setGlobalState={setBrandState} />
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/40 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-30 scale-75">
            <BrandLogo size="sm" showIcon={false} text1={brandState.text1} text2={brandState.text2} />
          </div>
          <p className="text-gray-500 text-[10px] md:text-xs text-center font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Sek + Comix. Powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
