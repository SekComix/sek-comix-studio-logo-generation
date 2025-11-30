import React, { useState, useRef } from 'react';
import { ImageFile, AppStatus } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { Upload, Wand2, Download, AlertCircle, RefreshCw, X } from 'lucide-react';

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
        setError('Per favore carica un file immagine valido (JPG, PNG).');
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
      setError(err.message || 'Si è verificato un errore.');
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

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `sek-comix-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      
      {/* Upload Section */}
      {status === AppStatus.IDLE && (
        <div 
          className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-brand-accent/50 hover:bg-white/5 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-brand-purple/50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-brand-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Carica la tua immagine</h3>
          <p className="text-gray-400">Clicca per caricare un file JPG o PNG</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}

      {/* Editor Interface */}
      {(status !== AppStatus.IDLE) && originalImage && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrivi le modifiche (Prompt)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Es: Aggiungi un filtro retro, Rimuovi lo sfondo..."
                      className="w-full bg-black/40 border border-white/20 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all placeholder-gray-500"
                      disabled={status === AppStatus.PROCESSING}
                    />
                    <div className="absolute right-3 top-3 text-xs text-gray-500 bg-black/20 px-2 rounded">
                      Italiano
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={handleEdit}
                    disabled={status === AppStatus.PROCESSING || !prompt.trim()}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      status === AppStatus.PROCESSING || !prompt.trim()
                        ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-brand-accent to-brand-accent2 text-white hover:shadow-lg hover:shadow-brand-accent/20 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {status === AppStatus.PROCESSING ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Elaborazione...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Modifica
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    disabled={status === AppStatus.PROCESSING}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-300"
                    title="Ricomincia"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
             </div>
             
             {error && (
               <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <span>{error}</span>
               </div>
             )}
          </div>

          {/* Canvas Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Original */}
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-square flex items-center justify-center">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-300 border border-white/10 z-10">
                Originale
              </div>
              <img 
                src={originalImage.data} 
                alt="Original" 
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Generated */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-square flex items-center justify-center">
              <div className="absolute top-4 left-4 bg-brand-accent/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-accent border border-brand-accent/30 z-10">
                AI Gemini Modificata
              </div>
              
              {status === AppStatus.PROCESSING ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 text-sm font-medium">L'intelligenza artificiale sta lavorando...</p>
                </div>
              ) : generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={downloadImage}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Scarica Immagine
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>L'immagine modificata apparirà qui</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
