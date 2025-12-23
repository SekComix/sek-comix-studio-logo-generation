
import React, { useState } from 'react';
import { BrandLogo } from './components/BrandLogo';
import ImageEditor from './components/ImageEditor';
import { BrandKit } from './components/BrandKit';
import { Sparkles, Zap, ArrowRight, Cpu, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'marketing' | 'design'>('marketing');
  
  // Stato globale del Brand sincronizzato per l'editor
  const [brandState, setBrandState] = useState({
    text1: 'SEK',
    text2: 'COMIX',
    subtitle: 'STUDIO',
    color: '#00f260',
    iconKey: 'palette',
    customImage: null as string | null,
    font: 'orbitron' as any,
    iconScale: 1,
    iconPos: { x: 0, y: 0 },
    showIcon: true,
    showSeparator: true,
    showSubtitle: true,
    separatorText: '+'
  });

  if (view === 'marketing') {
    return (
      <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center justify-between relative overflow-hidden font-sans py-12">
        {/* Sfondo Animato Cinematografico */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-accent/10 rounded-full blur-[180px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-accent2/10 rounded-full blur-[150px]"></div>
          
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-75"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping shadow-[0_0_15px_#00f260]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-brand-accent2 rounded-full animate-ping delay-700 shadow-[0_0_15px_#0575E6]"></div>
        </div>

        {/* LOGO PERSONALE IN ALTO (FISSO) */}
        <div className="relative z-10 animate-fade-in-down">
          <BrandLogo 
            size="lg" 
            text1="SEK"
            text2="COMIX"
            subtitle="STUDIO"
            customColor="#00f260"
            font="orbitron"
            showIcon={true}
            showSeparator={true}
            showSubtitle={true}
            separatorText="+"
            className="scale-90 md:scale-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
          />
        </div>

        {/* CONTENUTO CENTRALE HERO */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-accent/20 border border-brand-accent/40 mb-10 animate-fade-in">
            <Cpu size={14} className="text-brand-accent animate-spin-slow" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-accent">CORE NEURALE ATTIVO</span>
          </div>

          <h1 className="text-5xl md:text-[8rem] font-black mb-12 font-brand leading-none select-none animate-slide-up">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFFFFF] to-[#FFA500] uppercase mb-4 text-3xl md:text-5xl tracking-[0.2em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">Definiamo la tua</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-white to-brand-accent2 tracking-tighter drop-shadow-[0_0_100px_rgba(0,242,96,0.4)]">NUOVA ERA</span>
          </h1>

          <div className="max-w-3xl mx-auto space-y-16">
            <p className="text-gray-200 text-lg md:text-2xl font-medium leading-relaxed italic animate-fade-in delay-500 drop-shadow-md">
              "L'identità non è più una scelta estetica, ma un'evoluzione neurale. <br className="hidden md:block"/> Sfrutta la potenza suprema di Gemini per forgiare brand che dominano il futuro."
            </p>

            <div className="flex flex-col items-center justify-center gap-12 pt-6 animate-fade-in-up delay-700">
              <button 
                onClick={() => setView('design')}
                className="group relative px-14 py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-sm rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 flex items-center gap-5 shadow-[0_30px_60px_rgba(255,255,255,0.2)] hover:shadow-brand-accent/30"
              >
                <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Accedi al Laboratorio</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex items-center gap-8 text-white/40">
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-white/20"></div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                  <Layers size={16} className="text-brand-accent2" /> Design Quantistico 2025
                </div>
                <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFO IN BASSO */}
        <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-4 opacity-60">
          <div className="flex gap-4 items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Sek Comix Vision Studio</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-brand-accent">
            <Sparkles size={12} /> Powered by Gemini Ultra Engine
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-black overflow-x-hidden bg-[#020205] animate-fade-in">
      
      {/* Header Premium - Logo Fisso */}
      <header className="sticky top-0 z-50 bg-[#0f0c29]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between">
          <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => setView('marketing')}>
            <BrandLogo 
              size="md" 
              text1="SEK"
              text2="COMIX"
              subtitle="STUDIO"
              customColor="#00f260"
              font="orbitron"
              showIcon={true}
              showSeparator={true}
              showSubtitle={true}
              separatorText="+"
              className="scale-75 md:scale-100 origin-left" 
            />
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setView('marketing')}
              className="hidden md:flex px-5 py-2.5 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all shadow-lg"
            >
              Vision Mode
            </button>
            <div className="flex items-center gap-3 text-brand-accent bg-brand-accent/20 px-5 py-2.5 rounded-full border border-brand-accent/40 shadow-[0_0_15px_rgba(0,242,96,0.1)]">
              <Zap size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">v2.5 Flash Ultra</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full relative">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-accent2/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full pt-8 md:pt-14 pb-14">
          <div className="text-center mb-12 px-4 animate-slide-up">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-brand-accent mb-3 drop-shadow-[0_0_100px_rgba(0,242,96,0.3)]">Laboratorio di Creazione</h2>
            <div className="w-16 h-1.5 bg-brand-accent mx-auto rounded-full shadow-[0_0_15px_#00f260]"></div>
          </div>

          <ImageEditor />
          <BrandKit globalState={brandState} setGlobalState={setBrandState} />
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-md py-14 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <BrandLogo size="sm" showIcon={false} text1="SEK" text2="COMIX" className="opacity-60 grayscale brightness-150" />
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">L'ERA DIGITALE È QUI</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              &copy; {new Date().getFullYear()} SEK COMIX STUDIO • DEFINIAMO NUOVE ERE
            </p>
            <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-brand-accent/60">
               <span>PWI EDITION</span>
               <span className="text-white/20">•</span>
               <span>GEMINI CORE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
