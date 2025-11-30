import React from 'react';
import { Palette } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  // New props for dynamic branding
  customIcon?: React.ReactNode;
  customImageSrc?: string | null; // NEW: Supporto per immagini utente
  customColor?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  showIcon = true,
  customIcon,
  customImageSrc,
  customColor = '#00f260', // Default neon green
  subtitle,
  theme = 'dark'
}) => {
  const sizeConfig = {
    sm: { text: 'text-lg', icon: 18, space: 'gap-2', sub: 'text-[0.6rem]', imgSize: 'w-5 h-5' },
    md: { text: 'text-2xl', icon: 26, space: 'gap-3', sub: 'text-[0.7rem]', imgSize: 'w-8 h-8' },
    lg: { text: 'text-4xl', icon: 40, space: 'gap-4', sub: 'text-xs', imgSize: 'w-12 h-12' },
    xl: { text: 'text-6xl', icon: 64, space: 'gap-6', sub: 'text-sm', imgSize: 'w-20 h-20' },
  };

  const config = sizeConfig[size];
  const baseTextColor = theme === 'dark' ? '#ffffff' : '#0f0c29';

  return (
    <div className={`flex flex-col ${className} select-none group`}>
      <div className={`flex items-center ${config.space} font-brand font-black tracking-widest`}>
        {showIcon && (
          <div className="relative flex items-center justify-center">
            {/* Outer Glow - Dynamic Color */}
            <div 
              className="absolute inset-0 blur-md opacity-40 group-hover:opacity-70 transition-all duration-500 rounded-full scale-125"
              style={{ background: customColor }}
            ></div>
            
            {/* Icon Render - dynamic color OR Custom Image */}
            <div 
              className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transform group-hover:rotate-12 transition-transform duration-500 flex items-center justify-center"
              style={{ color: baseTextColor }}
            >
              {customImageSrc ? (
                <img 
                  src={customImageSrc} 
                  alt="Brand Icon" 
                  className={`${config.imgSize} object-contain`} 
                  style={{ filter: theme === 'dark' ? 'drop-shadow(0 0 2px rgba(255,255,255,0.2))' : 'none' }}
                />
              ) : (
                customIcon || <Palette size={config.icon} strokeWidth={2.5} />
              )}
            </div>
          </div>
        )}
        <div className={`${config.text} flex items-center`}>
          <span className="drop-shadow-lg transition-colors duration-300" style={{ color: baseTextColor }}>SEK</span>
          <span className="mx-2 font-light opacity-80" style={{ color: customColor }}>+</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r drop-shadow-lg"
                style={{ backgroundImage: `linear-gradient(to right, ${customColor}, #0575E6)` }}>
            COMIX
          </span>
        </div>
      </div>
      
      {/* Dynamic Subtitle */}
      {subtitle && (
         <div 
           className={`${config.sub} font-sans font-bold tracking-[0.3em] uppercase mt-1 ml-auto text-right w-full`}
           style={{ color: customColor, textShadow: `0 0 10px ${customColor}44` }}
         >
           {subtitle}
         </div>
      )}
    </div>
  );
};
