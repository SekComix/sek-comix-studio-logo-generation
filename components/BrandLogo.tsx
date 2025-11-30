import React from 'react';
import { Palette } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  // New props for dynamic branding
  customIcon?: React.ReactNode;
  customColor?: string;
  subtitle?: string;
  theme?: 'dark' | 'light'; // 'dark' = for dark backgrounds (white text), 'light' = for light backgrounds (dark text)
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  size = 'md',
  showIcon = true,
  customIcon,
  customColor = '#00f260', // Default neon green
  subtitle,
  theme = 'dark'
}) => {
  const sizeConfig = {
    sm: { text: 'text-lg', icon: 18, space: 'gap-2', sub: 'text-[0.6rem]' },
    md: { text: 'text-2xl', icon: 26, space: 'gap-3', sub: 'text-[0.7rem]' },
    lg: { text: 'text-4xl', icon: 40, space: 'gap-4', sub: 'text-xs' },
    xl: { text: 'text-6xl', icon: 64, space: 'gap-6', sub: 'text-sm' },
  };

  const config = sizeConfig[size];

  // Colors based on theme
  // If theme is 'dark' (background), text should be White.
  // If theme is 'light' (background), text should be Dark Brand Color.
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
            
            {/* Icon Render - dynamic color */}
            <div 
              className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transform group-hover:rotate-12 transition-transform duration-500"
              style={{ color: baseTextColor }}
            >
              {customIcon || <Palette size={config.icon} strokeWidth={2.5} />}
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
