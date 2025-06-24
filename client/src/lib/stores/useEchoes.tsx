import { create } from "zustand";

export interface Echo {
  id: string;
  title: string;
  timestamp: number;
  audioFile: string;
  transcript: string;
  location: string;
  emotionalWeight: "anger" | "fear" | "regret" | "guilt" | "mystery";
}

interface EchoesState {
  echos: Echo[];
  timelineSlots: (string | null)[];
  
  // Actions
  discoverEcho: (echo: Echo) => void;
  setTimelineSlots: (slots: (string | null)[]) => void;
  checkTimelineSolution: () => boolean;
  playEcho: (echoId: string) => void;
}

// Correct chronological order of events
const CORRECT_TIMELINE = [
  "chair_argument",    // 1. The heated argument
  "table_secret",      // 2. The whispered secret about the hidden key
  "photo_memory",      // 3. The loving memory and regret
  "diary_confession"   // 4. The final confession
];

export const useEchoes = create<EchoesState>((set, get) => ({
  echos: [],
  timelineSlots: [null, null, null, null],
  
  discoverEcho: (echo) => {
    set((state) => {
      // Check if echo already exists
      if (state.echos.some(e => e.id === echo.id)) {
        return state;
      }
      
      return {
        echos: [...state.echos, echo]
      };
    });
  },
  
  setTimelineSlots: (slots) => {
    set({ timelineSlots: slots });
  },
  
  checkTimelineSolution: () => {
    const { timelineSlots } = get();
    
    // Check if all slots are filled
    if (timelineSlots.some(slot => slot === null)) {
      return false;
    }
    
    // Check if order matches correct timeline
    return timelineSlots.every((slot, index) => slot === CORRECT_TIMELINE[index]);
  },
  
  playEcho: (echoId) => {
    const { echos } = get();
    const echo = echos.find(e => e.id === echoId);
    
    if (echo) {
      // Create and play audio
      const audio = new Audio(echo.audioFile);
      audio.volume = 0.7;
      audio.play().catch(error => {
        console.log("Audio play prevented:", error);
      });
      
      console.log(`Playing echo: ${echo.title}`);
      console.log(`Transcript: ${echo.transcript}`);
    }
  }
}));
