import React from 'react';

interface VolumeSliderProps {
    value: number;
    onChange: (value: number) => void;
    orientation?: 'vertical' | 'horizontal';
    label?: string;
    className?: string;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
    value,
    onChange,
    orientation = 'horizontal',
    label,
    className = ''
}) => {
    return (
        <div className={`flex ${orientation === 'vertical' ? 'flex-col items-center h-full' : 'flex-row items-center w-full'} ${className}`}>
            {label && <span className="text-xs font-bold text-pink-500 mb-1">{label}</span>}
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className={`
                    appearance-none bg-pink-200 rounded-lg cursor-pointer
                    ${orientation === 'vertical'
                        ? 'h-24 w-2 writing-mode-vertical' // Note: writing-mode might need specific browser support or transform
                        : 'w-full h-2'
                    }
                    accent-pink-500 hover:accent-pink-600
                `}
                style={orientation === 'vertical' ? { writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any : {}}
            />
        </div>
    );
};

export default VolumeSlider;
