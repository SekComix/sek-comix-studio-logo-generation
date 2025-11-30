import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from './BrandLogo';
import { generateBrandIdentity, BrandIdentityResult } from '../services/geminiService';
import { 
  Download, Check, Sparkles, ArrowRight, Type, Palette as PaletteIcon, Grid, Sun, Moon,
  Palette, Utensils, Camera, Heart, Code, Music, Dumbbell, Briefcase, Plane, Gamepad2, ShoppingCart, Book, Car, Home, Leaf,
  Maximize, History, Trash2, FileText, Upload, Image as ImageIcon, Plus, X, RotateCcw, PenTool, Minus
} from 'lucide-react';

// Dictionary of Standard Icons
const ICON_MAP: Record<string, { component: React.ReactNode, path: string, label: string }> = {
  'palette': { 
    component: <Palette size={40} strokeWidth={2.5} />, 
    label: 'Arte',
    path: "M13.5 2h-9A4.5 4.5 0 0 0 0 6.5v9A4.5 4.5 0 0 0 4.5 20h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 13.5 2zM7 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" 
  },
  'utensils': { component: <Utensils size={40} strokeWidth={2.5} />, label: 'Cibo', path: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" },
  'camera': { component: <Camera size={40} strokeWidth={2.5} />, label: 'Foto', path: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  'heart': { component: <Heart size={40} strokeWidth={2.5} />, label: 'Salute', path: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" },
  'code': { component: <Code size={40} strokeWidth={2.5} />, label: 'Tech', path: "M16 18l6-6-6-6 M8 6l-6 6 6 6" },
  'music': { component: <Music size={40} strokeWidth={2.5} />, label: 'Musica', path: "M9 18V5l12-2v13 M9 9l12-2 M9 19a3 3 0 1 1-3-3 3 3 0 0 1 3 3 M21 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3" },
  'dumbbell': { component: <Dumbbell size={40} strokeWidth={2.5} />, label: 'Sport', path: "M6.5 6.5l11 11 M21 21l-1-1 M3 3l1 1 M18 22l4-4 M2 6l4-4 M3 10l7-7 M14 21l7-7" },
  'briefcase': { component: <Briefcase size={40} strokeWidth={2.5} />, label: 'Lavoro', path: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 11h20 M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9" },
  'plane': { component: <Plane size={40} strokeWidth={2.5} />, label: 'Viaggi', path: "M2 12h20 M13 12l3-7 M6 12l3 7" },
  'gamepad': { component: <Gamepad2 size={40} strokeWidth={2.5} />, label: 'Giochi', path: "M6 11h4 M8 9v4 M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M18 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M2 12c0-4.4 3.6-8 8-8h4c4.4 0 8 3.6 8 8v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-1z" },
  'shopping-cart': { component: <ShoppingCart size={40} strokeWidth={2.5} />, label: 'Shop', path: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" },
  'book': { component: <Book size={40} strokeWidth={2.5} />, label: 'Libri', path: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
  'car': { component: <Car size={40} strokeWidth={2.5} />, label: 'Auto', path: "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-1l-4.72-1.06a3 3 0 0 0-1.22-.32H7.78a3 3 0 0 0-1.22.32L1.84 11.85a1 1 0 0 0-.84 1V16h3m15 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-15 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" },
  'home': { component: <Home size={40} strokeWidth={2.5} />, label: 'Casa', path: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  'leaf': { component: <Leaf size={40} strokeWidth={2.5} />, label: 'Natura', path: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 .5 3.5-.6 9.2A7 7 0 0 1 11 20ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" }
};

const BRAND_COLORS = [
  '#00f260', // Neon Green (Default)
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ff9900', // Orange
  '#ff0055', // Red/Pink
  '#cc00ff', // Purple
  '#ffff00', // Yellow
];

const BG_OPTIONS = [
  { color: '#0f0c29', label: 'Dark' },
  { color: '#000000', label: 'Black' },
  { color: '#333333', label: 'Grey' },
  { color: '#ffffff', label: 'White' },
];

const DEFAULT_PRESETS = ['Viaggi', 'Cucina', 'Gaming', 'Musica', 'Tech', 'Matrimonio', 'Fitness'];

type DownloadSize = 'sm' | 'md' | 'lg' | 'xl';

// Interface for User Uploaded Icons
interface CustomUserIcon {
  id: string;
  name: string;
  data: string; // Base64
}

export const BrandKit: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating' | 'done'>('idle');
  const [appDescription, setAppDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showManualControls, setShowManualControls] = useState(false);
  const [previewBg, setPreviewBg] = useState('#0f0c29');
  
  const [savedPresets, setSavedPresets] = useState<string[]>([]);
  const [downloadSize, setDownloadSize] = useState<DownloadSize>('md');
  const [customFilename, setCustomFilename] = useState('');
  const [logoTheme, setLogoTheme] = useState<'dark' | 'light'>('dark');

  // NAME EDITING STATE
  const [brandName1, setBrandName1] = useState('SEK');
  const [brandName2, setBrandName2] = useState('COMIX');
  const [showSeparator, setShowSeparator] = useState(true); // Toggle for "+"

  // Custom Icon Library State
  const [userIcons, setUserIcons] = useState<CustomUserIcon[]>([]);
  const [selectedCustomIconId, setSelectedCustomIconId] = useState<string | null>(null);
  const [iconTab, setIconTab] = useState<'standard' | 'custom'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentIdentity, setCurrentIdentity] = useState<BrandIdentityResult>({
    iconKey: 'palette',
    colorHex: '#00f260',
    subtitle: 'CREATOR STUDIO'
  });

  // Load presets and custom icons from storage
  useEffect(() => {
    const storedPresets = localStorage.getItem('sek_brand_presets');
    if (storedPresets) setSavedPresets(JSON.parse(storedPresets));
    else setSavedPresets(DEFAULT_PRESETS);

    const storedIcons = localStorage.getItem('sek_brand_custom_icons');
    if (storedIcons) setUserIcons(JSON.parse(storedIcons));
  }, []);

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
  };

  // --- CUSTOM ICON LOGIC ---
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit check (Increased from 1MB)
         alert("L'immagine è troppo grande. Usa un file sotto 5MB.");
         return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Prompt for name
        const name = prompt("Dai un nome a questa icona:", file.name.split('.')[0]) || "Icona";
        
        const newIcon: CustomUserIcon = {
          id: Date.now().toString(),
          name: name.substring(0, 15),
          data: base64
        };

        const updatedList = [newIcon, ...userIcons];
        setUserIcons(updatedList);
        localStorage.setItem('sek_brand_custom_icons', JSON.stringify(updatedList));
        
        // Auto-select uploaded icon
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
    // Reset custom icon selection when generating new standard ID
    setSelectedCustomIconId(null); 
    setIconTab('standard');

    try {
      const result = await generateBrandIdentity(inputToUse);
      setCurrentIdentity(result);
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

  // --- DOWNLOAD LOGIC (UPDATED FOR IMAGES) ---
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

    // Dynamic Width Calculation based on text length
    ctx.font = `900 120px "Orbitron", sans-serif`; 
    const text1Width = ctx.measureText(brandName1).width;
    const plusWidth = ctx.measureText("+").width;
    const text2Width = ctx.measureText(brandName2).width;
    const spacing = 30;
    const iconSpace = 250; // Space for icon + margins
    
    // Logic handles if Separator is hidden
    let middleWidth = 0;
    if (showSeparator) {
        middleWidth = spacing + plusWidth + spacing;
    } else {
        middleWidth = spacing; // Just one spacing between words
    }

    // Calculate total needed width + padding
    const totalContentWidth = iconSpace + text1Width + middleWidth + text2Width;
    const baseWidth = Math.max(1200, totalContentWidth + 200); // Minimum 1200 or fit content
    const baseHeight = 500;
    
    canvas.width = baseWidth * scaleFactor;
    canvas.height = baseHeight * scaleFactor; 
    ctx.scale(scaleFactor, scaleFactor);

    ctx.clearRect(0, 0, baseWidth, baseHeight);

    const fontSize = 120;
    const fontBase = `${fontSize}px "Orbitron", sans-serif`;
    const baseFill = logoTheme === 'dark' ? '#ffffff' : '#0f0c29';
    
    // Centering Logic
    const startX = (baseWidth - totalContentWidth) / 2 + 100; // Start drawing text after icon area
    const centerY = 220;
    const accentColor = currentIdentity.colorHex;

    // Helper to finish drawing after image/icon is ready
    const finishDrawing = (imageObj: HTMLImageElement | null) => {
      // Icon Position (Relative to Text Start)
      const iconCenterX = startX - 120;

      // Glow
      ctx.save();
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 60;
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(iconCenterX, centerY, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Image or SVG
      if (imageObj) {
        // Draw Image (Custom or SVG converted)
        const size = 100;
        // If theme is dark, image might need drop shadow if transparent PNG
        if (logoTheme === 'dark') {
            ctx.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.2))';
        }
        
        const imgX = iconCenterX - 50;
        const imgY = centerY - 50;
        
        // Simple Aspect Fit:
        const scale = Math.min(size / imageObj.width, size / imageObj.height);
        const w = imageObj.width * scale;
        const h = imageObj.height * scale;
        const offsetX = (size - w) / 2;
        const offsetY = (size - h) / 2;

        ctx.drawImage(imageObj, imgX + offsetX, imgY + offsetY, w, h);
        ctx.filter = 'none'; // reset
      }

      // Text 1: (Brand Name 1)
      ctx.font = `900 ${fontBase}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = logoTheme === 'dark' ? accentColor : 'transparent';
      ctx.shadowBlur = logoTheme === 'dark' ? 20 : 0;
      ctx.fillStyle = baseFill;
      ctx.fillText(brandName1, startX, centerY);

      // Separator and Text 2 Position
      let currentX = startX + text1Width;

      if (showSeparator) {
        // Draw +
        ctx.font = `300 ${fontBase}`;
        ctx.fillStyle = accentColor;
        ctx.shadowBlur = 0;
        ctx.fillText("+", currentX + spacing, centerY);
        currentX += spacing + plusWidth + spacing;
      } else {
        // Add just spacing
        currentX += spacing;
      }

      // Text 2: (Brand Name 2)
      ctx.font = `900 ${fontBase}`;
      const gradient = ctx.createLinearGradient(currentX, 0, currentX + text2Width, 0);
      gradient.addColorStop(0, accentColor);
      gradient.addColorStop(1, '#0575E6'); 
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 0; // Reset blur for gradient text
      ctx.fillText(brandName2, currentX, centerY);

      // Subtitle (Align to end of second word)
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

    // LOAD IMAGE SOURCE
    const activeCustomImgData = selectedCustomIconId 
       ? userIcons.find(i => i.id === selectedCustomIconId)?.data 
       : null;

    if (activeCustomImgData) {
        // Load User Custom Image
        const img = new Image();
        img.onload = () => finishDrawing(img);
        img.src = activeCustomImgData;
    } else {
        // Load Standard SVG
        const iconSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="${baseFill}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${ICON_MAP[currentIdentity.iconKey]?.path || ICON_MAP['palette'].path}
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

  // Get active custom image data for preview
  const activeCustomImageSrc = selectedCustomIconId 
      ? userIcons.find(i => i.id === selectedCustomIconId)?.data 
      : null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-24 mb-20 px-4">
      
      <div className="bg-[#1a1638] border border-brand-accent/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          
          {/* LEFT: Controls */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-brand font-bold text-white mb-2 uppercase flex items-center gap-3">
                <Sparkles className="text-brand-accent" />
                Logo Generator
              </h2>
              <p className="text-gray-400">
                Scegli una categoria rapida o descrivi la tua nuova app.
              </p>
            </div>

            {/* Quick Choices */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <History size={14} /> Categorie Rapide
                </label>
                <button onClick={clearPresets} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 size={10} /> Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleGenerateIdentity(preset)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-brand-accent hover:text-black border border-white/10 rounded-full text-sm transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator */}
            <div className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Nuova Categoria
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="Es. Palestra, News, Finanza..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-accent outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdentity()}
                />
                <button 
                  onClick={() => handleGenerateIdentity()}
                  disabled={isAiLoading || !appDescription.trim()}
                  className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  <ArrowRight />
                </button>
              </div>
              
              <button 
                onClick={() => handleGenerateIdentity()}
                disabled={isAiLoading || !appDescription.trim()}
                className={`
                  w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${isAiLoading 
                    ? 'bg-brand-accent/20 text-brand-accent cursor-wait' 
                    : 'bg-brand-accent text-[#0f0c29] hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,96,0.4)]'}
                `}
              >
                {isAiLoading ? 'Analisi in corso...' : <><Sparkles size={18} /> Genera Identità</>}
              </button>
            </div>
            
            {/* MANUAL CONTROLS */}
            <div className="space-y-5 animate-fade-in bg-white/5 p-5 rounded-2xl border border-white/10 mt-4">
                 
                 {/* Name Editing Section */}
                 <div>
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                     <PenTool size={14} /> Nome Brand
                   </label>
                   <div className="flex flex-col gap-2">
                     <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={brandName1} 
                          onChange={(e) => setBrandName1(e.target.value.toUpperCase())}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white text-center focus:border-brand-accent outline-none"
                          placeholder="SEK"
                        />
                        <button 
                           onClick={() => setShowSeparator(!showSeparator)}
                           className={`p-2 rounded-lg font-bold text-sm transition-colors ${showSeparator ? 'text-brand-accent bg-brand-accent/10' : 'text-gray-500 bg-white/5'}`}
                           title={showSeparator ? "Nascondi separatore" : "Mostra separatore"}
                        >
                           {showSeparator ? <Plus size={16} /> : <Minus size={16} />}
                        </button>
                        <input 
                          type="text" 
                          value={brandName2} 
                          onChange={(e) => setBrandName2(e.target.value.toUpperCase())}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white text-center focus:border-brand-accent outline-none"
                          placeholder="COMIX"
                        />
                     </div>
                     <div className="flex justify-end">
                        <button 
                           onClick={handleResetBrandName} 
                           className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          <RotateCcw size={10} /> Ripristina originale
                        </button>
                     </div>
                   </div>
                 </div>

                 {/* Theme Toggle */}
                 <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                       <Sun size={14} /> Versione Logo (Contrasto)
                    </label>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                      <button onClick={() => toggleTheme('dark')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${logoTheme === 'dark' ? 'bg-[#0f0c29] text-white shadow-lg border border-brand-accent/30' : 'text-gray-400 hover:text-white'}`}>
                         <Moon size={14} /> Scuri
                      </button>
                      <button onClick={() => toggleTheme('light')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${logoTheme === 'light' ? 'bg-gray-200 text-[#0f0c29] shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                         <Sun size={14} /> Chiari
                      </button>
                    </div>
                 </div>

                 {/* Subtitle */}
                 <div>
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                     <Type size={14} /> Sottotitolo
                   </label>
                   <input 
                      type="text"
                      value={currentIdentity.subtitle}
                      onChange={(e) => updateIdentity({ subtitle: e.target.value.toUpperCase() })}
                      maxLength={30}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-accent outline-none font-bold tracking-widest"
                   />
                 </div>

                 {/* Color */}
                 <div>
                   <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                     <PaletteIcon size={14} /> Colore Tema
                   </label>
                   <div className="flex gap-2 flex-wrap">
                      {BRAND_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => updateIdentity({ colorHex: color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${currentIdentity.colorHex === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                         <input 
                           type="color" 
                           value={currentIdentity.colorHex}
                           onChange={(e) => updateIdentity({ colorHex: e.target.value })}
                           className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                         />
                      </div>
                   </div>
                 </div>

                 {/* ICON SELECTION - UPDATED WITH TABS */}
                 <div>
                   <div className="flex justify-between items-center mb-2">
                     <button 
                        onClick={() => setShowManualControls(!showManualControls)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-white"
                     >
                       <Grid size={14} /> Modifica Icona {showManualControls ? '(Chiudi)' : '(Apri)'}
                     </button>
                   </div>
                   
                   {showManualControls && (
                     <div className="bg-black/20 rounded-xl p-3 animate-fade-in border border-white/5">
                        
                        {/* Tabs */}
                        <div className="flex gap-2 mb-3 border-b border-white/10 pb-2">
                          <button 
                            onClick={() => setIconTab('standard')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${iconTab === 'standard' ? 'bg-brand-accent text-black' : 'text-gray-400 hover:text-white'}`}
                          >
                            Standard
                          </button>
                          <button 
                            onClick={() => setIconTab('custom')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${iconTab === 'custom' ? 'bg-brand-accent text-black' : 'text-gray-400 hover:text-white'}`}
                          >
                            Le Mie Icone
                          </button>
                        </div>

                        {/* Standard Icons */}
                        {iconTab === 'standard' && (
                          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                              {Object.keys(ICON_MAP).map(iconKey => {
                                const IconComp = ICON_MAP[iconKey].component;
                                const SmallIcon = React.cloneElement(IconComp as React.ReactElement<{ size: number }>, { size: 18 });
                                return (
                                  <button
                                    key={iconKey}
                                    onClick={() => { updateIdentity({ iconKey }); setSelectedCustomIconId(null); }}
                                    title={ICON_MAP[iconKey].label}
                                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${currentIdentity.iconKey === iconKey && !selectedCustomIconId ? 'bg-brand-accent text-black' : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                  >
                                    {SmallIcon}
                                  </button>
                                );
                              })}
                          </div>
                        )}

                        {/* Custom Icons (My Images) */}
                        {iconTab === 'custom' && (
                          <div className="space-y-3">
                             <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                {/* Upload Button */}
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="aspect-square rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:text-brand-accent hover:border-brand-accent hover:bg-white/5 transition-all gap-1 group"
                                  title="Carica Nuova"
                                >
                                  <Plus size={16} />
                                  <span className="text-[9px] uppercase font-bold">Add</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleIconUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />

                                {/* User Images */}
                                {userIcons.map(icon => (
                                  <div key={icon.id} className="relative group/item">
                                    <button
                                      onClick={() => setSelectedCustomIconId(icon.id)}
                                      className={`w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden border transition-all ${selectedCustomIconId === icon.id ? 'border-brand-accent bg-brand-accent/20' : 'border-transparent bg-black/40'}`}
                                      title={icon.name}
                                    >
                                      <img src={icon.data} alt={icon.name} className="w-8 h-8 object-contain" />
                                    </button>
                                    {/* Delete Button */}
                                    <button 
                                      onClick={(e) => deleteCustomIcon(icon.id, e)}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110"
                                    >
                                      <X size={10} />
                                    </button>
                                    <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-black/60 text-white truncate px-1 opacity-0 group-hover/item:opacity-100 pointer-events-none">
                                      {icon.name}
                                    </span>
                                  </div>
                                ))}
                             </div>
                             {userIcons.length === 0 && (
                               <p className="text-xs text-gray-500 text-center py-2">
                                 Nessuna icona salvata. Carica la tua prima immagine!
                               </p>
                             )}
                          </div>
                        )}
                     </div>
                   )}
                 </div>

              </div>
          </div>

          {/* RIGHT: Preview & Download */}
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Preview */}
            <div 
              className="w-full aspect-[2/1] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center p-8 relative group transition-colors duration-300"
              style={{ backgroundColor: previewBg }}
            >
              <div className="transform scale-75 md:scale-100 transition-all duration-500">
                 <BrandLogo 
                    size="lg" 
                    // Logic: Pass standard component OR custom image
                    customIcon={!selectedCustomIconId ? ICON_MAP[currentIdentity.iconKey]?.component : undefined}
                    customImageSrc={activeCustomImageSrc}
                    customColor={currentIdentity.colorHex}
                    subtitle={currentIdentity.subtitle}
                    theme={logoTheme}
                    text1={brandName1}
                    text2={brandName2}
                    showSeparator={showSeparator}
                 />
              </div>
            </div>

            {/* Background Controls */}
            <div className="flex items-center gap-3 bg-black/30 p-2 rounded-full border border-white/5">
              <span className="text-[10px] uppercase text-gray-500 font-bold px-2">Sfondo Anteprima:</span>
              {BG_OPTIONS.map((opt) => (
                <button
                  key={opt.color}
                  onClick={() => setPreviewBg(opt.color)}
                  className={`w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform ${previewBg === opt.color ? 'ring-2 ring-brand-accent ring-offset-2 ring-offset-[#1a1638]' : ''}`}
                  style={{ backgroundColor: opt.color }}
                  title={`Sfondo ${opt.label}`}
                />
              ))}
            </div>

            {/* Export */}
            <div className="w-full bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
               <div>
                 <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                   <Maximize size={14} /> Dimensione Export
                 </label>
                 <div className="grid grid-cols-4 gap-2">
                   {[{ id: 'sm', label: 'Piccolo' }, { id: 'md', label: 'Normale' }, { id: 'lg', label: 'Grande' }, { id: 'xl', label: 'Extra' }].map((s) => (
                     <button
                       key={s.id}
                       onClick={() => setDownloadSize(s.id as DownloadSize)}
                       className={`py-2 text-xs font-bold rounded-lg transition-all ${downloadSize === s.id ? 'bg-brand-accent text-black' : 'bg-black/30 text-gray-400 hover:text-white'}`}
                     >
                       {s.label}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                   <FileText size={14} /> Nome File (Opzionale)
                 </label>
                 <div className="flex bg-black/30 rounded-lg border border-white/10 focus-within:border-brand-accent/50 transition-colors">
                    <input 
                      type="text" 
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      placeholder={`Es. ${brandName1}${brandName2}-${currentIdentity.subtitle}`}
                      className="bg-transparent w-full px-3 py-2 text-sm text-white outline-none placeholder-gray-600"
                    />
                    <div className="px-3 py-2 text-xs text-gray-500 font-mono bg-white/5 border-l border-white/5">.png</div>
                 </div>
               </div>

               <button 
                 onClick={downloadLogo}
                 disabled={downloadStatus === 'generating'}
                 className={`
                   w-full py-3 rounded-xl font-brand font-bold text-lg tracking-wider
                   flex items-center justify-center gap-3 transition-all shadow-lg
                   ${downloadStatus === 'done' ? 'bg-green-500 text-black' : 'bg-gradient-to-r from-[#302b63] to-[#24243e] hover:from-brand-accent hover:to-brand-accent2 hover:text-white border border-white/10'}
                 `}
               >
                 {downloadStatus === 'generating' ? 'Preparazione file...' : downloadStatus === 'done' ? <><Check size={24} /> SCARICATO!</> : <><Download size={24} /> SCARICA</>}
               </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
