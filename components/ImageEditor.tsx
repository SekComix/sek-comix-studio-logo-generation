
import React, { useState, useRef } from 'react';
import { ImageFile, AppStatus } from '../types';
import { editImageWithGemini, EDIT_PRESETS } from '../services/geminiService';
import { Upload, Wand2, AlertCircle, RefreshCw, X, Send, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ImageEditorProps {
  onSendToBuilder?: (image: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onSendToBuilder }) => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({ data: reader.result as string, mimeType: file.type });
        setStatus(AppStatus.READY_TO_EDIT);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;
    setStatus(AppStatus.PROCESSING);
    try {
      const result = await editImageWithGemini(originalImage.data, originalImage.mimeType, prompt, selectedPreset ? (EDIT_PRESETS as any)[selectedPreset] : undefined);
      setGeneratedImage(result);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message);
      setStatus(AppStatus.READY_TO_EDIT);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setSelectedPreset(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-10">
      {status === AppStatus.IDLE ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/20 rounded-[2rem] p-10 text-center bg-black/40 hover:border-brand-accent transition-all cursor-pointer flex flex-col items-center gap-4 group">
          <div className="w-20 h-20 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform"><Upload size={36}/></div>
          <div>
            <h3 className="text-xl font-black uppercase text-white">Laboratorio Visione AI</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">Trascina o clicca per caricare un'immagine base</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl">
             
             {/* MODULO C: PRESET CHIRURGICI AI - ETICHETTA E VISIBILITÀ MIGLIORATA */}
             <div className="mb-6 bg-black/40 p-5 rounded-[1.5rem] border border-white/5">
                <div className="flex items-center gap-3 text-brand-accent mb-4">
                  <SlidersHorizontal size={18}/>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Preset Chirurgici AI (Modulo C)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(EDIT_PRESETS).map(key => (
                    <button key={key} onClick={()=>setSelectedPreset(selectedPreset === key ? null : key)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${selectedPreset === key ? 'bg-brand-accent text-black border-brand-accent shadow-[0_0_20px_#00f26044]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}>{key}</button>
                  ))}
                </div>
             </div>

             <div className="flex flex-col md:flex-row gap-4">
                <input type="text" value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Cosa deve fare l'AI? (es: Trasforma in logo neon minimalista...)" className="flex-1 bg-black/60 border border-white/20 rounded-2xl py-6 px-8 text-sm text-white outline-none focus:border-brand-accent transition-all shadow-inner" />
                <div className="flex gap-2">
                  <button onClick={handleEdit} disabled={status === AppStatus.PROCESSING || !prompt.trim()} className="bg-brand-accent text-black px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center gap-3 shadow-lg shadow-brand-accent/20">
                    {status === AppStatus.PROCESSING ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>} Elabora
                  </button>
                  <button onClick={handleReset} className="bg-white/10 text-white p-5 rounded-2xl hover:bg-red-500/20 transition-all border border-white/5"><X size={24}/></button>
                </div>
             </div>
             {error && <p className="text-red-400 text-[10px] font-black mt-4 uppercase tracking-widest flex items-center gap-2 px-2"><AlertCircle size={14}/> {error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/60 aspect-square flex items-center justify-center p-8 shadow-inner">
               <img src={originalImage?.data} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
               <span className="absolute top-5 left-5 bg-black/80 text-white/40 text-[9px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">Sorgente</span>
            </div>
            
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/60 aspect-square flex flex-col items-center justify-center p-8 shadow-inner">
               {status === AppStatus.PROCESSING ? (
                 <div className="flex flex-col items-center gap-5 animate-pulse">
                   <div className="relative">
                      <div className="absolute inset-0 blur-2xl bg-brand-accent opacity-20 animate-ping"></div>
                      <RefreshCw className="animate-spin text-brand-accent relative z-10" size={48} />
                   </div>
                   <span className="text-[11px] font-black text-brand-accent tracking-[0.5em] uppercase">Gemini AI Vision...</span>
                 </div>
               ) : generatedImage ? (
                 <>
                   <img src={generatedImage} className="max-w-full max-h-[70%] object-contain animate-fade-in drop-shadow-[0_0_30px_rgba(0,242,96,0.3)]" />
                   
                   {/* MODULO B: PULSANTE PONTE - SEMPRE VISIBILE E ACCESSIBILE */}
                   <div className="mt-8 w-full flex justify-center animate-slide-up">
                     <button onClick={()=>onSendToBuilder && onSendToBuilder(generatedImage)} className="bg-white text-black px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-brand-accent hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95">
                       <Send size={18}/> Usa come Logo
                     </button>
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col items-center gap-4 opacity-10">
                   <Wand2 size={64} className="text-white" />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em]">Preview AI</span>
                 </div>
               )}
               <span className="absolute top-5 right-5 bg-brand-accent text-black text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">Risultato AI</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
