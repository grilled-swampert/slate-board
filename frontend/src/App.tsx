import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import WhiteboardRoom from './components/WhiteboardRoom';
import { Room, User } from './types';

function App() {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Generate a random user ID and name when app starts
    const userId = Math.random().toString(36).substr(2, 9);
    const userName = `User ${userId.substr(0, 4)}`;
    setCurrentUser({ id: userId, name: userName, color: '#3B82F6' });
  }, []);

  const handleJoinRoom = (room: Room, user: User) => {
    setCurrentRoom(room);
    setCurrentUser(user);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!currentRoom ? (
        <HomePage onJoinRoom={handleJoinRoom} currentUser={currentUser} />
      ) : (
        <WhiteboardRoom 
          room={currentRoom} 
          user={currentUser!} 
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;