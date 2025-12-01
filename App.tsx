import React from 'react';
import { BrandLogo } from './components/BrandLogo';
import ImageEditor from './components/ImageEditor';
import { BrandKit } from './components/BrandKit';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-black">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0c29]/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Main Logo - Fixed style for the App itself */}
          <BrandLogo size="md" subtitle="STUDIO" />
          
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300 font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Sek + Comix</span>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles size={16} />
              <span>Gemini 2.5 Pro</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full relative">
        {/* Background Decorative Elements - Subtler */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 w-full py-12">
          <div className="text-center mb-10 px-4 animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-black mb-4 font-brand tracking-tight">
              AI CREATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-accent2">STUDIO</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Il tuo spazio creativo personale alimentato da Google Gemini.
            </p>
          </div>

          <ImageEditor />
          
          <BrandKit />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <BrandLogo size="sm" showIcon={false} />
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Sek + Comix. Powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
