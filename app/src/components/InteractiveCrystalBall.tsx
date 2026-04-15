import { useState, useEffect, useRef } from 'react';

// 交互式水晶球组件
export function InteractiveCrystalBall({ percentage, color, label }: { percentage: number; color: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const animationRef = useRef<number>();
  
  // 填充动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setFillPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);
  
  // 波浪动画
  useEffect(() => {
    const animateWave = () => {
      setWaveOffset(prev => (prev + 0.02) % 1);
      animationRef.current = requestAnimationFrame(animateWave);
    };
    
    animationRef.current = requestAnimationFrame(animateWave);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // 点击效果
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
  };
  
  return (
    <div 
      className="text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="relative mx-auto mb-2">
        {/* 底层圆形 - 完整背景 */}
        <div 
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110 shadow-lg' : 'scale-100'} ${isClicked ? 'scale-105' : ''}`}
          style={{ 
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2)), ${color}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          {/* 填充液体效果 */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-b-full transition-all duration-1000 ease-out"
            style={{ 
              height: `${fillPercentage}%`,
              background: `linear-gradient(to top, ${color}, ${color}80)`,
              opacity: 0.8,
              zIndex: 1
            }}
          >
            {/* 波浪效果 */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                transform: `translateX(-${waveOffset * 100}%)`,
                transition: 'transform 0.1s linear'
              }}
            />
          </div>
          {/* 百分比文字 */}
          <span 
            className="relative z-10 text-2xl font-bold text-white transition-transform duration-300"
            style={{ 
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {percentage}%
          </span>
        </div>
        {/* 光效 */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 50%)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            zIndex: 2
          }}
        />
        {/* 点击涟漪效果 */}
        {isClicked && (
          <div 
            className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/30 pointer-events-none"
            style={{
              transform: 'translate(-50%, -50%)',
              animation: 'ripple 0.5s ease-out'
            }}
          />
        )}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
