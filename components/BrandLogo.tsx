
import React from 'react';
import { Palette, Sparkles, Flame, Zap, Star, Heart, Rocket } from 'lucide-react';

interface BrandLogoProps {
  id?: string;
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
  iconPos?: { x: number; y: number };
  sticker?: string | null;
  stickerConfig?: { x: number; y: number; scale: number };
}

const STICKER_MAP: Record<string, any> = {
  sparkles: <Sparkles />,
  flame: <Flame />,
  zap: <Zap />,
  star: <Star />,
  heart: <Heart />,
  rocket: <Rocket />
};

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  id,
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
  iconPos = { x: 0, y: 0 },
  sticker = null,
  stickerConfig = { x: 0, y: 0, scale: 1 }
}) => {
  // Definizione di una scala matematica per mantenere le proporzioni perfette
  const scaleMap = {
    sm: 0.6,
    md: 1.0,
    lg: 2.2,
    xl: 4.5
  };

  const currentScale = scaleMap[size];
  
  // Calcolo delle dimensioni basato sulla scala
  const baseFontSize = 32 * currentScale;
  const iconBaseSize = 36 * currentScale;
  const gapSize = 16 * currentScale;
  
  // MIGLIORAMENTO LEGGIBILITÀ TAGLINE:
  // Aumentato il rapporto dal 28% al 38% e aggiunto un minimo di 11px per mobile.
  const taglineSize = Math.max(baseFontSize * 0.38, 11); 
  const taglineMargin = 14 * currentScale;
  const separatorMargin = 16 * currentScale;
  const stickerBaseSize = 24 * currentScale;

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
    <div 
      id={id} 
      className={`flex flex-col items-center justify-center ${className} select-none relative transition-all duration-300`}
      style={{ 
        overflow: 'visible', 
        padding: `${25 * currentScale}px`, 
        minWidth: 'max-content',
        width: 'fit-content'
      }}
    >
      {/* Sticker Layer */}
      {sticker && STICKER_MAP[sticker] && (
        <div 
          className="absolute z-20 pointer-events-none" 
          style={{ 
            color: customColor, 
            left: `calc(50% + ${stickerConfig.x * currentScale}px)`, 
            top: `calc(50% + ${stickerConfig.y * currentScale}px)`, 
            transform: `translate(-50%, -50%) scale(${stickerConfig.scale * currentScale})`, 
            filter: `drop-shadow(0 0 ${10 * currentScale}px ${customColor}88)` 
          }}
        >
          {React.cloneElement(STICKER_MAP[sticker], { size: stickerBaseSize })}
        </div>
      )}

      {/* Main Row: Icon + Texts */}
      <div 
        className={`flex items-center ${selectedFontClass} font-black`} 
        style={{ 
          gap: `${gapSize}px`,
          fontSize: `${baseFontSize}px`,
          overflow: 'visible' 
        }}
      >
        {showIcon && (
          <div 
            className="relative flex items-center justify-center shrink-0" 
            style={{ 
              transform: `translate(${iconPos.x * currentScale}px, ${iconPos.y * currentScale}px) scale(${iconScale})`, 
              width: `${iconBaseSize}px`,
              height: `${iconBaseSize}px`,
              transition: 'transform 0.1s linear',
              overflow: 'visible'
            }}
          >
            <div 
              className="absolute inset-0 blur-xl opacity-30 rounded-full scale-150" 
              style={{ background: customColor }}
            ></div>
            <div className="relative z-10 flex items-center justify-center">
              {customImageSrc ? (
                <img 
                  src={customImageSrc} 
                  alt="Icon" 
                  crossOrigin="anonymous"
                  style={{ 
                    width: `${iconBaseSize}px`, 
                    height: `${iconBaseSize}px`,
                    objectFit: 'contain',
                    filter: `brightness(1.2) drop-shadow(0 0 ${6 * currentScale}px ${customColor})`,
                  }}
                />
              ) : (
                <div style={{ color: customColor }}>
                  {customIcon ? React.cloneElement(customIcon as React.ReactElement<{ size?: number }>, { size: iconBaseSize }) : <Palette size={iconBaseSize} strokeWidth={2.5} />}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center whitespace-nowrap leading-none uppercase" style={{ overflow: 'visible' }}>
          <span className="drop-shadow-2xl" style={{ color: baseTextColor }}>{text1}</span>
          
          {showSeparator && (
            <span 
              className="font-black" 
              style={{ 
                color: customColor,
                margin: `0 ${separatorMargin}px`,
                fontSize: `${baseFontSize * 0.8}px`
              }}
            >
              {separatorText === ' ' ? '\u00A0' : separatorText}
            </span>
          )}

          <span style={{ color: customColor }}>{text2}</span>
        </div>
      </div>
      
      {/* Subtitle Row: Tagline (Terza Casella) */}
      {subtitle && showSubtitle && (
         <div 
           className="font-sans font-black uppercase text-center italic opacity-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] whitespace-nowrap" 
           style={{ 
             color: customColor,
             fontSize: `${taglineSize}px`,
             marginTop: `${taglineMargin}px`,
             letterSpacing: `${0.35 * currentScale}em`, // Tracking ottimizzato
             width: '100%'
           }}
         >
           {subtitle}
         </div>
      )}
    </div>
  );
};
