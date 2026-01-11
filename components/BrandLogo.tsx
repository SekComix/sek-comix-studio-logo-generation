
import React from 'react';
import { 
  Palette, Sparkles, Flame, Zap, Star, Heart, Rocket,
  Camera, Music, Gamepad, Code, Briefcase, ShoppingCart, 
  Utensils, Crown, Leaf, Plane, Dumbbell, Book, Home, Car
} from 'lucide-react';

export const ICON_MAP: Record<string, any> = {
  'palette': Palette,
  'camera': Camera,
  'music': Music,
  'gamepad': Gamepad,
  'code': Code,
  'briefcase': Briefcase,
  'shopping-cart': ShoppingCart,
  'utensils': Utensils,
  'star': Star,
  'heart': Heart,
  'zap': Zap,
  'crown': Crown,
  'leaf': Leaf,
  'rocket': Rocket,
  'plane': Plane,
  'dumbbell': Dumbbell,
  'book': Book,
  'home': Home,
  'car': Car,
};

interface BrandLogoProps {
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  iconKey?: string;
  customIcon?: React.ReactNode;
  customImage?: string | null;
  color?: string;
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
  taglineConfig?: { x: number; y: number; scale: number };
  separatorConfig?: { x: number; y: number; scale: number };
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
  iconKey = 'palette',
  customIcon,
  customImage,
  color = '#00f260',
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
  stickerConfig = { x: 0, y: 0, scale: 1 },
  taglineConfig = { x: 0, y: 0, scale: 1 },
  separatorConfig = { x: 0, y: 0, scale: 1 }
}) => {
  const scaleMap = {
    sm: 0.6,
    md: 1.0,
    lg: 2.2,
    xl: 4.5
  };

  const currentScale = scaleMap[size];
  const baseFontSize = 32 * currentScale;
  const iconBaseSize = 36 * currentScale;
  const gapSize = 16 * currentScale;
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

  const renderIcon = () => {
    if (customImage) {
      return (
        <img 
          src={customImage} 
          alt="Icon" 
          crossOrigin="anonymous"
          style={{ 
            width: `${iconBaseSize}px`, 
            height: `${iconBaseSize}px`,
            objectFit: 'contain',
            // La magia: il nero dell'immagine AI diventa trasparente su sfondi scuri
            mixBlendMode: 'screen',
            filter: `brightness(1.1) contrast(1.1) drop-shadow(0 0 ${4 * currentScale}px ${color}88)`,
          }}
        />
      );
    }
    const IconComp = ICON_MAP[iconKey] || Palette;
    return <IconComp size={iconBaseSize} strokeWidth={2.5} />;
  };

  return (
    <div 
      id={id} 
      className={`flex flex-col items-center justify-center ${className} select-none relative transition-all duration-300`}
      style={{ 
        overflow: 'visible', 
        padding: `${50 * currentScale}px`, 
        minWidth: 'max-content',
        width: 'fit-content'
      }}
    >
      {sticker && STICKER_MAP[sticker] && (
        <div 
          className="absolute z-20 pointer-events-none" 
          style={{ 
            color: color, 
            left: `calc(50% + ${stickerConfig.x * currentScale}px)`, 
            top: `calc(50% + ${stickerConfig.y * currentScale}px)`, 
            transform: `translate(-50%, -50%) scale(${stickerConfig.scale * currentScale})`, 
            filter: `drop-shadow(0 0 ${10 * currentScale}px ${color}88)` 
          }}
        >
          {React.cloneElement(STICKER_MAP[sticker], { size: stickerBaseSize })}
        </div>
      )}

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
            <div className="absolute inset-0 blur-xl opacity-20 rounded-full scale-150" style={{ background: color }}></div>
            <div className="relative z-10 flex items-center justify-center" style={{ color: color }}>
              {renderIcon()}
            </div>
          </div>
        )}
        
        <div className="flex items-center whitespace-nowrap leading-none uppercase" style={{ overflow: 'visible' }}>
          <span className="drop-shadow-2xl" style={{ color: baseTextColor }}>{text1}</span>
          {showSeparator && (
            <span 
              className="font-black inline-block" 
              style={{ 
                color: color, 
                margin: `0 ${separatorMargin}px`, 
                fontSize: `${baseFontSize * 0.8}px`,
                transform: `translate(${separatorConfig.x * currentScale}px, ${separatorConfig.y * currentScale}px) scale(${separatorConfig.scale})`,
                transition: 'transform 0.1s linear'
              }}
            >
              {separatorText === ' ' ? '\u00A0' : separatorText}
            </span>
          )}
          <span style={{ color: color }}>{text2}</span>
        </div>
      </div>
      
      {subtitle && showSubtitle && (
         <div className="font-sans font-black uppercase text-center italic opacity-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] whitespace-nowrap" 
           style={{ 
             color: color, 
             fontSize: `${taglineSize}px`, 
             marginTop: `${taglineMargin}px`, 
             letterSpacing: `${0.35 * currentScale}em`, 
             width: '100%',
             transform: `translate(${taglineConfig.x * currentScale}px, ${taglineConfig.y * currentScale}px) scale(${taglineConfig.scale})`,
             transition: 'transform 0.1s linear'
           }}>
           {subtitle}
         </div>
      )}
    </div>
  );
};
