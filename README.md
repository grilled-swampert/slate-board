# slateboard 

a real-time collaborative whiteboard application that allows multiple users to draw, write, and collaborate together in shared rooms.

![slateboard demo](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=slateboard+demo)

## features

- **real-time collaborative drawing** - multiple users can draw simultaneously
- **user cursor tracking** - see where other users are working in real-time
- **room-based collaboration** - create or join rooms with unique room codes
- **undo/redo functionality** - easy mistake correction
- **canvas clearing** - clear the entire canvas when needed

## ���� project structure

```
slateboard/
├── frontend/
│   ├── src/
│   │   ├── components/     # react components
│   │   ├── types/         # typescript interfaces
│   │   ├── assets/        # fonts and images
│   │   └── config.tsx     # configuration
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── sockets/          # socket.io event handlers
    ├── utils/           # helper functions
    ├── server.js        # express server setup
    └── package.json
```

## ����️ installation & setup

### prerequisites
- node.js (v16 or higher)
- npm or yarn

### clone the repository
```bash
git clone https://github.com/grilled-swampert/slate-board.git
cd slateboard
```

### backend setup
```bash
cd backend
npm install
npm start
```

### frontend setup
```bash
cd frontend
npm install
npm run dev
```

## ���� environment variables

### frontend (.env)
```env
vite_backend_url=http://localhost:5000
```

### backend (.env)
```env
port=5000
```

## ���� key components

### frontend components

| component | description |
|-----------|-------------|
| `app.tsx` | main application component handling room/user state |
| `homepage.tsx` | landing page with room creation and joining |
| `whiteboardroom.tsx` | main whiteboard interface with socket connections |
| `canvas.tsx` | drawing canvas with mouse/touch event handling |
| `toolbar.tsx` | drawing tools, color picker, and brush controls |
| `roomheader.tsx` | room information and user management |

### backend components

| component | description |
|-----------|-------------|
| `server.js` | express server with socket.io initialization |
| `roommanager.js` | room state management and user tracking |


## ���� drawing tools

- **pen** - freehand drawing with customizable colors and sizes
- **eraser** - remove parts of drawings
- **line** *(in development)* - draw straight lines  
- **rectangle** *(in development)* - create rectangular shapes  
- **circle** *(in development)* - draw circular shapes  
- **text** *(in development)* - add text annotations


## ���� usage

1. **create a room**: click "create room" to start a new collaborative session
2. **join a room**: enter a room code to join an existing session
3. **select tools**: use the toolbar to choose drawing tools, colors, and sizes
4. **collaborate**: draw in real-time with other users
5. **manage canvas**: use undo, redo, or clear functions as needed

## ���� contributing

1. fork the repository
2. create your feature branch (`git checkout -b feature/amazingfeature`)
3. commit your changes (`git commit -m 'add some amazingfeature'`)
4. push to the branch (`git push origin feature/amazingfeature`)
5. open a pull request
