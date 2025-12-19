
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateBrandIdentity, generateIconImage, BrandIdentityResult } from '../services/geminiService';
import { 
  Download, Sparkles, Palette, Camera, Code, Music, 
  Trash2, PenTool, RefreshCw, Eye, EyeOff,
  Briefcase, Heart, Gamepad, ShoppingCart, Leaf,
  Utensils, Zap, Crown, FolderPlus, Folder,
  Rocket, Layout, Image as ImageIcon, X, Star, Flame, Move,
  Maximize2, Plane, Dumbbell, Book, Home, Car, Type as TypeIcon
} from 'lucide-react';

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
  'leaf': { component: <Leaf />, label: 'Bio' },
  'rocket': { component: <Rocket />, label: 'Lancio' },
  'plane': { component: <Plane />, label: 'Viaggi' },
  'dumbbell': { component: <Dumbbell />, label: 'Sport' },
  'book': { component: <Book />, label: 'Libri' },
  'home': { component: <Home />, label: 'Casa' },
  'car': { component: <Car />, label: 'Auto' },
};

const PRESET_CATEGORIES = [
  { id: 'business', label: 'Business', iconKey: 'briefcase', color: '#00f260', sub: 'CORPORATE' },
  { id: 'travel', label: 'Viaggi', iconKey: 'plane', color: '#0575E6', sub: 'EXPLORE' },
  { id: 'gaming', label: 'Giochi', iconKey: 'gamepad', color: '#f20060', sub: 'LEVEL UP' },
  { id: 'food', label: 'Cibo', iconKey: 'utensils', color: '#ffa500', sub: 'GOURMET' },
  { id: 'art', label: 'Arte', iconKey: 'palette', color: '#f200f2', sub: 'CREATIVE' },
  { id: 'sport', label: 'Sport', iconKey: 'dumbbell', color: '#00f2f2', sub: 'FITNESS' },
];

const STICKER_LIST = [
  { id: 'sparkles', icon: <Sparkles size={16} /> },
  { id: 'flame', icon: <Flame size={16} /> },
  { id: 'zap', icon: <Zap size={16} /> },
  { id: 'star', icon: <Star size={16} /> },
  { id: 'heart', icon: <Heart size={16} /> },
  { id: 'rocket', icon: <Rocket size={16} /> },
];

const SEPARATOR_OPTIONS = ['+', '&', 'AND', 'and', 'E', 'e', 'with', 'x', 'vs', '•'];
const FONT_OPTIONS = [
  { id: 'orbitron', label: 'Orbitron (Tech)', family: '"Orbitron", sans-serif' },
  { id: 'anton', label: 'Anton (Impact)', family: '"Anton", sans-serif' },
  { id: 'playfair', label: 'Playfair (Elegante)', family: '"Playfair Display", serif' },
  { id: 'montserrat', label: 'Montserrat (Modern)', family: '"Montserrat", sans-serif' },
  { id: 'lobster', label: 'Lobster (Script)', family: '"Lobster", cursive' },
];
const NEON_COLORS = ['#00f260', '#0575E6', '#f20060', '#f2f200', '#00f2f2', '#f200f2', '#ffffff', '#ffa500'];
const BG_PRESETS = [
  { name: 'Midnight', hex: '#0f0c29', theme: 'dark' },
  { name: 'Studio', hex: '#302b63', theme: 'dark' },
  { name: 'White', hex: '#ffffff', theme: 'light' },
];

interface CustomCategory {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  subtitle: string;
  customImage?: string | null;
}

export const BrandKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'showroom' | 'saved'>('editor');
  const [showroomType, setShowroomType] = useState<'neon' | 'totem' | 'card'>('neon');
  const [previewBg, setPreviewBg] = useState('#0f0c29');
  const [logoTheme, setLogoTheme] = useState<'dark' | 'light'>('dark');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  
  const [iconPrompt, setIconPrompt] = useState('');
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  const [brandName1, setBrandName1] = useState('SEK');
  const [brandName2, setBrandName2] = useState('COMIX');
  
  const [showSeparator, setShowSeparator] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [stickerPos, setStickerPos] = useState({ x: -120, y: -40, scale: 2.0 });
  
  const [currentSeparator, setCurrentSeparator] = useState('+');
  const [selectedFont, setSelectedFont] = useState<any>('orbitron');
  const [pixelSize, setPixelSize] = useState(1200);
  const [iconScale, setIconScale] = useState(1);
  const [downloadSize, setDownloadSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [currentIdentity, setCurrentIdentity] = useState<BrandIdentityResult>({
    iconKey: 'palette',
    colorHex: '#00f260',
    subtitle: 'STUDIO'
  });

  useEffect(() => {
    const stored = localStorage.getItem('sek_studio_custom_cats_v7');
    if (stored) setCustomCategories(JSON.parse(stored));
  }, []);

  const setSizePreset = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setDownloadSize(size);
    const mapping = { sm: 800, md: 1200, lg: 2400, xl: 4000 };
    setPixelSize(mapping[size]);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setPixelSize(val);
    if (val < 1000) setDownloadSize('sm');
    else if (val < 2000) setDownloadSize('md');
    else if (val < 3500) setDownloadSize('lg');
    else setDownloadSize('xl');
  };

  const applyPreset = (preset: typeof PRESET_CATEGORIES[0]) => {
    setCurrentIdentity({
      iconKey: preset.iconKey,
      colorHex: preset.color,
      subtitle: preset.sub
    });
    setCustomImageSrc(null);
  };

  const saveCurrentAsCategory = () => {
    const newCat: CustomCategory = {
      id: Date.now().toString(),
      name: currentIdentity.subtitle || 'PROGETTO',
      iconKey: currentIdentity.iconKey,
      color: currentIdentity.colorHex,
      subtitle: currentIdentity.subtitle,
      customImage: customImageSrc
    };
    const updated = [newCat, ...customCategories];
    setCustomCategories(updated);
    localStorage.setItem('sek_studio_custom_cats_v7', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = customCategories.filter(c => c.id !== id);
    setCustomCategories(updated);
    localStorage.setItem('sek_studio_custom_cats_v7', JSON.stringify(updated));
  };

  const handleIconGenerate = async () => {
    if (!iconPrompt.trim()) return;
    setIsGeneratingIcon(true);
    try {
      const img = await generateIconImage(iconPrompt);
      setCustomImageSrc(img);
      setShowIcon(true);
    } catch (e) { console.error(e); }
    finally { setIsGeneratingIcon(false); }
  };

  const downloadLogo = async () => {
    setDownloadStatus('generating');
    await new Promise(r => setTimeout(r, 1500));
    setDownloadStatus('done');
    setTimeout(() => setDownloadStatus('idle'), 2000);
  };

  const currentHeight = Math.round(pixelSize * (500 / 1200));
  const dynamicPreviewScale = activeTab === 'editor' ? (pixelSize / 1200) : 1;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AREA PREVIEW DINAMICA */}
        <div className="lg:col-span-8 lg:order-2 space-y-4">
          <div className={`relative w-full aspect-[12/6] md:aspect-[12-5] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center border-2 border-white/5 transition-all duration-700 ${activeTab === 'showroom' ? 'bg-black' : ''}`}
            style={{ backgroundColor: activeTab !== 'showroom' ? previewBg : undefined }}>
            
            {activeTab === 'showroom' ? (
               <div className="w-full h-full flex items-center justify-center p-8 overflow-hidden transition-all duration-500">
                  {showroomType === 'neon' && (
                    <div className="relative animate-pulse flex items-center justify-center scale-75 md:scale-100">
                       <div className="absolute inset-0 blur-[120px] opacity-40 scale-150" style={{ background: currentIdentity.colorHex }}></div>
                       <BrandLogo 
                          size="xl" 
                          customIcon={BASE_ICONS[currentIdentity.iconKey]?.component} 
                          customImageSrc={customImageSrc}
                          customColor={currentIdentity.colorHex} 
                          subtitle={currentIdentity.subtitle} 
                          showSubtitle={showSubtitle}
                          text1={brandName1} text2={brandName2} 
                          showSeparator={showSeparator} showIcon={showIcon}
                          font={selectedFont} separatorText={currentSeparator}
                          theme="dark" iconScale={iconScale} sticker={selectedSticker}
                          stickerConfig={stickerPos}
                          className="drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                       />
                    </div>
                  )}
                  {showroomType === 'card' && (
                    <div className="w-[450px] aspect-[1.6/1] bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden group scale-90 md:scale-100 transition-transform">
                       <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                       <BrandLogo 
                          size="md" 
                          customIcon={BASE_ICONS[currentIdentity.iconKey]?.component} 
                          customImageSrc={customImageSrc}
                          customColor={currentIdentity.colorHex} 
                          subtitle={currentIdentity.subtitle} 
                          showSubtitle={showSubtitle}
                          text1={brandName1} text2={brandName2} 
                          showSeparator={showSeparator} showIcon={showIcon}
                          font={selectedFont} separatorText={currentSeparator}
                          theme="dark" iconScale={iconScale} sticker={selectedSticker}
                          stickerConfig={stickerPos}
                       />
                    </div>
                  )}
                  {showroomType === 'totem' && (
                    <div className="h-full aspect-[9/16] bg-[#111] border-x border-white/10 flex flex-col items-center justify-center gap-12 p-12 transition-all">
                       <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30 shadow-[0_0_15px_rgba(0,242,96,0.3)]"></div>
                       <BrandLogo 
                          size="lg" 
                          customIcon={BASE_ICONS[currentIdentity.iconKey]?.component} 
                          customImageSrc={customImageSrc}
                          customColor={currentIdentity.colorHex} 
                          subtitle={currentIdentity.subtitle} 
                          showSubtitle={showSubtitle}
                          text1={brandName1} text2={brandName2} 
                          showSeparator={showSeparator} showIcon={showIcon}
                          font={selectedFont} separatorText={currentSeparator}
                          theme="dark" iconScale={iconScale} sticker={selectedSticker}
                          stickerConfig={stickerPos}
                       />
                       <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-30 shadow-[0_0_15px_rgba(0,242,96,0.3)]"></div>
                    </div>
                  )}
               </div>
            ) : (
              <div 
                className="transition-transform duration-150 ease-out" 
                style={{ transform: `scale(${dynamicPreviewScale})` }}
              >
                <BrandLogo 
                  size={downloadSize} 
                  customIcon={BASE_ICONS[currentIdentity.iconKey]?.component} 
                  customImageSrc={customImageSrc}
                  customColor={currentIdentity.colorHex} 
                  subtitle={currentIdentity.subtitle} 
                  showSubtitle={showSubtitle}
                  text1={brandName1} 
                  text2={brandName2} 
                  showSeparator={showSeparator} 
                  showIcon={showIcon}
                  font={selectedFont} 
                  separatorText={currentSeparator} 
                  theme={logoTheme} 
                  iconScale={iconScale} 
                  sticker={selectedSticker}
                  stickerConfig={stickerPos}
                />
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="absolute top-6 left-6 flex flex-col gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 opacity-60 hover:opacity-100 transition-all z-30">
                {BG_PRESETS.map(bg => (
                  <button key={bg.hex} onClick={() => {setPreviewBg(bg.hex); setLogoTheme(bg.theme as any)}} 
                    className={`w-8 h-8 rounded-lg border-2 ${previewBg === bg.hex ? 'border-brand-accent' : 'border-transparent'}`} 
                    style={{ backgroundColor: bg.hex }} />
                ))}
              </div>
            )}
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex bg-[#1a1638] p-2 rounded-3xl border border-white/10 shadow-xl">
            <button onClick={() => setActiveTab('editor')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-brand-accent text-black' : 'text-gray-400'}`}><PenTool size={18}/> Editor</button>
            <button onClick={() => setActiveTab('showroom')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'showroom' ? 'bg-brand-accent2 text-white' : 'text-gray-400'}`}><Layout size={18}/> Showroom</button>
            <button onClick={() => setActiveTab('saved')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><Folder size={18}/> Archivio</button>
          </div>

          {/* RISOLUZIONE */}
          <div className="bg-[#1a1638]/60 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] text-brand-accent uppercase font-black tracking-widest mb-1">Dimensione Output</p>
                   <p className="text-4xl font-mono font-black italic transition-all duration-300">
                     {pixelSize} <span className="text-sm opacity-40 font-sans tracking-normal">x</span> {currentHeight}
                   </p>
                </div>
                <div className="flex gap-1">
                   {['sm', 'md', 'lg', 'xl'].map((s: any) => 
                    <button key={s} 
                      onClick={() => setSizePreset(s)} 
                      className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${downloadSize === s ? 'bg-brand-accent text-black scale-110 shadow-lg shadow-brand-accent/20' : 'bg-black/20 text-gray-500 hover:text-white'}`}
                    >
                      {s.toUpperCase()}
                    </button>
                   )}
                </div>
             </div>
             <input type="range" min="400" max="4000" step="10" value={pixelSize} onChange={handleRangeChange} className="w-full h-2 accent-brand-accent bg-black/40 rounded-lg appearance-none cursor-pointer" />
             <button onClick={downloadLogo} className="w-full py-5 bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.01] transition-all flex items-center justify-center gap-3 shadow-xl">
                {downloadStatus === 'generating' ? <RefreshCw className="animate-spin"/> : <Download/>} Scarica Kit Immagine
             </button>
          </div>
        </div>

        {/* SIDEBAR EDITOR */}
        <div className="lg:col-span-4 lg:order-1 space-y-6 overflow-y-auto max-h-[1000px] pr-2 no-scrollbar">
          {activeTab === 'editor' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* CATEGORIE PREDEFINITE */}
              <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl">
                <h2 className="text-[10px] font-black mb-5 flex items-center gap-2 text-brand-accent italic tracking-widest uppercase"><Folder size={16} /> Categorie Preset</h2>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_CATEGORIES.map(preset => (
                    <button key={preset.id} onClick={() => applyPreset(preset)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${currentIdentity.subtitle === preset.sub ? 'border-brand-accent bg-brand-accent/10 scale-105' : 'border-white/5 bg-black/20 opacity-60 hover:opacity-100'}`}>
                      <div style={{ color: preset.color }}>{React.cloneElement(BASE_ICONS[preset.iconKey].component as any, { size: 20 })}</div>
                      <span className="text-[8px] font-black uppercase text-center leading-tight">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI ICON STUDIO */}
              <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl hover:border-brand-accent/20 transition-all">
                <h2 className="text-[10px] font-black mb-5 flex items-center gap-2 text-brand-accent italic tracking-widest uppercase"><ImageIcon size={16} /> AI Icon Generator</h2>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" value={iconPrompt} onChange={(e) => setIconPrompt(e.target.value)} placeholder="Descrivi il brand..." className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-accent transition-all" />
                    <button onClick={handleIconGenerate} disabled={isGeneratingIcon} className="bg-brand-accent text-black px-4 rounded-xl hover:scale-105 transition-all shadow-lg">
                      {isGeneratingIcon ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                    </button>
                  </div>
                </div>
              </div>

              {/* STICKERS */}
              <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-[10px] font-black flex items-center gap-2 text-yellow-400 italic tracking-widest uppercase"><Star size={16} /> Stickers</h2>
                  {selectedSticker && (
                    <button onClick={() => setSelectedSticker(null)} className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1 hover:scale-105 transition-all">
                      <Trash2 size={12}/> Rimuovi
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {STICKER_LIST.map(stk => (
                    <button key={stk.id} onClick={() => setSelectedSticker(stk.id)} className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${selectedSticker === stk.id ? 'border-brand-accent bg-brand-accent/20 text-brand-accent scale-110' : 'border-white/5 bg-black/20 text-gray-500 hover:text-white'}`}>{stk.icon}</button>
                  ))}
                </div>

                {selectedSticker && (
                  <div className="space-y-4 pt-4 border-t border-white/5 animate-fade-in">
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                        <span className="flex items-center gap-1"><Move size={10}/> Orizzontale (X)</span>
                        <span className="text-yellow-400">{stickerPos.x}px</span>
                      </div>
                      <input type="range" min="-250" max="250" value={stickerPos.x} onChange={(e) => setStickerPos({...stickerPos, x: parseInt(e.target.value)})} className="w-full h-1.5 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                        <span className="flex items-center gap-1"><Move size={10}/> Verticale (Y)</span>
                        <span className="text-yellow-400">{stickerPos.y}px</span>
                      </div>
                      <input type="range" min="-150" max="150" value={stickerPos.y} onChange={(e) => setStickerPos({...stickerPos, y: parseInt(e.target.value)})} className="w-full h-1.5 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                        <span className="flex items-center gap-1"><Maximize2 size={10}/> Scala Sticker</span>
                        <span className="text-yellow-400">{Math.round(stickerPos.scale * 100)}%</span>
                      </div>
                      <input type="range" min="0.5" max="4.5" step="0.1" value={stickerPos.scale} onChange={(e) => setStickerPos({...stickerPos, scale: parseFloat(e.target.value)})} className="w-full h-1.5 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>

              {/* CONTROLLI UI */}
              <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Controlli UI</label>
                    <div className="flex gap-2">
                       <button onClick={() => setShowIcon(!showIcon)} className={`p-2.5 rounded-xl transition-all ${showIcon ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-black/40 text-gray-600'}`}>{showIcon ? <ImageIcon size={18}/> : <X size={18}/>}</button>
                       <button onClick={() => setShowSeparator(!showSeparator)} className={`p-2.5 rounded-xl transition-all ${showSeparator ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-black/40 text-gray-600'}`}>{showSeparator ? <Eye size={18}/> : <EyeOff size={18}/>}</button>
                       <button onClick={() => setShowSubtitle(!showSubtitle)} className={`p-2.5 rounded-xl transition-all ${showSubtitle ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-black/40 text-gray-600'}`}>{showSubtitle ? <TypeIcon size={18}/> : <X size={18}/>}</button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-500 uppercase font-black">Testo Brand</label>
                    <div className="flex gap-2">
                      <input type="text" value={brandName1} onChange={(e) => setBrandName1(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-sm outline-none focus:border-brand-accent transition-all" />
                      {showSeparator && (
                        <select value={currentSeparator} onChange={(e) => setCurrentSeparator(e.target.value)} className="bg-black/40 text-brand-accent font-black rounded-xl px-2 outline-none border border-white/10">
                          {SEPARATOR_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#1a1638]">{opt}</option>)}
                        </select>
                      )}
                      <input type="text" value={brandName2} onChange={(e) => setBrandName2(e.target.value.toUpperCase())} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-sm outline-none focus:border-brand-accent transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] text-gray-500 uppercase font-black">Sottotitolo Personalizzato</label>
                    <input type="text" value={currentIdentity.subtitle} onChange={(e) => setCurrentIdentity({...currentIdentity, subtitle: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-xs text-brand-accent outline-none focus:border-brand-accent transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Tipografia</label>
                  <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-brand-accent outline-none hover:border-brand-accent/30 transition-all">
                    {FONT_OPTIONS.map(f => <option key={f.id} value={f.id} className="bg-[#1a1638] text-white">{f.label}</option>)}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-brand-accent">Scala Icona</label>
                  <input type="range" min="0.3" max="2.5" step="0.1" value={iconScale} onChange={(e) => setIconScale(parseFloat(e.target.value))} className="w-full h-1.5 accent-brand-accent bg-black/60 rounded-full appearance-none cursor-pointer" />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Colorazione Neon</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {NEON_COLORS.map(color => (
                      <button key={color} onClick={() => setCurrentIdentity({...currentIdentity, colorHex: color})} className={`shrink-0 w-8 h-8 rounded-full border-2 transition-all ${currentIdentity.colorHex === color ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <button onClick={saveCurrentAsCategory} className="w-full py-4 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-accent/20 transition-all"><FolderPlus size={16}/> Salva Kit in Archivio</button>
              </div>
            </div>
          )}

          {activeTab === 'showroom' && (
            <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 animate-fade-in">
              <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2"><Layout size={16}/> Vetrina Espositiva</h3>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setShowroomType('neon')} className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${showroomType === 'neon' ? 'bg-brand-accent/20 border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10' : 'bg-black/20 border-white/5 text-gray-400 hover:text-white hover:bg-black/40'}`}>
                   <div>
                     <span className="text-xs font-black uppercase tracking-widest block">Insegna Neon</span>
                     <span className="text-[9px] opacity-60 uppercase">Effetto Glow Ambientale</span>
                   </div>
                   <Zap size={20}/>
                </button>
                <button onClick={() => setShowroomType('card')} className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${showroomType === 'card' ? 'bg-brand-accent2/20 border-brand-accent2 text-brand-accent2 shadow-lg shadow-brand-accent2/10' : 'bg-black/20 border-white/5 text-gray-400 hover:text-white hover:bg-black/40'}`}>
                   <div>
                     <span className="text-xs font-black uppercase tracking-widest block">Business Card</span>
                     <span className="text-[9px] opacity-60 uppercase">Minimal Glassmorphism</span>
                   </div>
                   <Palette size={20}/>
                </button>
                <button onClick={() => setShowroomType('totem')} className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${showroomType === 'totem' ? 'bg-purple-600/20 border-purple-600 text-purple-600 shadow-lg shadow-purple-600/10' : 'bg-black/20 border-white/5 text-gray-400 hover:text-white hover:bg-black/40'}`}>
                   <div>
                     <span className="text-xs font-black uppercase tracking-widest block">Splash / Totem</span>
                     <span className="text-[9px] opacity-60 uppercase">Layout Verticale Full</span>
                   </div>
                   <Layout size={20}/>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl min-h-[500px] animate-fade-in">
                <h3 className="font-black text-[10px] text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Folder size={16}/> I Tuoi Progetti Salvati</h3>
                <div className="grid grid-cols-1 gap-3">
                  {customCategories.length === 0 ? (
                    <div className="text-center py-20 opacity-30 italic text-xs uppercase font-black">Nessun progetto salvato</div>
                  ) : (
                    customCategories.map(cat => (
                      <div key={cat.id} className="group bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-brand-accent/30 hover:bg-black/60 transition-all shadow-md">
                        <button onClick={() => {
                          setCurrentIdentity({iconKey: cat.iconKey, colorHex: cat.color, subtitle: cat.subtitle});
                          setCustomImageSrc(cat.customImage || null);
                          setActiveTab('editor');
                        }} className="flex items-center gap-4 text-left flex-1">
                          <div className="p-2 bg-white/5 rounded-xl transition-all group-hover:scale-110" style={{ color: cat.color }}>
                            {cat.customImage ? <img src={cat.customImage} className="w-10 h-10 rounded-lg object-cover shadow-lg border border-white/10" /> : React.cloneElement((BASE_ICONS[cat.iconKey] || BASE_ICONS['palette']).component as any, { size: 28 })}
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{cat.name}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">{cat.subtitle}</p>
                          </div>
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-600 hover:text-red-500 transition-all opacity-40 group-hover:opacity-100"><Trash2 size={20}/></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
