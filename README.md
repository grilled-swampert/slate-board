# Slateboard 🎨

A real-time collaborative whiteboard application that allows multiple users to draw, write, and collaborate together in shared rooms.

![Slateboard Demo](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Slateboard+Demo)

## ✨ Features

- **Real-time Collaborative Drawing** - Multiple users can draw simultaneously
- **Multiple Drawing Tools** - Pen, eraser, shapes (line, rectangle, circle), and text
- **User Cursor Tracking** - See where other users are working in real-time
- **Room-based Collaboration** - Create or join rooms with unique room codes
- **Undo/Redo Functionality** - Easy mistake correction
- **Canvas Clearing** - Clear the entire canvas when needed
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Custom Font Integration** - Beautiful typography with Maven Pro, Poppins, and Trirong fonts

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **Morgan** - HTTP request logging
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
slateboard/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/         # TypeScript interfaces
│   │   ├── assets/        # Fonts and images
│   │   └── config.tsx     # Configuration
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── sockets/          # Socket.IO event handlers
    ├── utils/           # Helper functions
    ├── server.js        # Express server setup
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/slateboard.git
cd slateboard
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
```env
PORT=5000
```

## 🎯 Key Components

### Frontend Components

| Component | Description |
|-----------|-------------|
| `App.tsx` | Main application component handling room/user state |
| `HomePage.tsx` | Landing page with room creation and joining |
| `WhiteboardRoom.tsx` | Main whiteboard interface with socket connections |
| `Canvas.tsx` | Drawing canvas with mouse/touch event handling |
| `Toolbar.tsx` | Drawing tools, color picker, and brush controls |
| `RoomHeader.tsx` | Room information and user management |

### Backend Components

| Component | Description |
|-----------|-------------|
| `server.js` | Express server with Socket.IO initialization |
| `roomManager.js` | Room state management and user tracking |


## 🎨 Drawing Tools

- **Pen** - Freehand drawing with customizable colors and sizes
- **Eraser** - Remove parts of drawings
- **Line** *(in development)* - Draw straight lines  
- **Rectangle** *(in development)* - Create rectangular shapes  
- **Circle** *(in development)* - Draw circular shapes  
- **Text** *(in development)* - Add text annotations


## 📱 Usage

1. **Create a Room**: Click "Create Room" to start a new collaborative session
2. **Join a Room**: Enter a room code to join an existing session
3. **Select Tools**: Use the toolbar to choose drawing tools, colors, and sizes
4. **Collaborate**: Draw in real-time with other users
5. **Manage Canvas**: Use undo, redo, or clear functions as needed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
