
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateBrandIdentity, BrandIdentityResult } from '../services/geminiService';
import { 
  Download, Sparkles, ArrowRight, Palette, Camera, Code, Music, 
  Trash2, PenTool, RefreshCw, Layers, 
  Gift, Snowflake, Trees, Star, Eye, EyeOff, Plus, Minus,
  Briefcase, Heart, Gamepad, ShoppingCart, Leaf,
  Utensils, Zap, Crown, FolderPlus, Save, ChevronDown, Folder,
  PartyPopper, Flame, Coffee, Rocket, HeartHandshake
} from 'lucide-react';

// Icone base disponibili per il sistema
const BASE_ICONS: Record<string, { component: React.ReactNode, label: string }> = {
  'palette': { component: <Palette />, label: 'Arte' },
  'camera': { component: <Camera />, label: 'Foto' },
  'music': { component: <Music />, label: 'Musica' },
  'gamepad': { component: <Gamepad />, label: 'Gaming' },
  'code': { component: <Code />, label: 'Dev' },
  'briefcase': { component: <Briefcase />, label: 'Lavoro' },
  'shopping-cart': { component: <ShoppingCart />, label: 'Shop' },
  'utensils': { component: <Utensils />, label: 'Food' },
  'star': { component: <Star />, label: 'Stella' },
  'heart': { component: <Heart />, label: 'Love' },
  'zap': { component: <Zap />, label: 'Power' },
  'crown': { component: <Crown />, label: 'King' },
  'santa-hat': { component: <div className="text-xl">🎅</div>, label: 'Babbo' },
  'snowflake': { component: <Snowflake />, label: 'Neve' },
  'gift': { component: <Gift />, label: 'Regalo' },
  'tree': { component: <Trees />, label: 'Albero' },
  'party': { component: <PartyPopper />, label: 'Festa' },
  'flame': { component: <Flame />, label: 'Hot' },
  'coffee': { component: <Coffee />, label: 'Break' },
  'rocket': { component: <Rocket />, label: 'Lancio' },
  'leaf': { component: <Leaf />, label: 'Bio' },
  'wedding': { component: <HeartHandshake />, label: 'Wedding' },
};

const DEFAULT_CATEGORIES = [
  { name: 'Creativi', icons: ['palette', 'camera', 'music', 'gamepad'] },
  { name: 'Business', icons: ['code', 'briefcase', 'shopping-cart', 'utensils'] },
  { name: 'Simboli', icons: ['star', 'heart', 'zap', 'crown', 'leaf', 'rocket', 'flame'] },
  { name: 'Natale', icons: ['santa-hat', 'snowflake', 'gift', 'tree'] },
];

const SEPARATOR_OPTIONS = ['+', '&', 'AND', 'and', 'E', 'e', 'with', 'x', 'vs', '•'];

const FONT_OPTIONS = [
  { id: 'orbitron', label: 'Orbitron', family: '"Orbitron", sans-serif' },
  { id: 'anton', label: 'Anton', family: '"Anton", sans-serif' },
  { id: 'playfair', label: 'Playfair', family: '"Playfair Display", serif' },
  { id: 'montserrat', label: 'Montserrat', family: '"Montserrat", sans-serif' },
  { id: 'lobster', label: 'Lobster', family: '"Lobster", cursive' },
];

const NEON_COLORS = ['#00f260', '#0575E6', '#f20060', '#f2f200', '#00f2f2', '#f200f2', '#ffffff', '#ffa500'];

const BG_PRESETS = [
  { name: 'Midnight', hex: '#0f0c29', theme: 'dark' },
  { name: 'Studio', hex: '#302b63', theme: 'dark' },
  { name: 'Slate', hex: '#24243e', theme: 'dark' },
  { name: 'White', hex: '#ffffff', theme: 'light' },
];

interface CustomCategory {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  subtitle: string;
}

export const BrandKit: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [appDescription, setAppDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewBg, setPreviewBg] = useState('#0f0c29');
  const [brandName1, setBrandName1] = useState('SEK');
  const [brandName2, setBrandName2] = useState('COMIX');
  const [showSeparator, setShowSeparator] = useState(true);
  const [currentSeparator, setCurrentSeparator] = useState('+');
  const [showMainIcon, setShowMainIcon] = useState(true);
  const [selectedFont, setSelectedFont] = useState<any>('orbitron');
  const [logoTheme, setLogoTheme] = useState<'dark' | 'light'>('dark');
  const [pixelSize, setPixelSize] = useState(1200);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [downloadSize, setDownloadSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  const [currentIdentity, setCurrentIdentity] = useState<BrandIdentityResult>({
    iconKey: 'palette',
    colorHex: '#00f260',
    subtitle: 'STUDIO'
  });

  useEffect(() => {
    const stored = localStorage.getItem('sek_studio_custom_cats_v3');
    if (stored) setCustomCategories(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (downloadSize === 'sm') setPixelSize(600);
    if (downloadSize === 'md') setPixelSize(1200);
    if (downloadSize === 'lg') setPixelSize(2400);
    if (downloadSize === 'xl') setPixelSize(4000);
  }, [downloadSize]);

  const saveCurrentAsCategory = () => {
    const newCat: CustomCategory = {
      id: Date.now().toString(),
      name: currentIdentity.subtitle || 'MIA CAT',
      iconKey: currentIdentity.iconKey,
      color: currentIdentity.colorHex,
      subtitle: currentIdentity.subtitle
    };
    const updated = [newCat, ...customCategories];
    setCustomCategories(updated);
    localStorage.setItem('sek_studio_custom_cats_v3', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = customCategories.filter(c => c.id !== id);
    setCustomCategories(updated);
    localStorage.setItem('sek_studio_custom_cats_v3', JSON.stringify(updated));
  };

  const applyCategory = (cat: CustomCategory) => {
    setCurrentIdentity({
      iconKey: cat.iconKey,
      colorHex: cat.color,
      subtitle: cat.subtitle
    });
  };

  const handleAiGenerate = async () => {
    if (!appDescription.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await generateBrandIdentity(appDescription);
      setCurrentIdentity(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadLogo = async () => {
    setDownloadStatus('generating');
    await new Promise(r => setTimeout(r, 600));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseW = 1200;
    const baseH = 500;
    const multiplier = pixelSize / baseW;
    canvas.width = pixelSize;
    canvas.height = Math.round(baseH * multiplier);
    ctx.scale(multiplier, multiplier);

    ctx.fillStyle = logoTheme === 'dark' ? previewBg : '#ffffff';
    ctx.fillRect(0, 0, baseW, baseH);

    const activeFont = FONT_OPTIONS.find(f => f.id === selectedFont)?.family || 'sans-serif';
    const baseFill = logoTheme === 'dark' ? '#ffffff' : '#0f0c29';
    const accent = currentIdentity.colorHex;

    // Disegno Icona Placeholder (Canvas semplice)
    if (showMainIcon) {
       ctx.font = '80px Arial';
       ctx.fillStyle = accent;
       ctx.textAlign = 'center';
       ctx.fillText("✦", 150, 260);
    }

    ctx.font = `900 100px ${activeFont}`;
    ctx.fillStyle = baseFill;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(brandName1, 300, 250);
    let xOffset = 300 + ctx.measureText(brandName1).width + 20;

    if (showSeparator) {
      ctx.fillStyle = accent;
      ctx.fillText(currentSeparator, xOffset, 250);
      xOffset += ctx.measureText(currentSeparator).width + 20;
    }

    const grad = ctx.createLinearGradient(xOffset, 0, xOffset + 300, 0);
    grad.addColorStop(0, accent);
    grad.addColorStop(1, '#0575E6');
    ctx.fillStyle = grad;
    ctx.fillText(brandName2, xOffset, 250);

    const link = document.createElement('a');
    link.download = `SekStudio-${pixelSize}px.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloadStatus('done');
    setTimeout(() => setDownloadStatus('idle'), 2000);
  };

  const currentHeight = Math.round(pixelSize * (500 / 1200));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL SINISTRO */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI CREATOR */}
          <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative group">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-brand-accent italic">
              <Sparkles size={20} /> AI BRAND CREATOR
            </h2>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={appDescription} 
                onChange={(e) => setAppDescription(e.target.value)} 
                placeholder="Es: Matrimonio, Ricette, Viaggi..." 
                className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-brand-accent" 
              />
              <button 
                onClick={handleAiGenerate} 
                disabled={isAiLoading} 
                className="bg-brand-accent text-black px-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {isAiLoading ? <RefreshCw className="animate-spin" /> : <ArrowRight />}
              </button>
            </div>
            
            {appDescription && (
              <button 
                onClick={saveCurrentAsCategory}
                className="w-full py-2 bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all text-brand-accent"
              >
                <FolderPlus size={14} /> Salva nei preferiti
              </button>
            )}
          </div>

          {/* EDITOR */}
          <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="font-black text-sm flex items-center gap-2 text-gray-400 uppercase tracking-widest italic"><PenTool size={18} /> Strumenti Logo</h3>
            
            <div className="space-y-3">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Nomi & Separatore</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={brandName1} 
                  onChange={(e) => setBrandName1(e.target.value.toUpperCase())} 
                  className="w-1/3 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-black text-center" 
                />
                
                <div className="flex flex-1 gap-1 items-center bg-black/20 p-1 rounded-xl border border-white/5 relative">
                  <button 
                    onClick={() => setShowSeparator(!showSeparator)} 
                    className={`p-2 rounded-lg transition-all ${showSeparator ? 'bg-brand-accent text-black' : 'text-gray-600'}`}
                  >
                    {showSeparator ? <Plus size={18} strokeWidth={3}/> : <Minus size={18}/>}
                  </button>
                  <select 
                    value={currentSeparator} 
                    onChange={(e) => {
                      setCurrentSeparator(e.target.value);
                      setShowSeparator(true);
                    }}
                    className="flex-1 bg-transparent text-brand-accent text-center font-black text-lg appearance-none cursor-pointer outline-none"
                  >
                    {SEPARATOR_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#1a1638]">{opt}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                </div>

                <input 
                  type="text" 
                  value={brandName2} 
                  onChange={(e) => setBrandName2(e.target.value.toUpperCase())} 
                  className="w-1/3 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-black text-center" 
                />
              </div>
            </div>

            {/* CATEGORIE DINAMICHE */}
            <div className="space-y-6 pt-4 border-t border-white/5 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
              
              {customCategories.length > 0 && (
                <div className="space-y-3">
                   <span className="text-[9px] text-brand-accent font-black uppercase tracking-widest flex items-center gap-2 italic">
                     <Folder size={12}/> Mie Categorie Salvate
                   </span>
                   <div className="grid grid-cols-2 gap-2">
                     {customCategories.map(cat => (
                       <div key={cat.id} className="relative group/cat">
                         <button 
                           onClick={() => applyCategory(cat)}
                           className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${currentIdentity.subtitle === cat.subtitle ? 'border-brand-accent bg-brand-accent/10 shadow-lg' : 'border-white/5 bg-black/40 hover:bg-black/60'}`}
                         >
                           <div style={{ color: cat.color }}>
                             {React.cloneElement((BASE_ICONS[cat.iconKey] || BASE_ICONS['palette']).component as any, { size: 16 })}
                           </div>
                           <span className="text-[10px] font-black uppercase truncate">{cat.name}</span>
                         </button>
                         <button 
                           onClick={() => deleteCategory(cat.id)}
                           className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover/cat:opacity-100 transition-opacity hover:scale-110 shadow-md"
                         >
                           <Trash2 size={10}/>
                         </button>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {DEFAULT_CATEGORIES.map(cat => (
                <div key={cat.name} className="space-y-2">
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{cat.name}</span>
                  <div className="grid grid-cols-4 gap-2">
                    {cat.icons.map(key => (
                      <button 
                        key={key} 
                        onClick={() => setCurrentIdentity({...currentIdentity, iconKey: key})} 
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all ${currentIdentity.iconKey === key ? 'border-brand-accent bg-brand-accent/20 scale-105 shadow-md' : 'border-white/5 bg-black/20 hover:bg-black/40'}`}
                      >
                        <div className={currentIdentity.iconKey === key ? 'text-brand-accent' : 'text-gray-500'}>
                          {React.cloneElement(BASE_ICONS[key].component as any, { size: 18 })}
                        </div>
                        <span className="text-[7px] mt-1 opacity-40 font-bold uppercase">{BASE_ICONS[key].label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 uppercase font-black">Carattere</label>
                <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-[10px] text-white">
                  {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 uppercase font-black">Visibilità Icona</label>
                <button onClick={() => setShowMainIcon(!showMainIcon)} className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${showMainIcon ? 'border-brand-accent text-brand-accent' : 'border-white/10 text-gray-600'}`}>
                   {showMainIcon ? <Eye size={14}/> : <EyeOff size={14}/>}
                   <span className="text-[9px] font-bold">ICON</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Colore Brand Neon</label>
              <div className="flex flex-wrap gap-2">
                {NEON_COLORS.map(color => (
                  <button key={color} onClick={() => setCurrentIdentity({...currentIdentity, colorHex: color})} className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${currentIdentity.colorHex === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW AREA */}
        <div className="lg:col-span-8 space-y-6">
          <div className="w-full aspect-[12/5] rounded-[2.5rem] border-2 border-dashed border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center transition-all duration-700 group" style={{ backgroundColor: previewBg }}>
            
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-50 bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[7px] text-gray-500 font-black text-center uppercase">Contrasto</span>
               {BG_PRESETS.map(bg => (
                 <button key={bg.hex} onClick={() => {setPreviewBg(bg.hex); setLogoTheme(bg.theme as any)}} className={`w-8 h-8 rounded-xl border-2 transition-all ${previewBg === bg.hex ? 'border-brand-accent scale-105 shadow-xl' : 'border-white/10 opacity-40 hover:opacity-100'}`} style={{ backgroundColor: bg.hex }} />
               ))}
            </div>

            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              <div className="transform scale-[0.8] md:scale-100 transition-transform duration-500">
                <BrandLogo 
                  size="xl" 
                  showIcon={showMainIcon}
                  customIcon={BASE_ICONS[currentIdentity.iconKey]?.component}
                  customColor={currentIdentity.colorHex}
                  subtitle={currentIdentity.subtitle}
                  theme={logoTheme} 
                  text1={brandName1} 
                  text2={brandName2}
                  showSeparator={showSeparator} 
                  font={selectedFont}
                  separatorText={currentSeparator} 
                />
              </div>
            </div>

            <div className="absolute top-6 right-6 px-4 py-2 bg-brand-accent/10 backdrop-blur-md rounded-full border border-brand-accent/20 flex items-center gap-2">
               <div className="w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_8px_#00f260] animate-pulse"></div>
               <span className="text-[10px] font-black text-brand-accent tracking-widest italic">PREVIEW DINAMICA</span>
            </div>
          </div>

          <div className="bg-[#1a1638]/60 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.4em] mb-2">Risoluzione Attuale</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-white font-mono font-black text-4xl">{pixelSize}</span>
                  <span className="text-brand-accent/40 text-2xl font-black italic">×</span>
                  <span className="text-white font-mono font-black text-4xl">{currentHeight}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase ml-2">Pixel</span>
                </div>
              </div>

              <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl">
                {['sm', 'md', 'lg', 'xl'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setDownloadSize(s as any)} 
                    className={`px-5 py-3 rounded-xl text-[10px] font-black transition-all ${downloadSize === s ? 'bg-brand-accent text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <input 
              type="range" 
              min="400" max="4000" step="50" 
              value={pixelSize} 
              onChange={(e) => setPixelSize(parseInt(e.target.value))} 
              className="w-full h-3 bg-black/60 rounded-lg appearance-none cursor-pointer accent-brand-accent" 
            />

            <button 
              onClick={downloadLogo} 
              disabled={downloadStatus === 'generating'} 
              className="group relative w-full px-12 py-6 bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-black rounded-3xl flex items-center justify-center gap-4 shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all text-xl overflow-hidden uppercase"
            >
              {downloadStatus === 'generating' ? (
                <><RefreshCw className="animate-spin" /> GENERAZIONE IN CORSO...</>
              ) : (
                <><Download strokeWidth={3} /> SCARICA BRAND KIT PNG HD</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
