# CodeRoom - Real-Time Collaborative Code Editor

CodeRoom is a high-performance, real-time collaborative coding platform. It allows multiple developers to join a shared workspace, edit code simultaneously with operational transformation-based synchronization, and manage room settings dynamically. The project features a modern, premium UI and a robust WebSocket-driven backend.

---

## 🚀 Implemented Business Modules

- ✔ **Room Management** (Create, Join, Access Control)
- ✔ **Authentication & Authorization** (Host Tokens, Room Tokens)
- ✔ **Real-Time Collaboration** (Delta-based Operational Transformation via WebSockets)
- ✔ **Participant Management** (Online presence, Active typing indicators)
- ✔ **Host Controls** (Rename room, Kick users, Toggle passwords)
- ✔ **Room History** (Automatic code snapshots saved to database)
- ✔ **Session Persistence** (Client-side auto-reconnect and recovery)

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool and Dev Server
- **Tailwind CSS v4** - Utility-first styling with modern dark-mode glassmorphic aesthetics
- **Socket.IO Client** - WebSocket client for real-time synchronization
- **Lucide React** - SVG Icon library
- **Framer Motion** - (Installed) Animation library

### Backend
- **Node.js & Express 5** - Server framework and REST API
- **Socket.IO** - WebSocket server for operational transforms and presence
- **MongoDB & Mongoose** - NoSQL database and ODM for persisting rooms and history
- **JSON Web Tokens (JWT)** - Stateless authentication and room access management
- **Bcrypt.js** - Password hashing for secure rooms

---

## 🏗 Project Architecture

### Frontend Architecture: Feature-Based

The frontend utilizes a **Feature-Based Architecture**. Instead of grouping files by type (e.g., all components together, all hooks together), files are grouped by their domain or feature. This drastically improves maintainability, prevents the "components folder bloat," and isolates logic.

```
client/src/
├── components/       # Shared UI components (Icons, Buttons)
├── feature/          # Domain-specific feature modules
│   ├── Editor/       # Code editor logic, textarea synced via delta ops
│   ├── History/      # Room code snapshots and history viewer
│   ├── HostControl/  # Admin controls (rename, access, kick)
│   ├── LandingPage/  # Entry UI (Hero, Features, Room Forms)
│   └── Participants/ # Online user lists and presence state
├── lib/              # Utilities (api wrappers, socket init, delta algorithms)
└── App.jsx           # Main routing and session state
```

### Backend Architecture: Modular Component

The backend follows a **Modular Structure** to separate concerns among Authentication, Rooms, and History.

```
server/src/
├── Config/           # Database and env configs
├── modules/
│   ├── Auth/         # Handles host tokens and identity
│   ├── History/      # Manages auto-saved code snapshots
│   └── Room/         # Room lifecycle, passwords, and metadata
├── SynEngine.js      # Core Operational Transform logic for WebSockets
├── sockethandler.js  # Socket.IO event registrations
└── index.js          # Express app entrypoint
```

---

## ✨ Feature Documentation

### 1. Real-Time Collaborative Editor
- **Workflow**: User types -> `delta.js` calculates string diff -> Socket emits `text-op` -> Backend `SynEngine.js` queues and rebroadcasts -> Peers apply operational transform via `applyOp()`.
- **Frontend**: `EditorRoom.jsx`, `CodeEditor.jsx`
- **Backend**: `SynEngine.js`, `sockethandler.js`

### 2. Room Access & Security
- **Workflow**: Host creates room -> Option to add password. Backend hashes password -> Stores Room. Host receives special `hostToken`. Guests joining must provide password if protected -> receive `roomToken`.
- **Frontend**: `LandingPage.jsx`, `RoomCard.jsx`
- **Backend**: `Room Module`, `Auth Module`

### 3. Room History & Snapshots
- **Workflow**: Backend runs a scheduled interval. If room content changed, it saves a snapshot to the `History` MongoDB collection. The frontend `HistoryPage` fetches all rooms and their historical snapshots.
- **Frontend**: `HistoryPage.jsx`
- **Backend**: `History Module`

### 4. Host Controls & Participant Management
- **Workflow**: Host clicks settings -> Can rename room or kick users -> Emits socket event -> Backend verifies `hostToken` -> Broadcasts updates or `kicked` event to target socket -> Target client is forced to leave.

---

## 📡 API Documentation

| Method | Endpoint | Module | Purpose |
|--------|----------|--------|---------|
| `POST` | `/api/rooms/create` | Room | Creates a new room (public or password protected). |
| `POST` | `/api/rooms/join` | Room | Validates room code and password, returns access token. |
| `PATCH` | `/api/rooms/:roomCode/rename` | Room | Renames the room. Requires `hostToken` validation. |
| `PATCH` | `/api/rooms/:roomCode/security` | Room | Toggles password protection. Requires `hostToken`. |
| `GET` | `/api/history` | History | Retrieves a list of all distinct room codes with saved history. |
| `GET` | `/api/history/:roomCode` | History | Fetches chronological code snapshots for a specific room. |

---

## 🗄 Database Documentation (MongoDB)

### `rooms` Collection
- **`code`** (String, Unique, Index): 6-character room identifier.
- **`name`** (String): Display name of the room.
- **`hostToken`** (String): JWT identifying the room creator.
- **`isPasswordProtected`** (Boolean): Indicates if entry requires a password.
- **`password`** (String): Bcrypt hashed password.

### `histories` Collection
- **`roomCode`** (String, Index): Reference to the room.
- **`content`** (String): Full text snapshot of the code.
- **`version`** (Number): Sequential OT version number.
- **`createdAt`** (Date): Timestamp of snapshot.

---

## 🔐 Authentication & Authorization Flow

CodeRoom uses stateless JWTs rather than traditional sessions to allow frictionless scaling and rapid joining without account creation.

1. **Host Token**: Created when a user makes a room. Saved locally in their session state. Required to rename rooms or kick users.
2. **Room Token**: Issued when a user successfully joins a password-protected room. Proves they know the password. Validated on WebSocket connection (`join-room` event).

---

## ⚙️ Environment Variables

To run the project, create `.env` files in both `client` and `server` directories.

**Backend (`server/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coderoom
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Git

### 1. Clone & Install
```bash
git clone <repository_url>
cd CodeRoom

# Install Backend dependencies
cd server
npm install

# Install Frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment
Create the `.env` files as described in the Environment Variables section.

### 3. Run the Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📜 Scripts

**Client (`client/package.json`)**
- `npm run dev`: Starts Vite hot-reloading dev server.
- `npm run build`: Compiles React app for production.
- `npm run lint`: Runs Oxc linter for rapid code checks.

**Server (`server/package.json`)**
- `npm run dev`: Starts Node.js with Nodemon for auto-restarts on file changes.
- `npm start`: Standard production start command.

---

## 🏆 Project Summary

CodeRoom implements a highly complex problem (Real-time Operational Transformation) using a clean, modern, and scalable architecture. 

**Strengths:**
- **Zero-Friction Onboarding**: Users don't need to create accounts. They use stateless tokens to establish identity and permissions instantly.
- **Resilient State**: Client-side state is persisted via `localStorage` (3-min TTL) preventing data loss on accidental refreshes.
- **Aesthetics**: The UI utilizes premium, dark-mode styling with subtle animations avoiding generic component libraries.

**Maintainability:**
The frontend's feature-based architecture and the backend's modular routing ensure that new developers can isolate their work to specific folders (e.g., modifying `History` without touching `Editor` logic).
