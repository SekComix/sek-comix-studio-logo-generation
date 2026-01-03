
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateIconImage } from '../services/geminiService';
import { 
  Download, Sparkles, Palette, Camera, Code, Music, 
  Trash2, PenTool, RefreshCw, Briefcase, Heart, Gamepad, 
  ShoppingCart, Leaf, Utensils, Zap, Crown, Folder,
  Rocket, Layout, Image as ImageIcon, Star, Flame, Plane, 
  Dumbbell, Book, Home, Car, ChevronDown, ChevronRight, 
  Settings2, Fingerprint, Eye, EyeOff, Save, Move,
  XCircle, Type as TypeIcon
} from 'lucide-react';

declare global {
  interface Window {
    html2canvas: any;
  }
}

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

const NEON_COLORS = ['#00f260', '#0575E6', '#f20060', '#f2f200', '#00f2f2', '#f200f2', '#ffffff', '#ffa500', '#808080'];
const BG_PRESETS = [
  { name: 'Midnight', hex: '#0f0c29', theme: 'dark' },
  { name: 'Studio', hex: '#302b63', theme: 'dark' },
  { name: 'Antracite', hex: '#1f2937', theme: 'dark' },
  { name: 'Grigio', hex: '#e5e7eb', theme: 'light' },
  { name: 'White', hex: '#ffffff', theme: 'light' },
];

const SEPARATOR_PRESETS = [
  { label: 'Più (+)', value: '+' },
  { label: 'E (&)', value: '&' },
  { label: 'Pipe (|)', value: '|' },
  { label: 'Slash (/)', value: '/' },
  { label: 'Punto (•)', value: '•' },
  { label: 'Stella (*)', value: '*' },
  { label: 'Trattino (-)', value: '-' },
  { label: 'Spazio Vuoto', value: ' ' },
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
  const [stickerPos, setStickerPos] = useState({ x: 0, y: 0, scale: 1.0 });
  const [pixelSize, setPixelSize] = useState(1200);
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setCustomCategories(JSON.parse(stored)); } catch (e) { console.error(e); }
    }
  }, []);

  const applyPreset = (presetId: string) => {
    setSelectedSticker(null);
    const preset = PRESET_CATEGORIES.find(p => p.id === presetId);
    if (preset) {
      setGlobalState((prev: any) => ({ ...prev, iconKey: preset.iconKey, color: preset.color, subtitle: preset.sub, customImage: null, showIcon: true, iconPos: { x: 0, y: 0 }, iconScale: 1 }));
      return;
    }
    const custom = customCategories.find(c => c.id === presetId);
    if (custom) {
      setGlobalState((prev: any) => ({ ...prev, iconKey: custom.iconKey, color: custom.color, subtitle: custom.subtitle, customImage: custom.customImage || null, showIcon: true, iconPos: custom.iconPos || { x: 0, y: 0 }, iconScale: custom.iconScale || 1 }));
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

  const downloadLogo = async () => {
    const element = document.getElementById('active-logo-canvas');
    if (!element || !window.html2canvas) { 
      alert("Attendi il caricamento della libreria di cattura."); 
      return; 
    }
    
    setIsExporting(true);
    
    try {
      const captureScale = pixelSize / element.offsetWidth;

      const canvas = await window.html2canvas(element, {
        backgroundColor: null,
        scale: captureScale,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('active-logo-canvas');
          if (clonedElement) {
            clonedElement.style.width = "fit-content";
            clonedElement.style.height = "fit-content";
            clonedElement.style.position = "static";
            clonedElement.style.transform = "none";
            const parent = clonedElement.parentElement;
            if (parent && parent.id === 'preview-scaler') {
              parent.style.transform = 'none';
              parent.style.width = 'fit-content';
              parent.style.height = 'fit-content';
            }
            const safePadding = logoSize === 'xl' ? 200 : logoSize === 'lg' ? 100 : 40;
            clonedElement.style.padding = `${safePadding}px`;
            clonedElement.style.display = "flex";
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `sek-brand-${logoSize}-${pixelSize}px.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Errore nell'esportazione dell'immagine.");
    } finally {
      setIsExporting(false);
    }
  };

  const saveCurrentAsCategory = () => {
    const newCat: CustomCategory = { 
      id: `save_${Date.now()}`, name: globalState.subtitle || 'PROGETTO STUDIO', iconKey: globalState.iconKey, 
      color: globalState.color, subtitle: globalState.subtitle, customImage: globalState.customImage,
      iconPos: globalState.iconPos, iconScale: globalState.iconScale
    };
    setCustomCategories(prev => {
      const next = [newCat, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    alert('Salvato nell\'Archivio!');
  };

  const SidebarHeader = ({ title, icon: Icon, section }: { title: string, icon: any, section: SubSection }) => (
    <button onClick={() => setActiveSubSection(activeSubSection === section ? null : section)} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${activeSubSection === section ? 'bg-brand-accent/30 border border-brand-accent/50 text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'}`}>
      <div className="flex items-center gap-4"><Icon size={20} /><span className="text-[11px] font-black uppercase tracking-widest">{title}</span></div>
      {activeSubSection === section ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
    </button>
  );

  const getVisualPreviewScale = () => {
    if (logoSize === 'xl') return 0.22;
    if (logoSize === 'lg') return 0.45;
    return 1;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-32">
      <div className="flex justify-center mb-16">
        <div className="flex bg-white/5 backdrop-blur-2xl p-2 rounded-full border border-white/20 shadow-2xl max-w-2xl w-full gap-2 relative z-[60]">
          <button onClick={() => setActiveTab('editor')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-brand-accent text-black' : 'text-white/60'}`}><PenTool size={18}/> Editor</button>
          <button onClick={() => setActiveTab('showroom')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'showroom' ? 'bg-brand-accent2 text-white' : 'text-white/60'}`}><Layout size={18}/> Vetrina</button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-purple-600 text-white' : 'text-white/60'}`}><Folder size={18}/> Archivio</button>
          <button onClick={saveCurrentAsCategory} className="flex-1 py-4 rounded-full text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-brand-accent hover:text-black"><Save size={18}/> Salva</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className={`lg:col-span-4 ${activeTab === 'showroom' ? 'hidden' : ''} space-y-4`}>
          {activeTab === 'editor' && (
            <div className="space-y-4 animate-fade-in">
              <SidebarHeader title="Identità" icon={Fingerprint} section="identity" />
              {activeSubSection === 'identity' && (
                <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-4 animate-slide-up">
                  
                  {/* Gestione Icona */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-white/50 uppercase font-black tracking-widest">Icona Intestazione</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setGlobalState({...globalState, showIcon: !globalState.showIcon})}
                          className={`p-1.5 rounded-lg transition-all ${globalState.showIcon ? 'text-brand-accent bg-brand-accent/10' : 'text-white/20 bg-white/5'}`}
                          title="Mostra/Nascondi Icona"
                        >
                          {globalState.showIcon ? <Eye size={14}/> : <EyeOff size={14}/>}
                        </button>
                        {(globalState.customImage || globalState.iconKey !== 'palette') && (
                          <button 
                            onClick={() => setGlobalState({...globalState, customImage: null, iconKey: 'palette'})}
                            className="p-1.5 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all"
                            title="Reset Icona"
                          >
                            <RefreshCw size={14}/>
                          </button>
                        )}
                      </div>
                    </div>
                    <select value={globalState.iconKey} onChange={(e) => applyPreset(e.target.value)} className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs font-bold text-brand-accent outline-none">
                      <option value="">Cambia Preset Icona...</option>
                      {PRESET_CATEGORIES.map(p => <option key={p.id} value={p.iconKey}>{p.label}</option>)}
                      {Object.keys(BASE_ICONS).map(k => <option key={k} value={k}>{BASE_ICONS[k].label}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input type="text" value={globalState.text1} onChange={(e) => setGlobalState({...globalState, text1: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-white" placeholder="TESTO 1" />
                    <input type="text" value={globalState.text2} onChange={(e) => setGlobalState({...globalState, text2: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-white" placeholder="TESTO 2" />
                  </div>

                  {/* Gestione Separatore - Ripristinato Dropdown */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-white/50 uppercase font-black tracking-widest">Separatore</label>
                      <button 
                        onClick={() => setGlobalState({...globalState, showSeparator: !globalState.showSeparator})}
                        className={`p-1.5 rounded-lg transition-all ${globalState.showSeparator ? 'text-brand-accent bg-brand-accent/10' : 'text-white/20 bg-white/5'}`}
                        title="Mostra/Nascondi Separatore"
                      >
                        {globalState.showSeparator ? <Eye size={14}/> : <EyeOff size={14}/>}
                      </button>
                    </div>
                    <select 
                      value={globalState.separatorText} 
                      onChange={(e) => setGlobalState({...globalState, separatorText: e.target.value, showSeparator: true})}
                      className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs font-bold text-brand-accent outline-none"
                    >
                      {SEPARATOR_PRESETS.map(sep => (
                        <option key={sep.value} value={sep.value}>{sep.label}</option>
                      ))}
                      {!SEPARATOR_PRESETS.some(s => s.value === globalState.separatorText) && (
                        <option value={globalState.separatorText}>Custom: {globalState.separatorText}</option>
                      )}
                    </select>
                  </div>

                  {/* Gestione Tagline / Trigger */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-white/50 uppercase font-black tracking-widest">Tagline / Trigger</label>
                      <div className="flex gap-2">
                         <button 
                            onClick={() => setGlobalState({...globalState, showSubtitle: !globalState.showSubtitle})}
                            className={`p-1.5 rounded-lg transition-all ${globalState.showSubtitle ? 'text-brand-accent bg-brand-accent/10' : 'text-white/20 bg-white/5'}`}
                            title="Mostra/Nascondi Trigger"
                          >
                            {globalState.showSubtitle ? <Eye size={14}/> : <EyeOff size={14}/>}
                          </button>
                          {globalState.subtitle && (
                            <button 
                              onClick={() => setGlobalState({...globalState, subtitle: ''})}
                              className="p-1.5 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all"
                              title="Cancella Trigger"
                            >
                              <Trash2 size={14}/>
                            </button>
                          )}
                      </div>
                    </div>
                    <input type="text" value={globalState.subtitle} onChange={(e) => setGlobalState({...globalState, subtitle: e.target.value.toUpperCase()})} className="w-full bg-black/60 border border-white/20 rounded-xl p-4 text-center font-black text-xs text-brand-accent" placeholder="SCRIVI QUI..." />
                  </div>
                </div>
              )}
              
              <SidebarHeader title="Icona AI" icon={ImageIcon} section="ai" />
              {activeSubSection === 'ai' && (
                <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 animate-slide-up">
                  <div className="flex gap-2">
                    <input type="text" value={iconPrompt} onChange={(e) => setIconPrompt(e.target.value)} className="flex-1 bg-black/60 border border-white/20 rounded-xl p-3 text-sm text-white" placeholder="Descrivi icona AI..." />
                    <button onClick={handleIconGenerate} disabled={isGeneratingIcon} className="bg-brand-accent text-black p-3 rounded-xl hover:scale-105 transition-all">
                      {isGeneratingIcon ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18}/>}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase"><span>Scala Icona</span><span>{globalState.iconScale.toFixed(1)}x</span></div>
                    <input type="range" min="0.3" max="3.0" step="0.1" value={globalState.iconScale} onChange={(e) => setGlobalState({...globalState, iconScale: parseFloat(e.target.value)})} className="w-full h-1 accent-brand-accent bg-white/10 rounded-full" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-white/30 uppercase">Pos X</span>
                        <input type="range" min="-100" max="100" value={globalState.iconPos.x} onChange={(e) => setGlobalState({...globalState, iconPos: {...globalState.iconPos, x: parseInt(e.target.value)}})} className="w-full accent-brand-accent bg-white/10 h-1" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-white/30 uppercase">Pos Y</span>
                        <input type="range" min="-100" max="100" value={globalState.iconPos.y} onChange={(e) => setGlobalState({...globalState, iconPos: {...globalState.iconPos, x: parseInt(e.target.value)}})} className="w-full accent-brand-accent bg-white/10 h-1" />
                        <input type="range" min="-100" max="100" value={globalState.iconPos.y} onChange={(e) => setGlobalState({...globalState, iconPos: {...globalState.iconPos, y: parseInt(e.target.value)}})} className="w-full accent-brand-accent bg-white/10 h-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <SidebarHeader title="Stickers" icon={Star} section="stickers" />
              {activeSubSection === 'stickers' && (
                <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 animate-slide-up">
                   <div className="flex gap-2 flex-wrap">
                     {STICKER_LIST.map(stk => (
                       <button key={stk.id} onClick={() => setSelectedSticker(stk.id)} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${selectedSticker === stk.id ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : 'border-white/10 text-white/40'}`}>{stk.icon}</button>
                     ))}
                     {selectedSticker && <button onClick={() => setSelectedSticker(null)} className="text-red-500 p-2"><Trash2 size={16}/></button>}
                   </div>
                   {selectedSticker && (
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <input type="range" min="0.5" max="5.0" step="0.1" value={stickerPos.scale} onChange={(e) => setStickerPos({...stickerPos, scale: parseFloat(e.target.value)})} className="w-full accent-yellow-400" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="range" min="-300" max="300" value={stickerPos.x} onChange={(e) => setStickerPos({...stickerPos, x: parseInt(e.target.value)})} className="w-full" />
                          <input type="range" min="-200" max="200" value={stickerPos.y} onChange={(e) => setStickerPos({...stickerPos, y: parseInt(e.target.value)})} className="w-full" />
                        </div>
                     </div>
                   )}
                </div>
              )}

              <SidebarHeader title="Stile" icon={Settings2} section="style" />
              {activeSubSection === 'style' && (
                <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-6 animate-slide-up">
                  <select value={globalState.font} onChange={(e) => setGlobalState({...globalState, font: e.target.value})} className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-xs text-brand-accent">
                    {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {NEON_COLORS.map(c => <button key={c} onClick={() => setGlobalState({...globalState, color: c})} className={`w-6 h-6 rounded-full border shrink-0 ${globalState.color === c ? 'scale-125 border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="bg-[#1a1638] p-6 rounded-2xl border border-white/10 space-y-3 overflow-y-auto max-h-[500px]">
              <h3 className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-4">I Tuoi Loghi</h3>
              {customCategories.length === 0 && <p className="text-white/20 text-center py-10">Archivio vuoto</p>}
              {customCategories.map(cat => (
                <div key={cat.id} className="flex items-center bg-black/40 p-3 rounded-xl border border-white/5 group hover:border-brand-accent transition-all cursor-pointer" onClick={() => applyPreset(cat.id)}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: cat.color }}>
                    {cat.customImage ? <img src={cat.customImage} className="w-6 h-6 rounded object-cover" /> : BASE_ICONS[cat.iconKey]?.component}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden"><p className="text-[10px] font-black text-white uppercase truncate">{cat.subtitle || 'LOGO'}</p></div>
                  <button onClick={(e) => {e.stopPropagation(); if(confirm('Eliminare?')){setCustomCategories(prev => prev.filter(c=>c.id!==cat.id));}}} className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${activeTab === 'showroom' ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col items-center`}>
          <div className="relative w-full aspect-[12/7] rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-8 transition-all shadow-2xl overflow-hidden" style={{ backgroundColor: previewBg }}>
            
            {activeTab === 'showroom' && (
              <div className="absolute top-8 flex bg-black/50 p-1 rounded-full border border-white/10 z-20">
                {['neon', 'totem', 'card'].map(t => (
                  <button key={t} onClick={() => setShowroomType(t as any)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${showroomType === t ? 'bg-white text-black' : 'text-white/40'}`}>{t}</button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center w-full h-full relative" style={{ overflow: 'visible' }}>
              <div 
                id="preview-scaler"
                style={{ 
                  transform: `scale(${getVisualPreviewScale()})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'fit-content',
                  height: 'fit-content'
                }}
              >
                <BrandLogo 
                  id="active-logo-canvas" 
                  size={activeTab === 'showroom' ? 'xl' : logoSize} 
                  {...globalState} 
                  customIcon={BASE_ICONS[globalState.iconKey]?.component} 
                  customImageSrc={globalState.customImage} 
                  customColor={globalState.color} 
                  theme={logoTheme}
                  sticker={selectedSticker}
                  stickerConfig={stickerPos}
                />
              </div>
            </div>

            {activeTab === 'editor' && (
              <div className="absolute bottom-6 flex flex-wrap justify-center gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/20 z-30">
                <div className="flex gap-2 px-3 border-r border-white/10">
                  {BG_PRESETS.map(bg => <button key={bg.hex} onClick={() => {setPreviewBg(bg.hex); setLogoTheme(bg.theme as any)}} className="w-4 h-4 rounded-full" style={{ backgroundColor: bg.hex }} />)}
                </div>
                <div className="flex gap-1 px-3 border-r border-white/10">
                  {['sm', 'md', 'lg', 'xl'].map(s => <button key={s} onClick={() => syncSize(s as any)} className={`px-3 py-1 text-[8px] font-black rounded-lg ${logoSize === s ? 'bg-brand-accent text-black' : 'text-white'}`}>{s.toUpperCase()}</button>)}
                </div>
                <div className="flex items-center gap-4 px-3">
                  <span className="text-[8px] font-black text-white/50">{pixelSize}PX</span>
                  <input type="range" min="400" max="4000" step="100" value={pixelSize} onChange={(e)=>setPixelSize(parseInt(e.target.value))} className="w-20" />
                  <button onClick={downloadLogo} disabled={isExporting} className="bg-brand-accent text-black p-2 rounded-full hover:scale-110 transition-all">
                    {isExporting ? <RefreshCw className="animate-spin" size={16}/> : <Download size={16} />}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'showroom' && (
              <div className="absolute bottom-8 text-center animate-fade-in z-30">
                 <h4 className="text-brand-accent text-[12px] font-black uppercase tracking-[0.4em] mb-1">{SHOWROOM_DESCRIPTIONS[showroomType].title}</h4>
                 <p className="text-white/60 text-xs italic">{SHOWROOM_DESCRIPTIONS[showroomType].text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
