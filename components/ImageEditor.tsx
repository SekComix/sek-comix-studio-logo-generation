
import React, { useState, useRef } from 'react';
import { ImageFile, AppStatus } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { Upload, Wand2, AlertCircle, RefreshCw, X } from 'lucide-react';

const ImageEditor: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Carica un file immagine valido.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage({
          data: reader.result as string,
          mimeType: file.type,
        });
        setStatus(AppStatus.READY_TO_EDIT);
        setError(null);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const result = await editImageWithGemini(
        originalImage.data,
        originalImage.mimeType,
        prompt
      );
      setGeneratedImage(result);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'Errore elaborazione.');
      setStatus(AppStatus.READY_TO_EDIT);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-6">
      {/* Upload Section Slim */}
      {status === AppStatus.IDLE && (
        <div 
          className="border-2 border-dashed border-white/30 rounded-[2rem] p-6 text-center hover:border-brand-accent/60 hover:bg-white/5 transition-all cursor-pointer group flex items-center justify-center gap-6 bg-black/40 shadow-xl"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-14 h-14 bg-brand-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 shadow-lg border border-brand-accent/30">
            <Upload className="w-7 h-7 text-brand-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black uppercase tracking-tight text-white">Carica Immagine Base</h3>
            <p className="text-white/60 text-[10px] uppercase font-bold tracking-[0.3em] mt-1">AI Editing Pro • Gemini Powered</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}

      {/* Editor Interface Compact */}
      {(status !== AppStatus.IDLE) && originalImage && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] p-4 border border-white/20 shadow-2xl">
             <div className="flex flex-col md:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Descrivi le modifiche AI (es: aggiungi sfondo cosmico)..."
                  className="flex-1 bg-black/60 border border-white/30 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-brand-accent transition-all w-full placeholder:text-white/30"
                />
                
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={handleEdit}
                    disabled={status === AppStatus.PROCESSING || !prompt.trim()}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                      status === AppStatus.PROCESSING || !prompt.trim()
                        ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/10' 
                        : 'bg-brand-accent text-black hover:scale-105 shadow-brand-accent/20'
                    }`}
                  >
                    {status === AppStatus.PROCESSING ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {status === AppStatus.PROCESSING ? 'ELABORAZIONE' : 'GENERA MODIFICA'}
                  </button>
                  <button onClick={handleReset} className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all text-white/70 shadow-lg"><X className="w-5 h-5" /></button>
                </div>
             </div>
             {error && <p className="mt-2 text-[10px] text-red-400 font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 bg-black/60 flex items-center justify-center min-h-[180px] shadow-inner">
              <img src={originalImage.data} className="max-w-full max-h-[180px] object-contain p-4 transition-transform hover:scale-110 duration-700" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 rounded-full text-[9px] font-black text-white/80 uppercase tracking-widest border border-white/20 shadow-lg">Originale</div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 bg-black/60 flex items-center justify-center min-h-[180px] shadow-inner">
              {status === AppStatus.PROCESSING ? (
                <div className="animate-pulse flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-brand-accent" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Generazione in corso...</span>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} className="max-w-full max-h-[180px] object-contain p-4 animate-fade-in" />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-20">
                  <div className="w-12 h-12 border-2 border-dashed border-white rounded-xl"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Preview AI</span>
                </div>
              )}
              {generatedImage && <div className="absolute top-3 right-3 px-3 py-1 bg-brand-accent/90 rounded-full text-[9px] font-black text-black uppercase tracking-widest shadow-lg">AI Vision</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
