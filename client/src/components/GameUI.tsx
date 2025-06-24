import { useEchoes } from "../lib/stores/useEchoes";
import { usePlayer } from "../lib/stores/usePlayer";
import { useAudio } from "../lib/stores/useAudio";

export default function GameUI() {
  const { echos, timelineSlots, checkTimelineSolution } = useEchoes();
  const { position, cameraMode } = usePlayer();
  const { isMuted, toggleMute } = useAudio();
  
  const isSolved = checkTimelineSolution();
  const discoveredCount = echos.length;
  const totalEchoes = 4;
  
  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;

  return (
    <>
      {/* Main HUD */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm space-y-2">
          <h1 className="text-xl font-bold text-purple-300">Echoes of Yesterday</h1>
          <div className="text-sm space-y-1">
            <p>Echoes Found: {discoveredCount}/{totalEchoes}</p>
            <p>Timeline: {timelineSlots.filter(slot => slot !== null).length}/4 placed</p>
            {isSolved && (
              <p className="text-green-400 font-semibold">✓ Timeline Solved!</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls Help - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 z-40">
          <div className="bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">WASD:</span> Move</p>
              <p><span className="font-semibold">E:</span> Interact</p>
              <p><span className="font-semibold">T:</span> Timeline</p>
              <p><span className="font-semibold">C:</span> Camera Mode</p>
              <p><span className="font-semibold">Right Click + Drag:</span> Look Around</p>
              <p><span className="font-semibold">Camera:</span> {cameraMode === "first" ? "First Person" : "Third Person"}</p>
              <p><span className="font-semibold">Position:</span> ({position[0].toFixed(1)}, {position[2].toFixed(1)})</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Audio Control */}
      <div className="absolute bottom-4 right-4 z-40">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-lg backdrop-blur-sm transition-colors ${
            isMuted 
              ? 'bg-red-500/80 hover:bg-red-500/90 text-white' 
              : 'bg-green-500/80 hover:bg-green-500/90 text-white'
          }`}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-40">
        <div className="bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
          <div className="text-xs text-center space-y-2">
            <p className="font-semibold">Progress</p>
            <div className="space-y-1">
              {Array.from({ length: totalEchoes }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 ${
                    i < discoveredCount 
                      ? 'bg-purple-500 border-purple-400' 
                      : 'bg-transparent border-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Victory Message */}
      {isSolved && discoveredCount === totalEchoes && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-b from-purple-900 to-blue-900 text-white p-8 rounded-lg text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Mystery Solved!</h2>
            <p className="text-lg mb-4">
              You have successfully reconstructed the echoes of the past and uncovered the truth.
            </p>
            <p className="text-sm text-gray-300">
              The timeline has been restored, and the secrets of yesterday have been revealed.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/10" />
      </div>
    </>
  );
}
