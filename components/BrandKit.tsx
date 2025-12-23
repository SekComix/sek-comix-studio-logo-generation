
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateIconImage } from '../services/geminiService';
import { 
  Download, Sparkles, Palette, Camera, Code, Music, 
  Trash2, PenTool, RefreshCw, Briefcase, Heart, Gamepad, 
  ShoppingCart, Leaf, Utensils, Zap, Crown, Folder,
  Rocket, Layout, Image as ImageIcon, Star, Flame, Plane, 
  Dumbbell, Book, Home, Car, ChevronDown, ChevronRight, 
  Settings2, Fingerprint, Eye, EyeOff, Save, Move
} from 'lucide-react';

const STORAGE_KEY = 'sek_studio_vault_vFinal_2025';

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
  { id: 'tech', label: 'Tech / Software', iconKey: 'code', color: '#ffffff', sub: 'SYSTEM' },
];

const SHOWROOM_DESCRIPTIONS = {
  neon: { title: "Evoluzione NEON", text: "Brand futuristici ad alto impatto con illuminazione vibrante e contrasti cyber." },
  totem: { title: "Identità TOTEM", text: "Solidità e minimalismo monolitico per studi professionali e architettura d'avanguardia." },
  card: { title: "Business CARD", text: "Bilanciamento perfetto per la stampa premium e l'uso coordinato sui canali social." }
};

const STICKER_LIST = [
  { id: 'sparkles', icon: <Sparkles size={16} /> },
  { id: 'flame', icon: <Flame size={16} /> },
  { id: 'zap', icon: <Zap size={16} /> },
  { id: 'star', icon: <Star size={16} /> },
  { id: 'heart', icon: <Heart size={16} /> },
  { id: 'rocket', icon: <Rocket size={16} /> },
];

const FONT_OPTIONS = [
  { id: 'orbitron', label: 'Orbitron' },
  { id: 'anton', label: 'Anton' },
  { id: 'playfair', label: 'Playfair' },
  { id: 'montserrat', label: 'Montserrat' },
  { id: 'lobster', label: 'Lobster' },
];

const SEPARATOR_OPTIONS = ['+', '&', 'and', 'e', '|', '•', '★', '×', '/', '-', ':', ' '];

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
  iconPos?: { x: number; y: number };
  iconScale?: number;
}

type SubSection = 'identity' | 'ai' | 'stickers' | 'style';

interface BrandKitProps {
  globalState: any;
  setGlobalState: React.Dispatch<React.SetStateAction<any>>;
}

export const BrandKit: React.FC<BrandKitProps> = ({ globalState, setGlobalState }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'showroom' | 'saved'>('editor');
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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCustomCategories(JSON.parse(stored));
      } catch (e) {
        console.error("Errore archivio:", e);
      }
    }
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
        showIcon: true,
        iconPos: { x: 0, y: 0 },
        iconScale: 1
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
        showIcon: true,
        iconPos: custom.iconPos || { x: 0, y: 0 },
        iconScale: custom.iconScale || 1
      }));
    }
  };

  const handleIconGenerate = async () => {
    if (!iconPrompt.trim()) return;
    setIsGeneratingIcon(true);
    try {
      const img = await generateIconImage(iconPrompt, globalState.color);
      setGlobalState((prev: any) => ({ ...prev, customImage: img, showIcon: true }));
    } catch (e: any) { alert(e.message); } finally { setIsGeneratingIcon(false); }
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

  const downloadLogo = async () => {
    const element = document.getElementById('brand-logo-preview');
    if (!element) return;
    try {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${element.innerHTML}</div></foreignObject></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sek-logo-${pixelSize}px.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) { alert("Errore download."); }
  };

  const saveCurrentAsCategory = () => {
    const newCat: CustomCategory = { 
      id: `save_${Date.now()}`, 
      name: globalState.subtitle || 'PROGETTO STUDIO', 
      iconKey: globalState.iconKey, 
      color: globalState.color, 
      subtitle: globalState.subtitle, 
      customImage: globalState.customImage,
      iconPos: globalState.iconPos,
      iconScale: globalState.iconScale
    };
    
    setCustomCategories(prev => {
      const next = [newCat, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    alert('Salvato nell\'Archivio!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Vuoi eliminare definitivamente questo progetto dall\'Archivio?')) {
      const updated = customCategories.filter(c => c.id !== id);
      setCustomCategories(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const SidebarHeader = ({ title, icon: Icon, section }: { title: string, icon: any, section: SubSection }) => (
    <button onClick={() => setActiveSubSection(activeSubSection === section ? null : section)} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${activeSubSection === section ? 'bg-brand-accent/30 border border-brand-accent/50 text-white shadow-[0_0_15px_rgba(0,242,96,0.2)]' : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'}`}>
      <div className="flex items-center gap-4"><Icon size={20} /><span className="text-[11px] font-black uppercase tracking-widest">{title}</span></div>
      {activeSubSection === section ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
    </button>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 pb-32">
      
      {/* NAV BAR CENTRATA */}
      <div className="flex justify-center mb-16">
        <div className="flex bg-white/5 backdrop-blur-2xl p-2 rounded-full border border-white/20 shadow-2xl max-w-2xl w-full gap-2 relative z-[60]">
          <button onClick={() => setActiveTab('editor')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-brand-accent text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><PenTool size={18}/> Editor</button>
          <button onClick={() => setActiveTab('showroom')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'showroom' ? 'bg-brand-accent2 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><Layout size={18}/> Vetrina</button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <Folder size={18}/> Archivio ({customCategories.length})
          </button>
          <button 
            onClick={saveCurrentAsCategory} 
            className="flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 hover:bg-brand-accent hover:text-black hover:border-transparent active:scale-95 shadow-md"
          >
            <Save size={18}/> Salva
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10`}>
        
        {/* COLONNA SINISTRA: CONTROLLI O LISTA ARCHIVIO */}
        <div className={`lg:col-span-4 ${activeTab === 'showroom' ? 'hidden' : ''} space-y-4 overflow-y-auto max-h-[850px] pr-2 no-scrollbar pt-10`}>
          {activeTab === 'editor' && (
            <div className="space-y-4 animate-fade-in">
               <SidebarHeader title="Identità & Preset" icon={Fingerprint} section="identity" />
               {activeSubSection === 'identity' && (
                 <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 animate-slide-up shadow-xl">
                    <div className="space-y-3">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Scegli una Categoria</label>
                      <select onChange={(e) => applyPreset(e.target.value)} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-xs font-bold text-brand-accent outline-none hover:border-brand-accent/50 transition-all cursor-pointer">
                        <option value="" className="text-white">Preset Rapidi...</option>
                        {PRESET_CATEGORIES.map(p => <option key={p.id} value={p.id} className="text-white">{p.label}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setGlobalState({...globalState, showIcon: !globalState.showIcon})} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${globalState.showIcon ? 'bg-brand-accent text-black border-brand-accent shadow-lg' : 'bg-black/30 text-white/30 border-white/10'}`}>
                         {globalState.showIcon ? <><Eye size={14}/> ICONA ON</> : <><EyeOff size={14}/> ICONA OFF</>}
                       </button>
                       <button onClick={() => setGlobalState({...globalState, showSeparator: !globalState.showSeparator})} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${globalState.showSeparator ? 'bg-brand-accent text-black border-brand-accent shadow-lg' : 'bg-black/30 text-white/30 border-white/10'}`}>
                         {globalState.showSeparator ? <><Eye size={14}/> SEPAR. ON</> : <><EyeOff size={14}/> SEPAR. OFF</>}
                       </button>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Testi Brand</label>
                      <div className="flex gap-3">
                        <input type="text" value={globalState.text1} onChange={(e) => setGlobalState({...globalState, text1: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-sm text-white outline-none focus:border-brand-accent" />
                        <input type="text" value={globalState.text2} onChange={(e) => setGlobalState({...globalState, text2: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-sm text-white outline-none focus:border-brand-accent" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Separatore</label>
                      <select value={globalState.separatorText} onChange={(e) => setGlobalState({...globalState, separatorText: e.target.value, showSeparator: true})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-xs font-bold text-brand-accent outline-none">
                        {SEPARATOR_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-[#1a1638] text-white">{opt === ' ' ? 'Spazio' : opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <label className="text-[10px] text-white font-black uppercase tracking-widest">Tagline / Sottotitolo</label>
                         <button onClick={() => setGlobalState((prev: any) => ({...prev, showSubtitle: !prev.showSubtitle}))} className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg transition-all border ${globalState.showSubtitle ? 'bg-brand-accent text-black border-brand-accent shadow-lg' : 'bg-black/30 text-white/40 border-white/10'}`}>
                           {globalState.showSubtitle ? 'TAGLINE ON' : 'TAGLINE OFF'}
                         </button>
                      </div>
                      <input type="text" value={globalState.subtitle} onChange={(e) => setGlobalState({...globalState, subtitle: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-xs text-brand-accent outline-none tracking-[0.2em]" />
                    </div>
                 </div>
               )}
               
               <SidebarHeader title="Icona & AI" icon={ImageIcon} section="ai" />
               {activeSubSection === 'ai' && (
                 <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-8 animate-slide-up shadow-xl">
                   <div className="space-y-4">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Crea con AI</label>
                      <div className="flex gap-3">
                        <input type="text" value={iconPrompt} onChange={(e) => setIconPrompt(e.target.value)} placeholder="Esempio: Drago tech..." className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-brand-accent" />
                        <button onClick={handleIconGenerate} disabled={isGeneratingIcon} className="bg-brand-accent text-black px-4 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95">
                          {isGeneratingIcon ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                        </button>
                      </div>
                   </div>
                   
                   <div className="space-y-6 pt-2">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] text-white uppercase font-black"><span>Scala Icona</span><span className="text-brand-accent">{globalState.iconScale.toFixed(1)}x</span></div>
                        <input type="range" min="0.3" max="3.5" step="0.1" value={globalState.iconScale} onChange={(e) => setGlobalState({...globalState, iconScale: parseFloat(e.target.value)})} className="w-full h-2 accent-brand-accent bg-black/60 rounded-full appearance-none cursor-pointer" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                           <div className="text-[9px] font-black uppercase text-white/60 flex items-center gap-2"><Move size={12}/> Orizz. X</div>
                           <input type="range" min="-150" max="150" value={globalState.iconPos.x} onChange={(e) => setGlobalState({...globalState, iconPos: {...globalState.iconPos, x: parseInt(e.target.value)}})} className="w-full h-1.5 accent-brand-accent bg-black/60 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div className="space-y-3">
                           <div className="text-[9px] font-black uppercase text-white/60 flex items-center gap-2"><Move size={12}/> Vert. Y</div>
                           <input type="range" min="-150" max="150" value={globalState.iconPos.y} onChange={(e) => setGlobalState({...globalState, iconPos: {...globalState.iconPos, y: parseInt(e.target.value)}})} className="w-full h-1.5 accent-brand-accent bg-black/60 rounded-lg appearance-none cursor-pointer" />
                        </div>
                      </div>
                   </div>
                 </div>
               )}

               <SidebarHeader title="Effetti Stickers" icon={Star} section="stickers" />
               {activeSubSection === 'stickers' && (
                 <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-8 animate-slide-up shadow-xl">
                    <div className="flex gap-2 flex-wrap">
                      {STICKER_LIST.map(stk => (
                        <button key={stk.id} onClick={() => setSelectedSticker(stk.id)} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${selectedSticker === stk.id ? 'border-brand-accent bg-brand-accent/20 text-brand-accent scale-110 shadow-lg' : 'border-white/10 bg-black/40 text-white/50 hover:text-white'}`}>{stk.icon}</button>
                      ))}
                      {selectedSticker && <button onClick={() => setSelectedSticker(null)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/10"><Trash2 size={16}/></button>}
                    </div>

                    {selectedSticker && (
                      <div className="space-y-6 pt-4 border-t border-white/5 animate-fade-in">
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] text-white uppercase font-black"><span>Scala Sticker</span><span className="text-yellow-400">{stickerPos.scale.toFixed(1)}x</span></div>
                          <input type="range" min="0.5" max="5.0" step="0.1" value={stickerPos.scale} onChange={(e) => setStickerPos({...stickerPos, scale: parseFloat(e.target.value)})} className="w-full h-2 accent-yellow-400 bg-black/60 rounded-full appearance-none cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                             <div className="text-[9px] font-black uppercase text-white/60 flex items-center gap-2"><Move size={12}/> Pos. X</div>
                             <input type="range" min="-300" max="300" value={stickerPos.x} onChange={(e) => setStickerPos({...stickerPos, x: parseInt(e.target.value)})} className="w-full h-1.5 accent-yellow-400 bg-black/60 rounded-lg appearance-none cursor-pointer" />
                          </div>
                          <div className="space-y-3">
                             <div className="text-[9px] font-black uppercase text-white/60 flex items-center gap-2"><Move size={12}/> Pos. Y</div>
                             <input type="range" min="-200" max="200" value={stickerPos.y} onChange={(e) => setStickerPos({...stickerPos, y: parseInt(e.target.value)})} className="w-full h-1.5 accent-yellow-400 bg-black/60 rounded-lg appearance-none cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               <SidebarHeader title="Stile & Colore" icon={Settings2} section="style" />
               {activeSubSection === 'style' && (
                 <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 animate-slide-up shadow-xl">
                    <div className="space-y-4">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Font del Brand</label>
                      <select value={globalState.font} onChange={(e) => setGlobalState({...globalState, font: e.target.value})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-xs font-bold text-brand-accent outline-none">
                        {FONT_OPTIONS.map(f => <option key={f.id} value={f.id} className="bg-[#1a1638] text-white">{f.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] text-white font-black uppercase tracking-widest">Palette Neon</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {NEON_COLORS.map(color => (
                          <button key={color} onClick={() => setGlobalState({...globalState, color: color})} className={`shrink-0 w-7 h-7 rounded-full border-2 transition-all ${globalState.color === color ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`} style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="bg-[#1a1638] p-6 rounded-[2.5rem] border border-white/10 shadow-2xl h-full flex flex-col animate-fade-in overflow-hidden">
                <h3 className="font-black text-[10px] text-brand-accent uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                  <Folder size={18} className="text-purple-400" /> Elenco Archivio
                </h3>
                <div className="flex-grow overflow-y-auto pr-1 no-scrollbar space-y-3">
                  {customCategories.length === 0 ? (
                    <div className="text-center py-20 opacity-20">Nessun logo salvato</div>
                  ) : (
                    customCategories.map(cat => (
                      <div 
                        key={cat.id} 
                        className="relative group flex items-center bg-black/40 border border-white/5 rounded-2xl p-3 hover:border-brand-accent/50 hover:bg-black/60 transition-all cursor-pointer overflow-hidden" 
                        onClick={() => applyPreset(cat.id)}
                      >
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5" style={{ color: cat.color }}>
                          {cat.customImage ? <img src={cat.customImage} className="w-8 h-8 rounded-lg object-cover" /> : BASE_ICONS[cat.iconKey]?.component}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <p className="text-[10px] font-black text-white uppercase truncate tracking-widest">{cat.name}</p>
                          <p className="text-[8px] font-bold text-white/40 uppercase truncate">{cat.subtitle}</p>
                        </div>
                        
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDelete(cat.id); 
                          }} 
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0 ml-2 border border-red-500/20"
                          title="Elimina"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))
                  )}
                </div>
            </div>
          )}
        </div>

        {/* COLONNA DESTRA / CENTRALE: ANTEPRIMA LOGO */}
        <div className={`${activeTab === 'showroom' ? 'lg:col-span-12' : 'lg:col-span-8'} pt-10 flex flex-col items-center`}>
          <div className="relative w-full aspect-[12/8] md:aspect-[12/7] rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)] border border-white/10 transition-all duration-700 flex flex-col items-center justify-between py-12 px-8"
            style={{ backgroundColor: previewBg }}>
            
            {/* PULSANTI VETRINA */}
            {activeTab === 'showroom' ? (
              <div className="relative flex items-center gap-3 bg-black/70 backdrop-blur-3xl p-3 rounded-full border border-white/20 z-30 shadow-2xl animate-fade-in-down ring-1 ring-white/10 mb-6">
                {['neon', 'totem', 'card'].map(t => (
                  <button key={t} onClick={() => setShowroomType(t as any)} className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all ${showroomType === t ? 'bg-white text-black shadow-xl scale-110' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>{t}</button>
                ))}
              </div>
            ) : <div className="h-10"></div>}

            {/* LOGO BOX */}
            <div className="flex-grow flex items-center justify-center w-full transform hover:scale-[1.03] transition-transform duration-700">
                <BrandLogo 
                  size={activeTab === 'showroom' ? (showroomType === 'totem' ? 'md' : 'xl') : (activeTab === 'saved' ? 'lg' : logoSize)} 
                  customIcon={BASE_ICONS[globalState.iconKey]?.component} customImageSrc={globalState.customImage}
                  customColor={globalState.color} subtitle={globalState.subtitle} showSubtitle={globalState.showSubtitle}
                  text1={globalState.text1} text2={globalState.text2} showSeparator={globalState.showSeparator} 
                  showIcon={globalState.showIcon} font={globalState.font} separatorText={globalState.separatorText} 
                  theme={logoTheme} iconScale={activeTab === 'showroom' ? (showroomType === 'neon' ? 1.7 : 1.4) : globalState.iconScale} 
                  iconPos={globalState.iconPos} sticker={selectedSticker} stickerConfig={stickerPos}
                  className={activeTab === 'showroom' ? 'drop-shadow-[0_0_80px_rgba(255,255,255,0.25)]' : 'drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]'}
                />
            </div>

            {/* BARRA CONTROLLI ANTEPRIMA - RIPRISTINATA CHIRURGICAMENTE */}
            {activeTab === 'showroom' ? (
               <div className="relative w-full max-w-3xl animate-fade-in-up mt-10">
                 <div className="bg-black/95 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 text-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                    <h4 className="text-brand-accent text-[14px] font-black uppercase tracking-[0.6em] mb-3">{SHOWROOM_DESCRIPTIONS[showroomType].title}</h4>
                    <p className="text-white text-lg font-bold italic opacity-100 leading-relaxed max-w-2xl mx-auto">"{SHOWROOM_DESCRIPTIONS[showroomType].text}"</p>
                 </div>
               </div>
            ) : activeTab === 'editor' ? (
              <div className="flex flex-wrap items-center justify-center gap-1 bg-black/70 backdrop-blur-3xl p-2 rounded-full border border-white/20 shadow-2xl animate-fade-in">
                {/* Background Colors */}
                <div className="flex gap-2 px-4 border-r border-white/20 py-2">
                  {BG_PRESETS.map(bg => (
                    <button key={bg.hex} onClick={() => {setPreviewBg(bg.hex); setLogoTheme(bg.theme as any)}} className={`w-4 h-4 rounded-full border transition-all ${previewBg === bg.hex ? 'border-brand-accent ring-2 ring-brand-accent/20 scale-125' : 'border-white/30 opacity-70 hover:opacity-100'}`} style={{ backgroundColor: bg.hex }} />
                  ))}
                </div>

                {/* Size Presets Buttons */}
                <div className="flex gap-1 px-4 border-r border-white/20 py-2">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(s => (
                    <button key={s} onClick={() => syncSize(s)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${logoSize === s ? 'bg-brand-accent text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>{s}</button>
                  ))}
                </div>

                {/* Pixel Slider & Download */}
                <div className="flex items-center gap-4 px-5 py-2">
                   <div className="flex flex-col items-center">
                     <input type="range" min="400" max="4000" step="10" value={pixelSize} onChange={(e) => handlePixelChange(parseInt(e.target.value))} className="w-24 md:w-32 h-1 accent-brand-accent bg-white/10 rounded-full appearance-none cursor-pointer" />
                     <span className="text-[8px] font-black text-white/40 mt-1 uppercase">{pixelSize}PX</span>
                   </div>
                   <button onClick={downloadLogo} className="w-10 h-10 flex items-center justify-center bg-brand-accent text-black rounded-full hover:scale-110 transition-all shadow-xl active:scale-90" title="Esporta Logo"><Download size={18} /></button>
                </div>
              </div>
            ) : null}

            {activeTab === 'saved' && (
              <div className="absolute top-8 right-8 bg-purple-600/90 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20">
                Preview Archivio
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
