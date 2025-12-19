
import React from 'react';
import { Palette, Sparkles, Flame, Zap, Star, Heart, Rocket } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  customIcon?: React.ReactNode;
  customImageSrc?: string | null;
  customColor?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  theme?: 'dark' | 'light';
  text1?: string;
  text2?: string;
  showSeparator?: boolean;
  font?: 'orbitron' | 'anton' | 'playfair' | 'montserrat' | 'lobster';
  separatorText?: string;
  iconScale?: number;
  sticker?: string | null;
  stickerConfig?: { x: number; y: number; scale: number };
}

const STICKER_MAP: Record<string, any> = {
  sparkles: <Sparkles className="animate-pulse" />,
  flame: <Flame className="animate-bounce" />,
  zap: <Zap />,
  star: <Star className="animate-spin-slow" />,
  heart: <Heart />,
  rocket: <Rocket />
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  showIcon = true,
  customIcon,
  customImageSrc,
  customColor = '#00f260',
  subtitle,
  showSubtitle = true,
  theme = 'dark',
  text1 = 'SEK',
  text2 = 'COMIX',
  showSeparator = true,
  font = 'orbitron',
  separatorText = '+',
  iconScale = 1,
  sticker = null,
  stickerConfig = { x: 0, y: 0, scale: 1 }
}) => {
  const sizeConfig = {
    sm: { text: 'text-lg', icon: 18, space: 'gap-2', sub: 'text-[0.55rem]', imgSize: 'w-5 h-5', sep: 'text-xs', stickerSize: 14 },
    md: { text: 'text-2xl', icon: 26, space: 'gap-3', sub: 'text-[0.65rem]', imgSize: 'w-8 h-8', sep: 'text-sm', stickerSize: 20 },
    lg: { text: 'text-4xl', icon: 40, space: 'gap-4', sub: 'text-xl', imgSize: 'w-12 h-12', sep: 'text-xl', stickerSize: 32 },
    xl: { text: 'text-6xl', icon: 64, space: 'gap-6', sub: 'text-sm', imgSize: 'w-20 h-20', sep: 'text-4xl', stickerSize: 48 },
  };

  const config = sizeConfig[size];
  const baseTextColor = theme === 'dark' ? '#ffffff' : '#0f0c29';

  const fontClassMap = {
    orbitron: 'font-brand',
    anton: 'font-anton tracking-wide',
    playfair: 'font-playfair tracking-normal italic',
    montserrat: 'font-montserrat tracking-tighter',
    lobster: 'font-lobster tracking-normal',
  };

  const selectedFontClass = fontClassMap[font] || fontClassMap['orbitron'];

  return (
    <div className={`flex flex-col ${className} select-none group relative p-12 transition-all duration-300`}>
      {/* Sticker Layer con posizionamento dinamico basato sul centro del logo */}
      {sticker && STICKER_MAP[sticker] && (
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-200 ease-out" 
          style={{ 
            color: customColor,
            left: `calc(50% + ${stickerConfig.x}px)`,
            top: `calc(50% + ${stickerConfig.y}px)`,
            transform: `translate(-50%, -50%) scale(${stickerConfig.scale})`,
            filter: `drop-shadow(0 0 10px ${customColor}88)`
          }}
        >
          {React.cloneElement(STICKER_MAP[sticker], { size: config.stickerSize })}
        </div>
      )}

      <div className={`flex items-center ${config.space} ${selectedFontClass} font-black`}>
        {showIcon && (
          <div className="relative flex items-center justify-center shrink-0" 
               style={{ transform: `scale(${iconScale})`, transition: 'transform 0.3s ease' }}>
            <div 
              className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition-all duration-500 rounded-full scale-125"
              style={{ background: customColor }}
            ></div>
            <div 
              className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transform group-hover:rotate-12 transition-transform duration-500 flex items-center justify-center"
              style={{ color: baseTextColor }}
            >
              {customImageSrc ? (
                <img 
                  src={customImageSrc} 
                  alt="Brand Icon" 
                  className={`${config.imgSize} object-contain rounded-lg shadow-lg`} 
                />
              ) : (
                customIcon || <Palette size={config.icon} strokeWidth={2.5} />
              )}
            </div>
          </div>
        )}
        <div className={`${config.text} flex items-center whitespace-nowrap leading-none transition-all duration-300`}>
          <span className="drop-shadow-lg transition-colors duration-300 uppercase" style={{ color: baseTextColor }}>{text1}</span>
          
          {showSeparator && (
            <span className={`mx-3 font-black ${config.sep} drop-shadow-[0_0_8px_${customColor}66] transition-all`} style={{ color: customColor }}>
              {separatorText}
            </span>
          )}
          
          <span className={`bg-clip-text text-transparent bg-gradient-to-r drop-shadow-lg uppercase transition-all ${!showSeparator ? 'ml-4' : ''}`}
                style={{ backgroundImage: `linear-gradient(to right, ${customColor}, #0575E6)` }}>
            {text2}
          </span>
        </div>
      </div>
      
      {subtitle && showSubtitle && (
         <div 
           className={`${config.sub} font-sans font-black tracking-[0.4em] uppercase mt-1 ml-auto text-right w-full italic transition-all`}
           style={{ color: customColor, textShadow: `0 0 10px ${customColor}44` }}
         >
           {subtitle}
         </div>
      )}
    </div>
  );
};
