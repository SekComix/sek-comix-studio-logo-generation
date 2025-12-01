import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateBrandIdentity, BrandIdentityResult } from '../services/geminiService';
import { ICON_MAP } from './icons'; // IMPORTIAMO LE ICONE DA QUI
import { 
  Download, Check, Sparkles, ArrowRight, Type, Palette as PaletteIcon, Grid, Sun, Moon,
  Maximize, History, Trash2, FileText, Plus, X, RotateCcw, PenTool, Minus, ZoomIn, ZoomOut, Monitor, CreditCard, Zap
} from 'lucide-react';

const BRAND_COLORS = [
  '#00f260', '#00ffff', '#ff00ff', '#ff9900', '#ff0055', '#cc00ff', '#ffff00'
];

const BG_OPTIONS = [
  { color: '#0f0c29', label: 'Dark' },
  { color: '#000000', label: 'Black' },
  { color: '#333333', label: 'Grey' },
  { color: '#ffffff', label: 'White' },
];

const FONT_OPTIONS = [
  { id: 'orbitron', label: 'Orbitron', family: '"Orbitron", sans-serif' },
  { id: 'anton', label: 'Anton', family: '"Anton", sans-serif' },
  { id: 'playfair', label: 'Playfair', family: '"Playfair Display", serif' },
  { id: 'montserrat', label: 'Montserrat', family: '"Montserrat", sans-serif' },
  { id: 'lobster', label: 'Lobster', family: '"Lobster", cursive' },
];

const DEFAULT_PRESETS = ['Viaggi', 'Cucina', 'Gaming', 'Musica', 'Tech', 'Matrimonio', 'Fitness'];

type DownloadSize = 'sm' | 'md' | 'lg' | 'xl';
type FontType = 'orbitron' | 'anton' | 'playfair' | 'montserrat' | 'lobster';

interface CustomUserIcon {
  id: string;
  name: string;
  data: string;
}

export const BrandKit: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [appDescription, setAppDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showManualControls, setShowManualControls] = useState(false);
  const [previewBg, setPreviewBg] = useState('#0f0c29');
  const [cinemaMode, setCinemaMode] = useState<string | null>(null);
  
  const [savedPresets, setSavedPresets] = useState<string[]>([]);
  const [downloadSize, setDownloadSize] = useState<DownloadSize>('md');
  const [customFilename, setCustomFilename] = useState('');
  const [logoTheme, setLogoTheme] = useState<'dark' | 'light'>('dark');

  const [brandName1, setBrandName1] = useState('SEK');
  const [brandName2, setBrandName2] = useState('COMIX');
  const [showSeparator, setShowSeparator] = useState(true);
  const [selectedFont, setSelectedFont] = useState<FontType>('orbitron');

  const [userIcons, setUserIcons] = useState<CustomUserIcon[]>([]);
  const [selectedCustomIconId, setSelectedCustomIconId] = useState<string | null>(null);
  const [iconTab, setIconTab] = useState<'standard' | 'custom'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentIdentity, setCurrentIdentity] = useState<BrandIdentityResult>({
    iconKey: 'palette',
    colorHex: '#00f260',
    subtitle: 'CREATOR STUDIO'
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [estimatedDims, setEstimatedDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const storedPresets = localStorage.getItem('sek_brand_presets');
    if (storedPresets) setSavedPresets(JSON.parse(storedPresets));
    else setSavedPresets(DEFAULT_PRESETS);

    const storedIcons = localStorage.getItem('sek_brand_custom_icons');
    if (storedIcons) setUserIcons(JSON.parse(storedIcons));
  }, []);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scaleFactor = 1;
    switch(downloadSize) {
      case 'sm': scaleFactor = 0.5; break;
      case 'md': scaleFactor = 1; break;
      case 'lg': scaleFactor = 2; break;
      case 'xl': scaleFactor = 4; break;
    }

    const activeFontObj = FONT_OPTIONS.find(f => f.id === selectedFont) || FONT_OPTIONS[0];
    const fontString = `900 120px ${activeFontObj.family}`;
    ctx.font = fontString; 
    
    const text1Width = ctx.measureText(brandName1).width;
    const plusWidth = ctx.measureText("+").width;
    const text2Width = ctx.measureText(brandName2).width;
    const spacing = 30;
    const iconSpace = 250;
    
    let middleWidth = showSeparator ? (spacing + plusWidth + spacing) : spacing;
    const baseWidth = Math.max(1200, iconSpace + text1Width + middleWidth + text2Width + 200);
    const baseHeight = 500;

    setEstimatedDims({
      w: Math.round(baseWidth * scaleFactor),
      h: Math.round(baseHeight * scaleFactor)
    });
  }, [brandName1, brandName2, showSeparator, selectedFont, downloadSize]);

  const savePreset = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed || savedPresets.some(p => p.toLowerCase() === trimmed.toLowerCase())) return;
    const newPresets = [trimmed, ...savedPresets];
    setSavedPresets(newPresets);
    localStorage.setItem('sek_brand_presets', JSON.stringify(newPresets));
  };

  const clearPresets = () => {
    setSavedPresets(DEFAULT_PRESETS);
    localStorage.setItem('sek_brand_presets', JSON.stringify(DEFAULT_PRESETS));
  };

  const handleResetBrandName = () => {
    setBrandName1('SEK');
    setBrandName2('COMIX');
    setShowSeparator(true);
    setSelectedFont('orbitron');
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
         alert("L'immagine è troppo grande. Usa un file sotto 5MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const name = prompt("Dai un nome a questa icona:", file.name.split('.')[0]) || "Icona";
        const newIcon: CustomUserIcon = { id: Date.now().toString(), name: name.substring(0, 15), data: base64 };
        const updatedList = [newIcon, ...userIcons];
        setUserIcons(updatedList);
        localStorage.setItem('sek_brand_custom_icons', JSON.stringify(updatedList));
        setSelectedCustomIconId(newIcon.id);
        setIconTab('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteCustomIcon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Vuoi davvero cancellare questa icona?")) {
      const updated = userIcons.filter(icon => icon.id !== id);
      setUserIcons(updated);
      localStorage.setItem('sek_brand_custom_icons', JSON.stringify(updated));
      if (selectedCustomIconId === id) setSelectedCustomIconId(null);
    }
  };

  const handleGenerateIdentity = async (overrideInput?: string) => {
    const inputToUse = overrideInput || appDescription;
    if (!inputToUse.trim()) return;
    if (overrideInput) setAppDescription(overrideInput);

    setIsAiLoading(true);
    setShowManualControls(false); 
    setSelectedCustomIconId(null); 
    setIconTab('standard');

    try {
      const result = await generateBrandIdentity(inputToUse);
      const safeResult = {
          ...result,
          iconKey: ICON_MAP[result.iconKey] ? result.iconKey : 'palette'
      };
      setCurrentIdentity(safeResult);
      savePreset(inputToUse);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const updateIdentity = (updates: Partial<BrandIdentityResult>) => {
    setCurrentIdentity(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = (theme: 'dark' | 'light') => {
    setLogoTheme(theme);
    setPreviewBg(theme === 'light' ? '#ffffff' : '#0f0c29');
  };

  const downloadLogo = async () => {
    setDownloadStatus('generating');
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scaleFactor = 1;
    switch(downloadSize) {
      case 'sm': scaleFactor = 0.5; break;
      case 'md': scaleFactor = 1; break;
      case 'lg': scaleFactor = 2; break;
      case 'xl': scaleFactor = 4; break;
    }

    const activeFontObj = FONT_OPTIONS.find(f => f.id === selectedFont) || FONT_OPTIONS[0];
    const fontString = `900 120px ${activeFontObj.family}`;
    const fontStringLight = `300 120px ${activeFontObj.family}`;

    ctx.font = fontString; 
    const text1Width = ctx.measureText(brandName1).width;
    const plusWidth = ctx.measureText("+").width;
    const text2Width = ctx.measureText(brandName2).width;
    const spacing = 30;
    const iconSpace = 250; 
    
    let middleWidth = showSeparator ? (spacing + plusWidth + spacing) : spacing;
    const totalContentWidth = iconSpace + text1Width + middleWidth + text2Width;
    const baseWidth = Math.max(1200, totalContentWidth + 200); 
    const baseHeight = 500;
    
    canvas.width = baseWidth * scaleFactor;
    canvas.height = baseHeight * scaleFactor; 
    ctx.scale(scaleFactor, scaleFactor);

    ctx.clearRect(0, 0, baseWidth, baseHeight);
    const baseFill = logoTheme === 'dark' ? '#ffffff' : '#0f0c29';
    const startX = (baseWidth - totalContentWidth) / 2 + 100;
    const centerY = 220;
    const accentColor = currentIdentity.colorHex;

    const finishDrawing = (imageObj: HTMLImageElement | null) => {
      const iconCenterX = startX - 120;
      ctx.save();
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 60;
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(iconCenterX, centerY, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (imageObj) {
        const size = 100;
        if (logoTheme === 'dark') {
            ctx.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.2))';
        }
        const scale = Math.min(size / imageObj.width, size / imageObj.height);
        const w = imageObj.width * scale;
        const h = imageObj.height * scale;
        ctx.drawImage(imageObj, iconCenterX - 50 + (size - w) / 2, centerY - 50 + (size - h) / 2, w, h);
        ctx.filter = 'none';
      }

      ctx.font = fontString;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = logoTheme === 'dark' ? accentColor : 'transparent';
      ctx.shadowBlur = logoTheme === 'dark' ? 20 : 0;
      ctx.fillStyle = baseFill;
      ctx.fillText(brandName1, startX, centerY);

      let currentX = startX + text1Width;
      if (showSeparator) {
        ctx.font = fontStringLight;
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 0;
        ctx.fillText("+", currentX + spacing, centerY);
        currentX += spacing + plusWidth + spacing;
      } else {
        currentX += spacing;
      }

      ctx.font = fontString;
      const gradient = ctx.createLinearGradient(currentX, 0, currentX + text2Width, 0);
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(1, '#0575E6'); 
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 0; 
      ctx.fillText(brandName2, currentX, centerY);

      if (currentIdentity.subtitle) {
        ctx.font = `bold 40px "Inter", sans-serif`;
        ctx.fillStyle = accentColor;
        ctx.letterSpacing = "10px";
        ctx.textAlign = 'right';
        ctx.fillText(currentIdentity.subtitle, currentX + text2Width, centerY + 100); 
      }
      triggerDownload();
    };

    const triggerDownload = () => {
      const link = document.createElement('a');
      const filenameTheme = logoTheme === 'dark' ? 'DarkMode' : 'LightMode';
      const cleanSubtitle = currentIdentity.subtitle.replace(/[^a-zA-Z0-9]/g, '');
      const finalName = customFilename.trim() 
        ? `${customFilename.trim()}.png`
        : `Logo-${brandName1}${brandName2}-${cleanSubtitle}-${filenameTheme}-${downloadSize}.png`;
        
      link.download = finalName;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    };

    const activeCustomImgData = selectedCustomIconId 
       ? userIcons.find(i => i.id === selectedCustomIconId)?.data 
       : null;

    if (activeCustomImgData) {
        const img = new Image();
        img.onload = () => finishDrawing(img);
        img.src = activeCustomImgData;
    } else {
        const iconPath = ICON_MAP[currentIdentity.iconKey]?.path || ICON_MAP['palette'].path;
        const iconSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="${baseFill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${iconPath}
        </svg>
        `;
        const img = new Image();
        const svgBlob = new Blob([iconSvgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            finishDrawing(img);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
  };

  const activeCustomImageSrc = selectedCustomIconId 
      ? userIcons.find(i => i.id === selectedCustomIconId)?.data 
      : null;

  const categorizedIcons: Record<string, string[]> = {};
  Object.keys(ICON_MAP).forEach(key => {
     const cat = ICON_MAP[key].category;
     if (!categorizedIcons[cat]) categorizedIcons[cat] = [];
     categorizedIcons[cat].push(key);
  });

  return (
    <div className="w-full max-w-5xl mx-auto mt-24 mb-20 px-4 relative">
      
      {/* CINEMA MODE OVERLAY */}
      {cinemaMode && (
         <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 animate-fade-in">
            <button 
              onClick={() => setCinemaMode(null)} 
              className="absolute top-4 right-4 text-white hover:text-red-500 z-50 bg-black/50 rounded-full p-2"
            >
              <X size={32} />
            </button>
            
            {/* NEON */}
            {cinemaMode === 'neon' && (
              <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
                 <div className="absolute inset-0 bg-[#0a0a0a]" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1638 0%, #000000 100%)' }}></div>
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #333 19px, #333 20px), repeating-linear-gradient(90deg, transparent, transparent 39px, #333 39px, #333 40px)' }}></div>
                 
                 <div className="relative transform scale-150 md:scale-[2] filter drop-shadow-[0_0_25px_rgba(0,242,96,0.9)]">
                    <BrandLogo key={downloadSize} size="xl" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="dark" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} />
                 </div>
              </div>
            )}

            {/* CARD */}
            {cinemaMode === 'card' && (
               <div className="relative w-full h-full flex items-center justify-center bg-[#e0e0e0]">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="bg-white w-[600px] h-[350px] shadow-2xl flex items-center justify-center transform scale-75 md:scale-100" style={{ borderRadius: '20px' }}>
                      <BrandLogo key={downloadSize} size="xl" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="light" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} />
                  </div>
               </div>
            )}

            {/* GLASS */}
            {cinemaMode === 'glass' && (
               <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(45deg, ${currentIdentity.colorHex}44, transparent)` }}></div>
                  <div className="w-full max-w-4xl h-64 bg-white/5 backdrop-blur-xl border-y border-white/10 flex items-center justify-center transform scale-110">
                      <BrandLogo key={downloadSize} size="xl" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="dark" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} />
                  </div>
               </div>
            )}
         </div>
      )}
      
      <div className="bg-[#1a1638] border border-brand-accent/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          
          {/* LEFT SIDE: CONTROLS */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-brand font-bold text-white mb-2 uppercase flex items-center gap-3"><Sparkles className="text-brand-accent" /> Logo Generator</h2>
              <p className="text-gray-400">Scegli una categoria rapida o descrivi la tua nuova app.</p>
            </div>

            {/* AI Generator */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
               <div className="flex flex-wrap gap-2">
                {savedPresets.map((preset) => (
                  <button key={preset} onClick={() => handleGenerateIdentity(preset)} className="px-3 py-1.5 bg-white/5 hover:bg-brand-accent hover:text-black border border-white/10 rounded-full text-xs transition-all">{preset}</button>
                ))}
                <button onClick={clearPresets} className="text-[10px] text-red-400 p-1"><Trash2 size={12} /></button>
              </div>
              <div className="flex gap-2">
                <input type="text" value={appDescription} onChange={(e) => setAppDescription(e.target.value)} placeholder="Nuova categoria..." className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-white focus:ring-1 focus:ring-brand-accent outline-none text-sm" onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdentity()} />
                <button onClick={() => handleGenerateIdentity()} disabled={isAiLoading} className="bg-brand-accent text-black p-2 rounded-xl">{isAiLoading ? <Sparkles className="animate-spin" /> : <ArrowRight />}</button>
              </div>
            </div>
            
            {/* MANUAL CONTROLS */}
            <div className="space-y-5 bg-white/5 p-5 rounded-2xl border border-white/10">
                 {/* Name */}
                 <div>
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2"><PenTool size={14} /> Nome Brand</label>
                   <div className="flex gap-2 items-center">
                        <input type="text" value={brandName1} onChange={(e) => setBrandName1(e.target.value.toUpperCase())} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm font-bold text-white text-center focus:border-brand-accent outline-none" placeholder="SEK"/>
                        <button onClick={() => setShowSeparator(!showSeparator)} className={`p-2 rounded-lg ${showSeparator ? 'text-brand-accent' : 'text-gray-500'}`}>{showSeparator ? <Plus size={16} /> : <Minus size={16} />}</button>
                        <input type="text" value={brandName2} onChange={(e) => setBrandName2(e.target.value.toUpperCase())} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-sm font-bold text-white text-center focus:border-brand-accent outline-none" placeholder="COMIX"/>
                   </div>
                   <div className="flex justify-end mt-1"><button onClick={handleResetBrandName} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1"><RotateCcw size={10} /> Reset Nomi</button></div>
                 </div>

                 {/* Theme & Fonts */}
                 <div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mb-3">
                      <button onClick={() => toggleTheme('dark')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex gap-2 justify-center ${logoTheme === 'dark' ? 'bg-[#0f0c29] text-white' : 'text-gray-400'}`}><Moon size={12} /> Dark</button>
                      <button onClick={() => toggleTheme('light')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex gap-2 justify-center ${logoTheme === 'light' ? 'bg-gray-200 text-black' : 'text-gray-400'}`}><Sun size={12} /> Light</button>
                    </div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Font</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FONT_OPTIONS.map((font) => (
                        <button key={font.id} onClick={() => setSelectedFont(font.id as FontType)} className={`py-1 px-1 text-[10px] rounded-lg border ${selectedFont === font.id ? 'bg-brand-accent text-black border-brand-accent' : 'border-white/10 text-gray-400'}`} style={{ fontFamily: font.family }}>{font.label}</button>
                      ))}
                    </div>
                 </div>

                 {/* Colors */}
                 <div>
                   <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Colore</label>
                   <div className="flex gap-2 flex-wrap">
                      {BRAND_COLORS.map(color => (
                        <button key={color} onClick={() => updateIdentity({ colorHex: color })} className={`w-6 h-6 rounded-full border-2 ${currentIdentity.colorHex === color ? 'border-white scale-110' : 'border-transparent opacity-50'}`} style={{ backgroundColor: color }} />
                      ))}
                      <input type="color" value={currentIdentity.colorHex} onChange={(e) => updateIdentity({ colorHex: e.target.value })} className="w-6 h-6 rounded-full overflow-hidden cursor-pointer border-0 p-0" />
                   </div>
                 </div>

                 {/* Icons Toggle */}
                 <button onClick={() => setShowManualControls(!showManualControls)} className="w-full text-xs bg-white/5 py-2 rounded-lg text-gray-400 hover:text-white border border-white/5">
                   {showManualControls ? 'Chiudi Icone' : 'Scegli Icona / Carica Immagine'}
                 </button>
                 
                 {showManualControls && (
                     <div className="bg-black/20 rounded-xl p-3 border border-white/5 animate-fade-in">
                        <div className="flex gap-2 mb-2 pb-2 border-b border-white/10">
                          <button onClick={() => setIconTab('standard')} className={`flex-1 text-[10px] font-bold py-1 rounded ${iconTab === 'standard' ? 'bg-brand-accent text-black' : 'text-gray-400'}`}>Standard</button>
                          <button onClick={() => setIconTab('custom')} className={`flex-1 text-[10px] font-bold py-1 rounded ${iconTab === 'custom' ? 'bg-brand-accent text-black' : 'text-gray-400'}`}>Uploads</button>
                        </div>
                        {iconTab === 'standard' ? (
                          <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-3">
                              {Object.keys(categorizedIcons).map(cat => (
                                <div key={cat}>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1">{cat}</h4>
                                    <div className="grid grid-cols-5 gap-2">
                                        {categorizedIcons[cat].map(key => (
                                            <button key={key} onClick={() => { updateIdentity({ iconKey: key }); setSelectedCustomIconId(null); }} className={`aspect-square rounded flex items-center justify-center transition-all ${currentIdentity.iconKey === key && !selectedCustomIconId ? 'bg-brand-accent text-black scale-110' : 'bg-black/40 text-gray-500 hover:bg-white/10 hover:text-white'}`} title={ICON_MAP[key].label}>
                                                {React.cloneElement(ICON_MAP[key].component as any, { size: 16 })}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                              <button onClick={() => fileInputRef.current?.click()} className="aspect-square border border-dashed border-white/20 rounded flex items-center justify-center text-gray-500 hover:text-brand-accent"><Plus size={16}/></button>
                              <input type="file" ref={fileInputRef} onChange={handleIconUpload} accept="image/*" className="hidden" />
                              {userIcons.map(icon => (
                                <div key={icon.id} className="relative group/item">
                                  <button onClick={() => setSelectedCustomIconId(icon.id)} className={`w-full aspect-square rounded border overflow-hidden ${selectedCustomIconId === icon.id ? 'border-brand-accent' : 'border-transparent bg-black/40'}`}><img src={icon.data} className="w-full h-full object-contain" /></button>
                                  <button onClick={(e) => deleteCustomIcon(icon.id, e)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/item:opacity-100"><X size={8}/></button>
                                </div>
                              ))}
                          </div>
                        )}
                     </div>
                 )}
              </div>
          </div>

          {/* RIGHT SIDE: PREVIEW & DOWNLOAD */}
          <div className="flex flex-col space-y-4">
            
            <div className="flex justify-between items-end px-2">
              <div><span className="text-[10px] uppercase text-gray-500 font-bold block">Risoluzione Reale</span><span className="text-xl font-mono text-brand-accent font-bold tracking-tight">{estimatedDims.w} x {estimatedDims.h} <span className="text-xs text-gray-500">px</span></span></div>
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10">
                 <button onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))} className="p-1 hover:text-white text-gray-400"><ZoomOut size={14}/></button>
                 <input type="range" min="0.1" max="2" step="0.1" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
                 <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))} className="p-1 hover:text-white text-gray-400"><ZoomIn size={14}/></button>
                 <button onClick={() => setZoomLevel(1)} className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded text-gray-300 hover:text-white">RESET</button>
              </div>
            </div>

            <div className="w-full h-[300px] border-2 border-dashed border-white/10 rounded-2xl overflow-hidden relative group" style={{ backgroundColor: previewBg }}>
              <div className="absolute top-2 right-2 z-20 flex gap-2">
                 {BG_OPTIONS.map((opt) => (
                    <button key={opt.color} onClick={() => setPreviewBg(opt.color)} className={`w-4 h-4 rounded-full border border-white/20 ${previewBg === opt.color ? 'ring-1 ring-white' : ''}`} style={{ backgroundColor: opt.color }} />
                 ))}
              </div>
              <div className="w-full h-full flex items-center justify-center overflow-auto cursor-move custom-scrollbar" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.1s ease-out' }}>
                 <div className="pointer-events-none select-none transform transition-all duration-500 ease-out origin-center">
                    <BrandLogo key={downloadSize} size={downloadSize} customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme={logoTheme} text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} />
                 </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
               <label className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Maximize size={14} /> Taglia Export</label>
               <div className="grid grid-cols-4 gap-2 mb-4">
                 {[{ id: 'sm', label: 'S (Web)' }, { id: 'md', label: 'M (HD)' }, { id: 'lg', label: 'L (2K)' }, { id: 'xl', label: 'XL (4K)' }].map((s) => (
                   <button key={s.id} onClick={() => { setDownloadSize(s.id as DownloadSize); setZoomLevel(1); }} className={`py-2 text-xs font-bold rounded-lg transition-all ${downloadSize === s.id ? 'bg-brand-accent text-black' : 'bg-black/30 text-gray-400 hover:text-white'}`}>{s.label}</button>
                 ))}
               </div>
               <div className="flex bg-black/30 rounded-lg border border-white/10 mb-4">
                  <input type="text" value={customFilename} onChange={(e) => setCustomFilename(e.target.value)} placeholder={`${brandName1}...`} className="bg-transparent w-full px-3 py-2 text-sm text-white outline-none"/><div className="px-3 py-2 text-xs text-gray-500 bg-white/5 border-l border-white/5">.png</div>
               </div>
               <button onClick={downloadLogo} disabled={downloadStatus === 'generating'} className={`w-full py-3 rounded-xl font-brand font-bold text-lg flex items-center justify-center gap-3 transition-all ${downloadStatus === 'done' ? 'bg-green-500 text-black' : 'bg-gradient-to-r from-[#302b63] to-[#24243e] hover:from-brand-accent hover:to-brand-accent2 hover:text-white border border-white/10'}`}>
                 {downloadStatus === 'generating' ? '...' : downloadStatus === 'done' ? <Check /> : <><Download /> SCARICA</>}
               </button>
            </div>

            <div className="bg-gradient-to-br from-[#0f0c29] to-[#1a1638] p-4 rounded-xl border border-brand-accent/20">
               <h3 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4 flex items-center gap-2"><Monitor size={16} /> Vetrina Clienti (Clicca)</h3>
               <div className="space-y-6">
                  {/* Neon */}
                  <div onClick={() => setCinemaMode('neon')} className="relative h-40 rounded-lg overflow-hidden border border-white/5 shadow-2xl group cursor-pointer hover:border-brand-accent/50 transition-colors">
                     <div className="absolute inset-0 bg-[#0a0a0a]" style={{ backgroundImage: 'radial-gradient(circle at center, #1a1638 0%, #000000 100%)' }}></div>
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #333 19px, #333 20px), repeating-linear-gradient(90deg, transparent, transparent 39px, #333 39px, #333 40px)' }}></div>
                     <div className="absolute inset-0 flex items-center justify-center transform scale-75 group-hover:scale-90 transition-transform duration-700">
                        <div className="filter drop-shadow-[0_0_15px_rgba(0,242,96,0.8)]"><BrandLogo size="lg" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="dark" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} /></div>
                     </div>
                  </div>
                  {/* Card */}
                  <div onClick={() => setCinemaMode('card')} className="relative h-40 rounded-lg overflow-hidden border border-white/5 bg-[#e0e0e0] group cursor-pointer hover:border-brand-accent/50 transition-colors">
                     <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white w-64 h-36 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:rotate-0" style={{ transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg) rotateZ(2deg)' }}>
                           <div className="transform scale-50"><BrandLogo size="md" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="light" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} /></div>
                        </div>
                     </div>
                  </div>
                  {/* Glass */}
                  <div onClick={() => setCinemaMode('glass')} className="relative h-40 rounded-lg overflow-hidden border border-white/5 bg-gray-900 group cursor-pointer hover:border-brand-accent/50 transition-colors">
                     <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(45deg, ${currentIdentity.colorHex}44, transparent)` }}></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-24 bg-white/5 backdrop-blur-md border-y border-white/10 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                             <BrandLogo size="lg" customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined} customImageSrc={activeCustomImageSrc} customColor={currentIdentity.colorHex} subtitle={currentIdentity.subtitle} theme="dark" text1={brandName1} text2={brandName2} showSeparator={showSeparator} font={selectedFont} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
