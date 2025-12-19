
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateIconImage } from '../services/geminiService';
import { 
  Download, Sparkles, Palette, Camera, Code, Music, 
  Trash2, PenTool, RefreshCw, Briefcase, Heart, Gamepad, 
  ShoppingCart, Leaf, Utensils, Zap, Crown, FolderPlus, Folder,
  Rocket, Layout, Image as ImageIcon, Star, Flame, Plane, 
  Dumbbell, Book, Home, Car, ChevronDown, ChevronRight, 
  Settings2, Fingerprint, Monitor
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
  { id: 'business', label: 'Business / Azienda', iconKey: 'briefcase', color: '#00f260', sub: 'CORPORATE' },
  { id: 'travel', label: 'Viaggi / Esplorazione', iconKey: 'plane', color: '#0575E6', sub: 'EXPLORE' },
  { id: 'gaming', label: 'Giochi / E-Sports', iconKey: 'gamepad', color: '#f20060', sub: 'LEVEL UP' },
  { id: 'food', label: 'Cibo / Ristorazione', iconKey: 'utensils', color: '#ffa500', sub: 'GOURMET' },
  { id: 'art', label: 'Arte / Creatività', iconKey: 'palette', color: '#f200f2', sub: 'CREATIVE' },
  { id: 'sport', label: 'Sport / Fitness', iconKey: 'dumbbell', color: '#00f2f2', sub: 'FITNESS' },
  { id: 'tech', label: 'Tech / Software', iconKey: 'code', color: '#ffffff', sub: 'SYSTEM' },
];

const STICKER_LIST = [
  { id: 'sparkles', icon: <Sparkles size={16} /> },
  { id: 'flame', icon: <Flame size={16} /> },
  { id: 'zap', icon: <Zap size={16} /> },
  { id: 'star', icon: <Star size={16} /> },
  { id: 'heart', icon: <Heart size={16} /> },
  { id: 'rocket', icon: <Rocket size={16} /> },
];

const FONT_OPTIONS = [
  { id: 'orbitron', label: 'Orbitron (Tech)', family: '"Orbitron", sans-serif' },
  { id: 'anton', label: 'Anton (Impact)', family: '"Anton", sans-serif' },
  { id: 'playfair', label: 'Playfair (Elegante)', family: '"Playfair Display", serif' },
  { id: 'montserrat', label: 'Montserrat (Modern)', family: '"Montserrat", sans-serif' },
  { id: 'lobster', label: 'Lobster (Script)', family: '"Lobster", cursive' },
];

const SEPARATOR_OPTIONS = [
  '+', '&', 'and', 'AND', 'e', 'E', 'with', 'WITH', '|', '•', '★', '×', '/', '-', ':', ' '
];

const NEON_COLORS = ['#00f260', '#0575E6', '#f20060', '#f2f200', '#00f2f2', '#f200f2', '#ffffff', '#ffa500', '#808080'];

const BG_PRESETS = [
  { name: 'Midnight', hex: '#0f0c29', theme: 'dark' },
  { name: 'Studio', hex: '#302b63', theme: 'dark' },
  { name: 'Antracite', hex: '#1f2937', theme: 'dark' },
  { name: 'Grigio', hex: '#e5e7eb', theme: 'light' },
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

type SubSection = 'identity' | 'ai' | 'stickers' | 'style';

interface BrandKitProps {
  globalState: any;
  setGlobalState: React.Dispatch<React.SetStateAction<any>>;
}

export const BrandKit: React.FC<BrandKitProps> = ({ globalState, setGlobalState }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'showroom' | 'saved'>('editor');
  // MODULI CHIUSI DI DEFAULT
  const [activeSubSection, setActiveSubSection] = useState<SubSection | null>(null);
  const [showroomType, setShowroomType] = useState<'neon' | 'totem' | 'card'>('neon');
  const [previewBg, setPreviewBg] = useState('#0f0c29');
  const [logoTheme, setLogoTheme] = useState<'dark' | 'light'>('dark');
  
  const [iconPrompt, setIconPrompt] = useState('');
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [stickerPos, setStickerPos] = useState({ x: -120, y: -40, scale: 2.0 });
  
  const [pixelSize, setPixelSize] = useState(1200);
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sek_studio_custom_cats_v7');
    if (stored) setCustomCategories(JSON.parse(stored));
  }, []);

  const applyPreset = (presetId: string) => {
    setSelectedSticker(null);
    const preset = PRESET_CATEGORIES.find(p => p.id === presetId);
    if (preset) {
      setGlobalState((prev: any) => ({ 
        ...prev, 
        iconKey: preset.iconKey, 
        color: preset.color, 
        subtitle: preset.sub, 
        customImage: null,
        showIcon: true 
      }));
      return;
    }
    const custom = customCategories.find(c => c.id === presetId);
    if (custom) {
      setGlobalState((prev: any) => ({ 
        ...prev, 
        iconKey: custom.iconKey, 
        color: custom.color, 
        subtitle: custom.subtitle, 
        customImage: custom.customImage || null,
        showIcon: true
      }));
    }
  };

  const handleIconGenerate = async () => {
    if (!iconPrompt.trim()) {
      alert("Inserisci una descrizione prima di generare!");
      return;
    }
    setIsGeneratingIcon(true);
    try {
      const img = await generateIconImage(iconPrompt, globalState.color);
      const words = iconPrompt.trim().split(/\s+/);
      const derivedSub = words.length > 1 ? (words[0] + " " + words[1]).toUpperCase() : words[0].toUpperCase();
      setGlobalState((prev: any) => ({ 
        ...prev, 
        customImage: img, 
        subtitle: derivedSub.substring(0, 15),
        showIcon: true
      }));
    } catch (e: any) { 
      console.error(e);
      alert("Errore AI: " + e.message);
    } finally { 
      setIsGeneratingIcon(false); 
    }
  };

  const syncSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    setLogoSize(size);
    const pixelMap = { sm: 600, md: 1200, lg: 2400, xl: 3600 };
    setPixelSize(pixelMap[size]);
  };

  const handlePixelChange = (val: number) => {
    setPixelSize(val);
    if (val < 900) setLogoSize('sm');
    else if (val < 1800) setLogoSize('md');
    else if (val < 3000) setLogoSize('lg');
    else setLogoSize('xl');
  };

  // LOGICA DI DOWNLOAD REALE
  const downloadLogo = async () => {
    const element = document.getElementById('brand-logo-preview');
    if (!element) return;

    try {
      // Cattura il logo tramite una dataURL basata su SVG (metodo chirurgico senza librerie esterne pesanti)
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${element.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `;
      
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sek-comix-logo-${pixelSize}px.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Errore durante il download. Prova a fare uno screenshot.");
    }
  };

  const saveCurrentAsCategory = () => {
    const newCat: CustomCategory = { 
      id: `custom_${Date.now()}`, 
      name: globalState.subtitle || 'PROGETTO AI', 
      iconKey: globalState.iconKey, 
      color: globalState.color, 
      subtitle: globalState.subtitle, 
      customImage: globalState.customImage 
    };
    const updated = [newCat, ...customCategories];
    setCustomCategories(updated);
    localStorage.setItem('sek_studio_custom_cats_v7', JSON.stringify(updated));
    alert('Salvato nell\'Archivio!');
  };

  const deleteCategory = (id: string) => {
    if (confirm('Eliminare definitivamente?')) {
      const updated = customCategories.filter(c => c.id !== id);
      setCustomCategories(updated);
      localStorage.setItem('sek_studio_custom_cats_v7', JSON.stringify(updated));
    }
  };

  const getVisualScale = () => {
    if (activeTab !== 'editor') return 1;
    if (pixelSize <= 800) return 0.75;
    if (pixelSize <= 1600) return 1.0;
    if (pixelSize <= 2800) return 1.25;
    return 1.45;
  };

  const SidebarHeader = ({ title, icon: Icon, section }: { title: string, icon: any, section: SubSection }) => (
    <button 
      onClick={() => setActiveSubSection(activeSubSection === section ? null : section)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSubSection === section ? 'bg-brand-accent/20 border border-brand-accent/30 text-brand-accent' : 'bg-black/20 border border-white/5 text-gray-400 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      {activeSubSection === section ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 mt-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AREA PREVIEW */}
        <div className="lg:col-span-8 lg:order-2 space-y-4">
          <div className={`relative w-full aspect-[12/6] md:aspect-[12/5] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center border-2 border-white/5 transition-all duration-700 ${activeTab === 'showroom' ? 'bg-black' : ''}`}
            style={{ backgroundColor: activeTab !== 'showroom' ? previewBg : undefined }}>
            
            {activeTab === 'showroom' && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-3xl p-1.5 rounded-full border border-white/10 z-[200] shadow-2xl animate-fade-in ring-1 ring-white/10">
                <button onClick={() => setShowroomType('neon')} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showroomType === 'neon' ? 'bg-brand-accent text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>Vetrina</button>
                <button onClick={() => setShowroomType('totem')} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showroomType === 'totem' ? 'bg-brand-accent text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>Totem</button>
                <button onClick={() => setShowroomType('card')} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showroomType === 'card' ? 'bg-brand-accent text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>Card</button>
              </div>
            )}

            <div className={`transition-all duration-500 flex items-center justify-center 
                ${activeTab === 'showroom' && showroomType === 'totem' ? 'w-48 h-full bg-gradient-to-b from-gray-900 to-black border-x border-white/10' : ''}
                ${activeTab === 'showroom' && showroomType === 'card' ? 'w-[400px] h-[220px] bg-[#1a1638] rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden' : ''}
              `} 
              style={{ transform: activeTab === 'editor' ? `scale(${getVisualScale()})` : 'none' }}>
                
                {activeTab === 'showroom' && showroomType === 'card' && (
                  <div className="absolute top-0 right-0 p-6 opacity-20">
                    <Monitor size={80} style={{ color: globalState.color }} />
                  </div>
                )}

                <BrandLogo 
                  size={activeTab === 'showroom' ? (showroomType === 'totem' ? 'sm' : 'md') : logoSize} 
                  className={activeTab === 'showroom' && showroomType === 'totem' ? 'rotate-[-90deg]' : ''}
                  customIcon={BASE_ICONS[globalState.iconKey]?.component} 
                  customImageSrc={globalState.customImage}
                  customColor={globalState.color} 
                  subtitle={globalState.subtitle} 
                  showSubtitle={globalState.showSubtitle}
                  text1={globalState.text1} 
                  text2={globalState.text2} 
                  showSeparator={globalState.showSeparator} 
                  showIcon={globalState.showIcon}
                  font={globalState.font} 
                  separatorText={globalState.separatorText} 
                  theme={logoTheme} 
                  iconScale={globalState.iconScale} 
                  sticker={selectedSticker}
                  stickerConfig={stickerPos}
                />
            </div>

            {activeTab === 'editor' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-0 bg-black/60 backdrop-blur-3xl p-1 rounded-full border border-white/10 opacity-90 hover:opacity-100 transition-all z-30 shadow-2xl">
                <div className="flex gap-1.5 px-4 border-r border-white/10 py-2">
                  {BG_PRESETS.map(bg => (
                    <button key={bg.hex} onClick={() => {setPreviewBg(bg.hex); setLogoTheme(bg.theme as any)}} className={`w-4 h-4 rounded-full border transition-all ${previewBg === bg.hex ? 'border-brand-accent ring-2 ring-brand-accent/20 scale-110' : 'border-white/20 opacity-50 hover:opacity-100'}`} style={{ backgroundColor: bg.hex }} />
                  ))}
                </div>
                <div className="flex gap-1 px-4 border-r border-white/10 py-2">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                    <button key={s} onClick={() => syncSize(s)} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase transition-all ${logoSize === s ? 'bg-brand-accent text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{s}</button>
                  ))}
                </div>
                <div className="flex items-center gap-4 px-5 py-2">
                   <div className="flex flex-col items-center">
                      <span className="text-[6px] font-black text-white/30 uppercase tracking-widest leading-none mb-0.5">Larghezza</span>
                      <span className="text-[8px] font-mono font-bold text-brand-accent leading-none">{pixelSize}px</span>
                   </div>
                   <input type="range" min="400" max="4000" step="10" value={pixelSize} onChange={(e) => handlePixelChange(parseInt(e.target.value))} className="w-20 md:w-32 h-1 accent-brand-accent bg-white/10 rounded-full appearance-none cursor-pointer" />
                   <button 
                     onClick={downloadLogo}
                     className="ml-2 w-8 h-8 flex items-center justify-center bg-brand-accent text-black rounded-full hover:scale-110 transition-all shadow-lg active:scale-95"
                     title="Scarica Logo"
                   >
                     <Download size={14} />
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex bg-[#1a1638] p-2 rounded-3xl border border-white/10 shadow-xl">
            <button onClick={() => setActiveTab('editor')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-brand-accent text-black' : 'text-gray-400'}`}><PenTool size={18}/> Editor</button>
            <button onClick={() => setActiveTab('showroom')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'showroom' ? 'bg-brand-accent2 text-white' : 'text-gray-400'}`}><Layout size={18}/> Showroom</button>
            <button onClick={() => setActiveTab('saved')} className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><Folder size={18}/> Archivio</button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 lg:order-1 space-y-3 overflow-y-auto max-h-[850px] pr-2 no-scrollbar">
          {activeTab === 'editor' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex flex-col gap-2">
                <SidebarHeader title="Identità & Preset" icon={Fingerprint} section="identity" />
                {activeSubSection === 'identity' && (
                  <div className="bg-[#1a1638] p-5 rounded-2xl border border-white/10 space-y-5 animate-slide-up">
                    <div className="space-y-2">
                      <label className="text-[9px] text-gray-500 uppercase font-black">Preset Categoria</label>
                      <select onChange={(e) => applyPreset(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-brand-accent outline-none cursor-pointer">
                        <option value="">Scegli...</option>
                        {PRESET_CATEGORIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] text-gray-500 uppercase font-black">Icona Logo</label>
                        <button onClick={() => setGlobalState({...globalState, showIcon: !globalState.showIcon})} className={`text-[8px] font-black uppercase px-2 py-1 rounded-md transition-all ${globalState.showIcon ? 'bg-brand-accent text-black' : 'bg-red-500/20 text-red-500'}`}>{globalState.showIcon ? 'VISIBILE' : 'NASCOSTA'}</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] text-gray-500 uppercase font-black">Testi Logo</label>
                      <div className="flex gap-2">
                        <input type="text" value={globalState.text1} onChange={(e) => setGlobalState({...globalState, text1: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-sm outline-none focus:border-brand-accent" />
                        <input type="text" value={globalState.text2} onChange={(e) => setGlobalState({...globalState, text2: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-sm outline-none focus:border-brand-accent" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] text-gray-500 uppercase font-black">Separatore</label>
                        <button onClick={() => setGlobalState({...globalState, showSeparator: !globalState.showSeparator})} className={`text-[8px] font-black uppercase px-2 py-1 rounded-md transition-all ${globalState.showSeparator ? 'bg-brand-accent/20 text-brand-accent' : 'bg-red-500/20 text-red-500'}`}>{globalState.showSeparator ? 'ON' : 'OFF'}</button>
                      </div>
                      <select 
                        value={globalState.separatorText} 
                        onChange={(e) => setGlobalState({...globalState, separatorText: e.target.value, showSeparator: true})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-brand-accent outline-none cursor-pointer"
                      >
                        {SEPARATOR_OPTIONS.map(opt => (
                          <option key={opt} value={opt} className="bg-[#1a1638] text-white">
                            {opt === ' ' ? 'Spazio Vuoto' : opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] text-gray-500 uppercase font-black">Sottotitolo</label>
                        <button onClick={() => setGlobalState({...globalState, showSubtitle: !globalState.showSubtitle})} className={`text-[8px] font-black uppercase px-2 py-1 rounded-md transition-all ${globalState.showSubtitle ? 'bg-brand-accent/20 text-brand-accent' : 'bg-red-500/20 text-red-500'}`}>{globalState.showSubtitle ? 'ON' : 'OFF'}</button>
                      </div>
                      <input type="text" value={globalState.subtitle} onChange={(e) => setGlobalState({...globalState, subtitle: e.target.value.toUpperCase()})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center font-black text-xs text-brand-accent outline-none focus:border-brand-accent" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <SidebarHeader title="AI Icon Generator" icon={ImageIcon} section="ai" />
                {activeSubSection === 'ai' && (
                  <div className="bg-[#1a1638] p-5 rounded-2xl border border-white/10 space-y-4 animate-slide-up">
                    <div className="flex gap-2">
                      <input type="text" value={iconPrompt} onChange={(e) => setIconPrompt(e.target.value)} placeholder="Esempio: Drago futuristico..." className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-accent transition-all" />
                      <button onClick={handleIconGenerate} disabled={isGeneratingIcon} className="bg-brand-accent text-black px-4 rounded-xl hover:scale-105 transition-all shadow-lg min-w-[50px] flex items-center justify-center">
                        {isGeneratingIcon ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                      </button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] text-gray-500 uppercase font-black">Scala Icona</label>
                       <input type="range" min="0.3" max="2.5" step="0.1" value={globalState.iconScale} onChange={(e) => setGlobalState({...globalState, iconScale: parseFloat(e.target.value)})} className="w-full h-1.5 accent-brand-accent bg-black/60 rounded-full appearance-none cursor-pointer" />
                    </div>
                    <button onClick={saveCurrentAsCategory} className="w-full py-4 mt-2 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-accent/20 transition-all shadow-xl active:scale-95">
                      <FolderPlus size={16}/> Salva Progetto
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <SidebarHeader title="Effetti Stickers" icon={Star} section="stickers" />
                {activeSubSection === 'stickers' && (
                  <div className="bg-[#1a1638] p-5 rounded-2xl border border-white/10 space-y-6 animate-slide-up">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 flex-wrap">
                        {STICKER_LIST.map(stk => (
                          <button key={stk.id} onClick={() => setSelectedSticker(stk.id)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${selectedSticker === stk.id ? 'border-brand-accent bg-brand-accent/20 text-brand-accent scale-110 shadow-lg' : 'border-white/5 bg-black/20 text-gray-500 hover:text-white'}`}>{stk.icon}</button>
                        ))}
                      </div>
                      {selectedSticker && <button onClick={() => setSelectedSticker(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16}/></button>}
                    </div>

                    {selectedSticker && (
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase text-gray-500"><span>Posizione X</span><span className="text-yellow-400">{stickerPos.x}px</span></div>
                           <input type="range" min="-250" max="250" value={stickerPos.x} onChange={(e) => setStickerPos({...stickerPos, x: parseInt(e.target.value)})} className="w-full h-1 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase text-gray-500"><span>Posizione Y</span><span className="text-yellow-400">{stickerPos.y}px</span></div>
                           <input type="range" min="-150" max="150" value={stickerPos.y} onChange={(e) => setStickerPos({...stickerPos, y: parseInt(e.target.value)})} className="w-full h-1 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase text-gray-500"><span>Scala</span><span className="text-yellow-400">{Math.round(stickerPos.scale * 100)}%</span></div>
                           <input type="range" min="0.5" max="4.5" step="0.1" value={stickerPos.scale} onChange={(e) => setStickerPos({...stickerPos, scale: parseFloat(e.target.value)})} className="w-full h-1 accent-yellow-400 bg-black/40 rounded-lg appearance-none cursor-pointer" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <SidebarHeader title="Design & Stile" icon={Settings2} section="style" />
                {activeSubSection === 'style' && (
                  <div className="bg-[#1a1638] p-5 rounded-2xl border border-white/10 space-y-5 animate-slide-up">
                    <div className="space-y-2">
                      <select value={globalState.font} onChange={(e) => setGlobalState({...globalState, font: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-brand-accent outline-none">
                        {FONT_OPTIONS.map(f => <option key={f.id} value={f.id} className="bg-[#1a1638] text-white">{f.label}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {NEON_COLORS.map(color => (
                        <button key={color} onClick={() => setGlobalState({...globalState, color: color})} className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all ${globalState.color === color ? 'border-white scale-110' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="bg-[#1a1638] p-6 rounded-3xl border border-white/10 shadow-2xl min-h-[500px] animate-fade-in">
                <h3 className="font-black text-[10px] text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Folder size={16}/> Archivio</h3>
                <div className="grid grid-cols-1 gap-3">
                  {customCategories.map(cat => (
                    <div key={cat.id} className="group bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-brand-accent/30 transition-all">
                      <button onClick={() => { applyPreset(cat.id); setActiveTab('editor'); }} className="flex items-center gap-4 text-left flex-1">
                        <div className="p-2 bg-white/5 rounded-xl transition-all" style={{ color: cat.color }}>
                          {cat.customImage ? <img src={cat.customImage} className="w-10 h-10 rounded-lg object-cover" /> : <Palette size={24} />}
                        </div>
                        <p className="text-[10px] font-black text-white uppercase">{cat.name}</p>
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-600 hover:text-red-500 opacity-40 group-hover:opacity-100"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
