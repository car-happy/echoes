import { useState, useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useEchoes } from "../lib/stores/useEchoes";
import { useAudio } from "../lib/stores/useAudio";

enum Controls {
  toggleTimeline = 'toggleTimeline'
}

export default function Timeline() {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedEcho, setDraggedEcho] = useState<string | null>(null);
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false);
  const { echos, timelineSlots, setTimelineSlots, checkTimelineSolution } = useEchoes();
  const { playSuccess, playHit } = useAudio();
  const [subscribe] = useKeyboardControls<Controls>();
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice narration function
  const speak = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.volume = 0.8;
      utterance.pitch = 1.0;
      
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle timeline with T key
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => state.toggleTimeline,
      (pressed) => {
        if (pressed) {
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          console.log("Timeline toggled:", newIsOpen);
          
          // Voice guidance when opening timeline
          if (newIsOpen && !hasSpokenIntro) {
            speak("Welcome to the Timeline puzzle. Arrange the echoes in chronological order to unlock the truth of the past.");
            setHasSpokenIntro(true);
          } else if (newIsOpen && echos.length > 0) {
            speak(`You have discovered ${echos.length} echoes. Drag them into the correct order.`);
          } else if (newIsOpen) {
            speak("Explore the city to discover echoes before using the timeline.");
          }
        }
      }
    );
    return unsubscribe;
  }, [isOpen, subscribe, hasSpokenIntro, echos.length]);

  const handleDragStart = (echoId: string) => {
    setDraggedEcho(echoId);
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggedEcho) return;
    
    const newSlots = [...timelineSlots];
    
    // Remove echo from current position if it exists
    const currentIndex = newSlots.findIndex(slot => slot === draggedEcho);
    if (currentIndex !== -1) {
      newSlots[currentIndex] = null;
    }
    
    // Place echo in new slot
    newSlots[slotIndex] = draggedEcho;
    setTimelineSlots(newSlots);
    
    // Check if solution is correct
    const isCorrect = checkTimelineSolution();
    if (isCorrect) {
      playSuccess();
      speak("Excellent! You have successfully reconstructed the timeline. The mystery is now revealed.");
      console.log("Timeline solved correctly!");
    } else {
      playHit();
      const filledSlots = newSlots.filter(slot => slot !== null).length;
      if (filledSlots === 4) {
        speak("That's not quite right. Try rearranging the echoes in a different order.");
      } else {
        speak("Good placement. Continue adding echoes to complete the timeline.");
      }
    }
    
    setDraggedEcho(null);
  };

  const handleRemoveFromTimeline = (slotIndex: number) => {
    const newSlots = [...timelineSlots];
    newSlots[slotIndex] = null;
    setTimelineSlots(newSlots);
  };

  const getEchoById = (id: string) => {
    return echos.find(echo => echo.id === id);
  };

  if (!isOpen) {
    return (
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-sm">Press T to open Timeline</p>
          <p className="text-xs text-gray-300">Echoes discovered: {echos.length}/4</p>
          {echos.length > 0 && (
            <button
              onClick={() => speak(`You have discovered ${echos.length} echoes. Press T to open the timeline and arrange them.`)}
              className="text-xs text-blue-300 hover:text-blue-200 mt-1 block"
            >
              🔊 Voice Guide
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-4 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Timeline - Echoes of Yesterday</h2>
            <p className="text-sm text-gray-400">Arrange echoes chronologically to reveal the truth</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => speak("Drag the discovered echoes into the timeline slots in chronological order. Listen carefully to each echo to understand the sequence of events.")}
              className="text-white hover:text-blue-400 text-sm px-3 py-1 bg-blue-600/20 rounded"
            >
              🔊 Help
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Discovered Echoes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Discovered Echoes</h3>
            
            {echos.length === 0 ? (
              <div className="text-gray-400 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
                Explore the room to discover echoes from the past...
              </div>
            ) : (
              <div className="space-y-3">
                {echos.map((echo) => (
                  <div
                    key={echo.id}
                    draggable
                    onDragStart={() => handleDragStart(echo.id)}
                    className={`p-4 bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors border-l-4 ${
                      echo.emotionalWeight === 'anger' ? 'border-red-500' :
                      echo.emotionalWeight === 'fear' ? 'border-yellow-500' :
                      echo.emotionalWeight === 'regret' ? 'border-blue-500' :
                      echo.emotionalWeight === 'guilt' ? 'border-purple-500' :
                      'border-gray-500'
                    } ${timelineSlots.includes(echo.id) ? 'opacity-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{echo.title}</h4>
                      <span className="text-xs text-gray-400">{echo.location}</span>
                    </div>
                    <p className="text-sm text-gray-300 italic">"{echo.transcript}"</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        echo.emotionalWeight === 'anger' ? 'bg-red-900 text-red-200' :
                        echo.emotionalWeight === 'fear' ? 'bg-yellow-900 text-yellow-200' :
                        echo.emotionalWeight === 'regret' ? 'bg-blue-900 text-blue-200' :
                        echo.emotionalWeight === 'guilt' ? 'bg-purple-900 text-purple-200' :
                        'bg-gray-900 text-gray-200'
                      }`}>
                        {echo.emotionalWeight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Timeline Sequence */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
            <p className="text-xs text-gray-400 mb-3">
              Arrange in chronological order
            </p>
            
            <div className="space-y-2">
              {timelineSlots.map((slotEcho, index) => (
                <div
                  key={index}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="min-h-[60px] p-3 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 font-semibold text-sm">{index + 1}</span>
                    {slotEcho && (
                      <button
                        onClick={() => handleRemoveFromTimeline(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {slotEcho ? (
                    <div className="bg-gray-700 p-2 rounded">
                      {(() => {
                        const echo = getEchoById(slotEcho);
                        return echo ? (
                          <>
                            <h4 className="font-semibold text-white text-xs">{echo.title}</h4>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-1">"{echo.transcript.substring(0, 50)}..."</p>
                          </>
                        ) : null;
                      })()}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-2 text-xs">
                      Drop echo here
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Press T to close | Click 🔊 for voice guidance | Drag echoes to timeline slots
          </p>
        </div>
      </div>
    </div>
  );
}
