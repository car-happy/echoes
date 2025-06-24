# Echoes of Yesterday - replit.md

## Overview

"Echoes of Yesterday" is a 3D interactive narrative game built with React Three Fiber, where players explore a mysterious room and piece together fragments of the past by discovering audio "echoes" and solving a timeline puzzle. The game features immersive 3D graphics, atmospheric audio, and a compelling mystery-solving mechanic.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Engine**: React Three Fiber (@react-three/fiber) with Three.js
- **3D Utilities**: @react-three/drei for enhanced 3D components and helpers
- **Post-processing**: @react-three/postprocessing for visual effects
- **State Management**: Zustand for lightweight, performant state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom configuration for 3D assets

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Development**: Hot Module Replacement (HMR) via Vite middleware
- **Session Management**: Ready for connect-pg-simple integration
- **API Structure**: RESTful endpoints with /api prefix

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: User management system with extensible structure
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Game Engine Components
1. **Game.tsx**: Main game orchestrator managing camera, lighting, and scene composition
2. **Player.tsx**: Player movement controller with WASD keyboard input
3. **Room.tsx**: 3D environment with textured walls, floor, and atmospheric elements
4. **InteractiveObject.tsx**: Handles discoverable echo objects with proximity detection and visual feedback

### State Management Stores
1. **useGame**: Game phase management (ready/playing/ended)
2. **usePlayer**: Player position, velocity, and rotation tracking
3. **useEchoes**: Echo discovery system and timeline puzzle logic
4. **useAudio**: Audio playback control and mute/unmute functionality

### UI Components
1. **GameUI.tsx**: HUD displaying progress, controls, and game status
2. **Timeline.tsx**: Drag-and-drop timeline puzzle interface
3. **Interface.tsx**: Game phase transitions and control overlays

## Data Flow

1. **Game Initialization**: Game starts in "ready" phase with player positioned in 3D room
2. **Echo Discovery**: Player moves through environment, proximity detection triggers echo discovery
3. **Audio Playback**: Discovered echoes can be played back with emotional context
4. **Timeline Assembly**: Players drag echoes onto timeline slots to reconstruct chronological events
5. **Puzzle Validation**: System checks timeline arrangement against correct sequence
6. **Game Completion**: Successful timeline completion triggers victory state

### Echo System
- Each echo contains: ID, title, timestamp, audio file reference, transcript, location, and emotional weight
- Correct timeline order: chair_argument → table_secret → photo_memory → diary_confession
- Visual feedback system with glowing effects for undiscovered echoes

## External Dependencies

### Core 3D Libraries
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Essential 3D helpers (cameras, controls, loaders)
- **@react-three/postprocessing**: Visual effects and rendering enhancements

### UI Framework
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite-plugin-glsl**: GLSL shader support for custom materials
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting

### Audio Support
- Browser-native HTML5 Audio API
- Support for .mp3, .ogg, .wav formats

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized client bundle to `dist/public`
- **Backend**: esbuild compiles server to `dist/index.js`
- **Assets**: 3D models (.gltf, .glb) and audio files served statically

### Environment Configuration
- **Development**: `npm run dev` - TSX with Vite HMR
- **Production**: `npm run build && npm run start`
- **Database**: Drizzle migrations via `npm run db:push`

### Replit Configuration
- **Runtime**: Node.js 20
- **Port**: 5000 (mapped to external port 80)
- **Deployment**: Autoscale target with optimized build process

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```