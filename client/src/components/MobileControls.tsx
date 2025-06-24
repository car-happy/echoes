import { useRef, useEffect } from "react";
import { usePlayer } from "../lib/stores/usePlayer";

export default function MobileControls() {
  const { setVelocity, velocity, cameraMode, setCameraMode } = usePlayer();
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;

  useEffect(() => {
    if (!isMobile) return;

    const joystick = joystickRef.current;
    const knob = knobRef.current;
    if (!joystick || !knob) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      activeTouch.current = touch.identifier;
      updateKnobPosition(touch.clientX - centerX, touch.clientY - centerY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (activeTouch.current === null) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouch.current);
      if (!touch) return;

      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      updateKnobPosition(touch.clientX - centerX, touch.clientY - centerY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      activeTouch.current = null;
      knob.style.transform = 'translate(-50%, -50%)';
      setVelocity([0, 0, 0]);
    };

    const updateKnobPosition = (deltaX: number, deltaY: number) => {
      const maxDistance = 40;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      knob.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
      
      // Convert to movement vector
      const normalizedX = deltaX / maxDistance;
      const normalizedY = deltaY / maxDistance;
      
      const speed = 3;
      setVelocity([normalizedX * speed, 0, normalizedY * speed]);
    };

    joystick.addEventListener('touchstart', handleTouchStart, { passive: false });
    joystick.addEventListener('touchmove', handleTouchMove, { passive: false });
    joystick.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      joystick.removeEventListener('touchstart', handleTouchStart);
      joystick.removeEventListener('touchmove', handleTouchMove);
      joystick.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, setVelocity]);

  if (!isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Virtual Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          ref={joystickRef}
          className="w-24 h-24 bg-black/40 border-2 border-white/30 rounded-full relative touch-none"
        >
          <div
            ref={knobRef}
            className="w-8 h-8 bg-white/80 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
          />
        </div>
        <p className="text-white text-xs mt-2 text-center">Move</p>
      </div>

      {/* Mobile Control Buttons */}
      <div className="absolute bottom-8 right-8 pointer-events-auto space-y-4">
        {/* Camera Toggle */}
        <button
          onClick={() => setCameraMode(cameraMode === "first" ? "third" : "first")}
          className="w-16 h-16 bg-black/60 border-2 border-white/30 rounded-full text-white font-bold text-sm flex items-center justify-center"
        >
          {cameraMode === "first" ? "3rd" : "1st"}
        </button>
        
        {/* Interact Button */}
        <button
          className="w-16 h-16 bg-black/60 border-2 border-white/30 rounded-full text-white font-bold text-lg flex items-center justify-center"
          onTouchStart={(e) => {
            e.preventDefault();
            // Trigger interact action
            const event = new KeyboardEvent('keydown', { key: 'e' });
            document.dispatchEvent(event);
          }}
        >
          E
        </button>
      </div>

      {/* Touch to look around hint */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
          Touch and drag anywhere to look around
        </div>
      </div>
    </div>
  );
}