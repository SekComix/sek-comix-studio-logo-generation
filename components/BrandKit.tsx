
import React, { useState, useEffect } from 'react';
import { BrandLogo, ICON_MAP } from './BrandLogo';
import { generateIconImage } from '../services/geminiService';
import html2canvas from 'html2canvas';
import { 
  Download, Sparkles, Palette, Trash2, PenTool, RefreshCw, 
  Folder, Star, ChevronDown, ChevronRight, Fingerprint, Eye, 
  EyeOff, Save, Check, Award, X, Type,
  RotateCcw, Settings2, Hash, Flame, Zap, Heart, Rocket, Move,
  Archive, Maximize2, CheckSquare, Square, CheckCircle2
} from 'lucide-react';

const STORAGE_KEY = 'sek_studio_vault_vFinal_2025';

const ICON_LABELS: Record<string, string> = {
  'palette': 'Arte', 'camera': 'Foto', 'music': 'Musica', 'gamepad': 'Gaming',
  'code': 'Dev', 'briefcase': 'Lavoro', 'shopping-cart': 'Shop', 'utensils': 'Food',
  'star': 'Stella', 'heart': 'Love', 'zap': 'Power', 'crown': 'King',
  'leaf': 'Bio', 'rocket': 'Lancio', 'plane': 'Viaggi', 'dumbbell': 'Sport',
  'book': 'Libri', 'home': 'Casa', 'car': 'Auto',
};

const PRESET_CATEGORIES = [
  { id: 'business', label: 'Business / Azienda', iconKey: 'briefcase', color: '#00f260', sub: 'CORPORATE' },
  { id: 'travel', label: 'Viaggi / Esplorazione', iconKey: 'plane', color: '#0575E6', sub: 'EXPLORE' },
  { id: 'gaming', label: 'Giochi / E-Sports', iconKey: 'gamepad', color: '#f20060', sub: 'LEVEL UP' },
  { id: 'food', label: 'Cibo / Ristorazione', iconKey: 'utensils', color: '#ffa500', sub: 'GOURMET' },
  { id: 'art', label: 'Arte / Creatività', iconKey: 'palette', color: '#f200f2', sub: 'CREATIVE' },
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

const NEON_COLORS = ['#00f260', '#0575E6', '#f20060', '#f2f200', '#00f200', '#f200f2', '#ffffff', '#ffa500', '#808080'];

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
  text1?: string;
  text2?: string;
  font?: any;
  showIcon?: boolean;
  showSeparator?: boolean;
  showSubtitle?: boolean;
  separatorText?: string;
  customImage?: string | null;
  iconPos?: { x: number; y: number };
  iconScale?: number;
  sticker?: string | null;
  stickerConfig?: { x: number; y: number; scale: number };
  taglineConfig?: { x: number; y: number; scale: number };
  separatorConfig?: { x: number; y: number; scale: number };
  showSticker?: boolean;
}

type SubSection = 'identity' | 'ai' | 'stickers' | 'advanced';
type EditFocus = 'icon' | 'separator' | 'tagline' | 'sticker';

interface BrandKitProps {
  globalState: any;
  setGlobalState: React.Dispatch<React.SetStateAction<any>>;
  onSetAsStudio?: (identity: any) => void;
}

export const BrandKit: React.FC<BrandKitProps> = ({ globalState, setGlobalState, onSetAsStudio }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'showroom' | 'saved'>('editor');
  const [activeSubSection, setActiveSubSection] = useState<SubSection | null>(null);
  const [editFocus, setEditFocus] = useState<EditFocus>('icon');
  const [iconPrompt, setIconPrompt] = useState('');
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [previewScale, setPreviewScale] = useState(1.0);
  const [showIdentityPicker, setShowIdentityPicker] = useState(false);
  const [pendingStudioLogo, setPendingStudioLogo] = useState<CustomCategory | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomCategories(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const scaleMap = { sm: 0.6, md: 1.0, lg: 2.2, xl: 4.5 };
    setPreviewScale(scaleMap[logoSize] || 1.0);
  }, [logoSize]);

  const handlePreview = (cat: CustomCategory) => {
    const { id, name, ...cleanState } = cat;
    setGlobalState(JSON.parse(JSON.stringify(cleanState)));
  };

  const handleRowClick = (cat: CustomCategory) => {
    handlePreview(cat);
    setSelectedIds([cat.id]);
  };

  const toggleSelection = (e: React.MouseEvent, cat: CustomCategory) => {
    e.stopPropagation();
    const id = cat.id;
    handlePreview(cat);
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleMasterToggle = () => {
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    } else {
      const allIds = customCategories.map(c => c.id);
      setSelectedIds(allIds);
      if (customCategories.length > 0) handlePreview(customCategories[0]);
    }
  };

  const handleIconGenerate = async () => {
    if (!iconPrompt.trim()) return;
    setIsGeneratingIcon(true);
    try {
      const img = await generateIconImage(iconPrompt, globalState.color);
      setGlobalState((prev: any) => ({ ...prev, customImage: img, showIcon: true }));
      setEditFocus('icon');
      setIconPrompt('');
    } catch (e: any) { alert(e.message); } finally { setIsGeneratingIcon(false); }
  };

  const handleStickerClick = (sid: string) => {
    setGlobalState({ ...globalState, sticker: sid, showSticker: true });
    setEditFocus('sticker');
  };

  const handleFinalIdentitySelection = () => {
    if (!onSetAsStudio || !pendingStudioLogo) return;
    const { id, name, ...identityToPromote } = pendingStudioLogo;
    onSetAsStudio(identityToPromote);
    setPendingStudioLogo(null);
    setShowIdentityPicker(false);
  };

  const handleDeleteSelected = () => {
    const nextList = customCategories.filter(c => !selectedIds.includes(c.id));
    setCustomCategories(nextList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    setSelectedIds([]);
  };

  const resetPositions = () => {
    setGlobalState({
      ...globalState,
      iconScale: 1,
      iconPos: { x: 0, y: 0 },
      stickerConfig: { x: 0, y: 0, scale: 1 },
      taglineConfig: { x: 0, y: 0, scale: 1 },
      separatorConfig: { x: 0, y: 0, scale: 1 }
    });
  };

  const clearSticker = () => setGlobalState({ ...globalState, sticker: null, showSticker: false });

  const saveCurrentAsCategory = () => {
    const stateToSave = JSON.parse(JSON.stringify(globalState));
    const uniqueId = `ID_${Date.now()}_${Math.floor(Math.random() * 999999)}`;
    const newCat: CustomCategory = { ...stateToSave, id: uniqueId, name: stateToSave.subtitle || 'PROGETTO' };
    const updatedCategories = [newCat, ...customCategories];
    setCustomCategories(updatedCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const downloadLogo = async () => {
    const element = document.getElementById('active-logo-canvas');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: null, scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `Logo_${globalState.text1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
  };

  const getFocusLabel = () => {
    switch(editFocus) {
      case 'icon': return 'Icona';
      case 'separator': return 'Separatore';
      case 'tagline': return 'Tagline';
      case 'sticker': return 'Sticker';
    }
  };

  const getActiveConfig = () => {
    switch(editFocus) {
      case 'icon': return { x: globalState.iconPos?.x || 0, y: globalState.iconPos?.y || 0, scale: globalState.iconScale || 1 };
      case 'sticker': return globalState.stickerConfig || { x: 0, y: 0, scale: 1 };
      case 'tagline': return globalState.taglineConfig || { x: 0, y: 0, scale: 1 };
      case 'separator': return globalState.separatorConfig || { x: 0, y: 0, scale: 1 };
    }
  };

  const handleParamChange = (key: 'x' | 'y' | 'scale', val: number) => {
    switch(editFocus) {
      case 'icon':
        if (key === 'scale') setGlobalState({ ...globalState, iconScale: val });
        else setGlobalState({ ...globalState, iconPos: { ...globalState.iconPos, [key]: val } });
        break;
      case 'sticker': setGlobalState({ ...globalState, stickerConfig: { ...globalState.stickerConfig, [key]: val } }); break;
      case 'tagline': setGlobalState({ ...globalState, taglineConfig: { ...globalState.taglineConfig, [key]: val } }); break;
      case 'separator': setGlobalState({ ...globalState, separatorConfig: { ...globalState.separatorConfig, [key]: val } }); break;
    }
  };

  const renderArchiveIcon = (cat: CustomCategory, size: number = 18) => {
    if (cat.customImage) return <img src={cat.customImage} className="object-contain" style={{ width: size, height: size }} />;
    if (!cat.showIcon && cat.showSticker && cat.sticker) {
      const stickerIcon = STICKER_LIST.find(s => s.id === cat.sticker)?.icon;
      return stickerIcon ? React.cloneElement(stickerIcon, { size }) : <Star size={size} />;
    }
    const IconComp = ICON_MAP[cat.iconKey] || Palette;
    return <IconComp size={size} />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-32">
      {/* POPUP SELEZIONE LOGO STUDIO CON CONFERMA */}
      {showIdentityPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => { setShowIdentityPicker(false); setPendingStudioLogo(null); }}></div>
          <div className="relative w-full max-w-2xl bg-[#0f0c29] border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-white/10 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 shadow-xl"><Archive size={32} /></div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-white tracking-widest leading-none">Cambia Logo Studio</h2>
                  <p className="text-white font-black text-[12px] uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-lg mt-2 inline-block">Scegli la tua nuova identità ufficiale.</p>
                </div>
              </div>
              <button onClick={() => { setShowIdentityPicker(false); setPendingStudioLogo(null); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50"><X size={28}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#050510]">
              {customCategories.length === 0 ? <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4"><Folder size={64} /><p className="text-sm font-black uppercase tracking-widest">L'archivio è vuoto. Salva un logo per vederlo qui.</p></div> : 
                customCategories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setPendingStudioLogo(cat)} 
                    className={`w-full flex items-center p-5 rounded-[2rem] border-2 transition-all group text-left shadow-xl ${pendingStudioLogo?.id === cat.id ? 'bg-brand-accent/20 border-brand-accent shadow-[0_0_30px_rgba(0,242,96,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shrink-0" style={{ color: cat.color }}>
                      {renderArchiveIcon(cat, 32)}
                    </div>
                    <div className="ml-6 flex-1">
                       <p className="text-xl font-black uppercase tracking-tight leading-none mb-1 text-white">
                         {cat.text1}
                         {cat.showSeparator && <span className="mx-2" style={{ color: cat.color }}>{cat.separatorText}</span>}
                         <span style={{ color: cat.color }}>{cat.text2}</span>
                       </p>
                       <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{cat.subtitle || 'LOGO SALVATO'}</p>
                    </div>
                    {pendingStudioLogo?.id === cat.id && <CheckCircle2 size={24} className="text-brand-accent ml-4 animate-bounce-in" />}
                  </button>
                ))
              }
            </div>
            
            {/* BARRA DI CONFERMA NEL POPUP */}
            {pendingStudioLogo && (
              <div className="p-6 border-t border-white/10 bg-black/80 animate-slide-up shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={handleFinalIdentitySelection} 
                  className="w-full py-5 rounded-2xl bg-brand-accent text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  <Check size={20}/> CONFERMA NUOVO LOGO STUDIO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVIGATION PRINCIPALE */}
      <div className="flex justify-center mb-10">
        <div className="flex flex-wrap bg-white/5 backdrop-blur-2xl p-2 rounded-3xl md:rounded-full border border-white/20 shadow-2xl w-full max-w-4xl gap-2 z-[60]">
          <button onClick={() => setActiveTab('editor')} className={`flex-1 min-w-[100px] py-4 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'editor' ? 'bg-brand-accent text-black shadow-lg shadow-brand-accent/20' : 'text-white/60 hover:bg-white/5'}`}><PenTool size={16}/> Editor</button>
          <button onClick={() => setActiveTab('saved')} className={`flex-1 min-w-[100px] py-4 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-white/60 hover:bg-white/5'}`}><Folder size={16}/> Archivio</button>
          
          <div className="h-10 w-[1px] bg-white/10 self-center hidden md:block mx-1"></div>
          
          <button onClick={() => setShowIdentityPicker(true)} className="flex-1 min-w-[180px] py-4 px-6 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg hover:scale-105 active:scale-95"><Award size={18}/> CAMBIA TUO LOGO</button>
          
          <button onClick={saveCurrentAsCategory} className={`flex-1 min-w-[100px] py-4 rounded-full text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${saveSuccess ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>{saveSuccess ? <Check size={16}/> : <Save size={16}/>} Salva I TUOI LOGHI</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-3">
          {activeTab === 'editor' && (
            <div className="space-y-3">
              <button onClick={() => setActiveSubSection(activeSubSection === 'identity' ? null : 'identity')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSubSection === 'identity' ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center gap-3"><Fingerprint size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Identità Visiva</span></div>
                {activeSubSection === 'identity' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
              </button>
              {activeSubSection === 'identity' && (
                <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-5 animate-slide-up">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 uppercase">Icona</label>
                    <select value={globalState.iconKey} onChange={(e)=>{ setGlobalState({...globalState, iconKey: e.target.value, customImage: null, showIcon: true}); setEditFocus('icon'); }} className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-brand-accent">
                      {PRESET_CATEGORIES.map(p=><option key={p.id} value={p.iconKey}>{p.label}</option>)}
                      {Object.keys(ICON_MAP).map(k=><option key={k} value={k}>{ICON_LABELS[k] || k}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={globalState.text1} onChange={(e)=>setGlobalState({...globalState, text1: e.target.value.toUpperCase()})} className="bg-black border border-white/20 rounded-xl p-4 text-center font-black text-white text-xs" placeholder="TESTO 1" />
                    <input type="text" value={globalState.text2} onChange={(e)=>setGlobalState({...globalState, text2: e.target.value.toUpperCase()})} className="bg-black border border-white/20 rounded-xl p-4 text-center font-black text-white text-xs" placeholder="TESTO 2" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 uppercase">Separatore</label>
                    <select value={globalState.separatorText} onChange={(e)=>{ setGlobalState({...globalState, separatorText: e.target.value, showSeparator: true}); setEditFocus('separator'); }} className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-brand-accent">
                      {SEPARATOR_PRESETS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/40 uppercase">Tagline</label>
                    <input type="text" value={globalState.subtitle} onClick={()=>setEditFocus('tagline')} onChange={(e)=>setGlobalState({...globalState, subtitle: e.target.value.toUpperCase()})} className="w-full bg-black border border-white/20 rounded-xl p-4 text-center font-black text-brand-accent text-[10px]" placeholder="SOTTOTITOLO" />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {NEON_COLORS.map(c=><button key={c} onClick={()=>setGlobalState({...globalState, color: c})} className={`w-7 h-7 rounded-full shrink-0 border-2 transition-all ${globalState.color === c ? 'border-white scale-125 shadow-[0_0_10px_#fff]' : 'border-transparent opacity-40'}`} style={{backgroundColor: c}} />)}
                  </div>
                </div>
              )}

              <button onClick={() => setActiveSubSection(activeSubSection === 'ai' ? null : 'ai')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSubSection === 'ai' ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center gap-3"><Sparkles size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Icona AI</span></div>
                {activeSubSection === 'ai' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
              </button>
              {activeSubSection === 'ai' && (
                <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4 animate-slide-up">
                  <div className="flex gap-2">
                    <input type="text" value={iconPrompt} onChange={(e)=>setIconPrompt(e.target.value)} className="flex-1 bg-black border border-white/20 rounded-xl p-3 text-xs text-white" placeholder="Soggetto AI..." />
                    <button onClick={handleIconGenerate} disabled={isGeneratingIcon} className="bg-brand-accent text-black p-3 rounded-xl hover:scale-105 active:scale-95 transition-all">{isGeneratingIcon ? <RefreshCw className="animate-spin" size={16}/> : <Sparkles size={16}/>}</button>
                  </div>
                </div>
              )}

              <button onClick={() => setActiveSubSection(activeSubSection === 'stickers' ? null : 'stickers')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSubSection === 'stickers' ? 'bg-brand-accent/20 border-brand-accent' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center gap-3"><Star size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Stickers</span></div>
                {activeSubSection === 'stickers' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
              </button>
              {activeSubSection === 'stickers' && (
                <div className="bg-black/40 p-5 rounded-2xl border border-white/10 flex flex-wrap gap-2 justify-center animate-slide-up">
                  {STICKER_LIST.map(s=>(
                    <button key={s.id} onClick={()=>handleStickerClick(s.id)} className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${globalState.sticker === s.id ? 'bg-brand-accent text-black border-brand-accent shadow-lg shadow-brand-accent/20' : 'border-white/10 text-white/40 hover:border-white/30'}`}>{s.icon}</button>
                  ))}
                </div>
              )}

              <button onClick={() => setActiveSubSection(activeSubSection === 'advanced' ? null : 'advanced')} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeSubSection === 'advanced' ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center gap-3 text-yellow-500"><Settings2 size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Avanzate & Funzioni</span></div>
                {activeSubSection === 'advanced' ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
              </button>
              {activeSubSection === 'advanced' && (
                <div className="bg-black/60 p-5 rounded-2xl border border-yellow-500/20 space-y-6 animate-slide-up shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => setEditFocus('icon')} className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all ${editFocus === 'icon' ? 'bg-brand-accent border-brand-accent text-black' : 'bg-white/5 border-white/10 text-white/40'}`}>
                       <div className="flex items-center gap-1"><Palette size={12}/> <span onClick={(e)=>{e.stopPropagation(); setGlobalState({...globalState, showIcon: !globalState.showIcon})}}>{globalState.showIcon ? <Eye size={12}/> : <EyeOff size={12}/>}</span></div>
                       <span className="text-[7px] font-black uppercase">Icona</span>
                    </button>
                    <button onClick={() => setEditFocus('separator')} className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all ${editFocus === 'separator' ? 'bg-brand-accent border-brand-accent text-black' : 'bg-white/5 border-white/10 text-white/40'}`}>
                       <div className="flex items-center gap-1"><Hash size={12}/> <span onClick={(e)=>{e.stopPropagation(); setGlobalState({...globalState, showSeparator: !globalState.showSeparator})}}>{globalState.showSeparator ? <Eye size={12}/> : <EyeOff size={12}/>}</span></div>
                       <span className="text-[7px] font-black uppercase">Separa</span>
                    </button>
                    <button onClick={() => setEditFocus('tagline')} className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all ${editFocus === 'tagline' ? 'bg-brand-accent border-brand-accent text-black' : 'bg-white/5 border-white/10 text-white/40'}`}>
                       <div className="flex items-center gap-1"><Type size={12}/> <span onClick={(e)=>{e.stopPropagation(); setGlobalState({...globalState, showSubtitle: !globalState.showSubtitle})}}>{globalState.showSubtitle ? <Eye size={12}/> : <EyeOff size={12}/>}</span></div>
                       <span className="text-[7px] font-black uppercase">Tagline</span>
                    </button>
                    <button onClick={() => setEditFocus('sticker')} disabled={!globalState.sticker} className={`flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all disabled:opacity-20 ${editFocus === 'sticker' ? 'bg-brand-accent border-brand-accent text-black' : 'bg-white/5 border-white/10 text-white/40'}`}>
                       <div className="flex items-center gap-1"><Star size={12}/> <span onClick={(e)=>{e.stopPropagation(); if(globalState.sticker) setGlobalState({...globalState, showSticker: !globalState.showSticker})}}>{globalState.showSticker ? <Eye size={12}/> : <EyeOff size={12}/>}</span></div>
                       <span className="text-[7px] font-black uppercase">Sticker</span>
                    </button>
                  </div>

                  <div className="space-y-4 border-t border-white/10 pt-5 animate-slide-up" key={editFocus}>
                    <label className="text-[8px] font-black text-yellow-500 uppercase tracking-widest flex items-center justify-between">
                      <span>Funzioni Relativa: {getFocusLabel()}</span>
                      {editFocus === 'sticker' && <button onClick={clearSticker} className="text-red-400 hover:text-red-300"><Trash2 size={12}/></button>}
                    </label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[7px] font-bold text-white/30 uppercase">
                          <span>Scala Elemento</span>
                          <span className="text-brand-accent">{getActiveConfig().scale.toFixed(1)}x</span>
                        </div>
                        <input type="range" min="0.1" max="5" step="0.1" value={getActiveConfig().scale} onChange={(e)=>handleParamChange('scale', parseFloat(e.target.value))} className="w-full accent-brand-accent h-1.5 cursor-pointer" />
                      </div>
                      {editFocus !== 'separator' && (
                        <div className="grid grid-cols-2 gap-4 animate-slide-up">
                          <div className="space-y-1">
                            <label className="text-[7px] font-bold text-white/30 uppercase flex items-center gap-1"><Move size={8}/> Posizione X</label>
                            <input type="range" min="-300" max="300" value={getActiveConfig().x} onChange={(e)=>handleParamChange('x', parseInt(e.target.value))} className="w-full accent-white h-1.5 cursor-pointer" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[7px] font-bold text-white/30 uppercase flex items-center gap-1"><Move size={8}/> Posizione Y</label>
                            <input type="range" min="-300" max="300" value={getActiveConfig().y} onChange={(e)=>handleParamChange('y', parseInt(e.target.value))} className="w-full accent-white h-1.5 cursor-pointer" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={resetPositions} className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/50 transition-all active:scale-95 shadow-lg"><RotateCcw size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Reset Master</span></button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="bg-[#1a1638] rounded-2xl border border-white/10 flex flex-col h-[600px] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-black/60 space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <Folder size={14} className="text-white/50" />
                     <h3 className="text-[10px] font-black uppercase text-white/50 tracking-widest">I Tuoi Loghi</h3>
                   </div>
                   {customCategories.length > 0 && (
                     <button onClick={handleMasterToggle} className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${selectedIds.length === customCategories.length ? 'bg-brand-accent border-brand-accent text-black' : 'bg-white/5 border-white/10 text-white/20'}`}>
                       {selectedIds.length === customCategories.length ? <CheckSquare size={18} /> : <Square size={18} />}
                     </button>
                   )}
                 </div>
                 {selectedIds.length > 0 && (<div className="flex gap-2 animate-slide-up"><button onClick={handleDeleteSelected} className={`flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2`}><Trash2 size={14}/> <span className="text-[8px] font-black uppercase">Elimina Selezione</span></button></div>)}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {customCategories.length === 0 ? <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20"><Folder size={48} /><p className="text-[8px] font-black uppercase tracking-widest">Vuoto</p></div> : 
                  customCategories.map((cat) => (
                    <div key={cat.id} onClick={() => handleRowClick(cat)} className={`w-full flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer group ${selectedIds.includes(cat.id) ? 'bg-brand-accent/15 border-brand-accent shadow-lg shadow-brand-accent/5' : 'bg-black/30 border-white/5 hover:border-white/10'}`}>
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0" style={{ color: cat.color }}>
                        {renderArchiveIcon(cat, 18)}
                      </div>
                      <div className="ml-4 flex-1 text-left">
                        <p className="text-[10px] font-black uppercase truncate text-white">
                          {cat.text1}
                          {cat.showSeparator && <span className="mx-1" style={{ color: cat.color }}>{cat.separatorText}</span>}
                          <span style={{ color: cat.color }}>{cat.text2}</span>
                        </p>
                        <p className="text-[7px] font-bold text-white/30 uppercase truncate">{cat.subtitle}</p>
                      </div>
                      <button onClick={(e) => toggleSelection(e, cat)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${selectedIds.includes(cat.id) ? 'bg-brand-accent text-black shadow-inner' : 'bg-white/5 text-transparent border border-white/10'}`}><Check size={14} /></button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {/* AREA DI PREVIEW CENTRALE */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-[3rem] border-4 border-white/10 flex flex-col items-center justify-center p-8 shadow-2xl overflow-hidden bg-[#0a0a1a]">
            <div id="preview-scaler" className="relative z-10 transition-transform duration-100 ease-linear" style={{ transform: `scale(${previewScale * (logoSize === 'xl' ? 0.05 : logoSize === 'lg' ? 0.2 : 1)})`, transformOrigin: 'center center' }}>
               <BrandLogo id="active-logo-canvas" {...globalState} size={logoSize} sticker={globalState.showSticker ? globalState.sticker : null} stickerConfig={globalState.stickerConfig} />
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-6 bg-black/60 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/10 z-40 shadow-2xl animate-fade-in">
              <div className="flex flex-col gap-1 items-start min-w-[140px]">
                <label className="text-[7px] font-black text-brand-accent uppercase tracking-[0.2em] flex items-center gap-1">
                  <Maximize2 size={8}/> Scala Preview
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5.0" 
                  step="0.1" 
                  value={previewScale} 
                  onChange={(e) => setPreviewScale(parseFloat(e.target.value))} 
                  className="w-full accent-brand-accent h-1 cursor-pointer" 
                />
              </div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div className="flex gap-1.5">
                {['sm', 'md', 'lg', 'xl'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setLogoSize(s as any)} 
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border transition-all ${logoSize === s ? 'bg-brand-accent text-black border-brand-accent shadow-lg shadow-brand-accent/20' : 'bg-black/40 text-white/40 border-white/10 hover:border-white/30'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute bottom-6 flex gap-4 bg-black/80 p-3 rounded-full border border-white/20 z-30"><button onClick={downloadLogo} className="bg-brand-accent text-black px-8 py-2.5 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand-accent/20"><Download size={14}/> Scarica PNG</button></div>
          </div>
        </div>
      </div>
    </div>
  );
};
