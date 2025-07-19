import React, { useState } from 'react';
import { Users, Plus, ArrowRight, Copy, Check } from 'lucide-react';
import type { Room, User } from '../types';

interface HomePageProps {
  onJoinRoom: (room: Room, user: User) => void;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ onJoinRoom, currentUser }) => {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateUserColor = () => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateRoom = () => {
    if (!userName.trim()) return;

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      code: generateRoomCode(),
      name: `${userName}'s Room`,
      createdAt: new Date(),
      users: []
    };

    setCreatedRoom(newRoom);
    setIsCreating(true);
  };

  const handleJoinCreatedRoom = () => {
    if (!createdRoom) return;

    const user: User = {
      id: currentUser?.id || generateUserId(),
      name: userName,
      color: currentUser?.color || generateUserColor(),
      isOnline: true,
      joinedAt: new Date().toISOString()
    };

    const updatedRoom = { ...createdRoom, users: [user] };

    onJoinRoom(updatedRoom, user);
  };

  const handleJoinExistingRoom = () => {
    if (!roomCode.trim() || !userName.trim()) return;

    const user: User = {
      id: currentUser?.id || generateUserId(),
      name: userName,
      color: currentUser?.color || generateUserColor(),
      isOnline: true,
      joinedAt: new Date().toISOString()
    };

    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
      code: roomCode.toUpperCase(),
      name: `Room ${roomCode.toUpperCase()}`,
      createdAt: new Date(),
      users: [user],
    };

    onJoinRoom(room, user);
  };

  const copyRoomCode = async () => {
    if (!createdRoom) return;

    try {
      await navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div> */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
            slateboard
          </h1>
          <p className="text-gray-600 italic" style={{ fontFamily: 'Maven Pro' }}>
            collaborative whiteboard
          </p>
        </div>

        {!isCreating ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: 'Trirong' }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your name"
                  style={{ fontFamily: 'Trirong' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCreateRoom}
                disabled={!userName.trim()}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-300 to-lime-400 text-gray-800 rounded-lg font-medium hover:from-emerald-300 hover:to-line-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                style={{ fontFamily: 'Poppins' }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Room
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-slate-50 to-blue-50 text-gray-500">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter room code"
                  style={{ fontFamily: 'Trirong' }}
                />
                <button
                  onClick={handleJoinExistingRoom}
                  disabled={!roomCode.trim() || !userName.trim()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Join Room
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 border border-black-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                Room Created!
              </h2>
              <p className="text-gray-600" style={{ fontFamily: 'Maven Pro' }}>
                Share this code with others to collaborate
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Trirong' }}>
                  Room Code
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Poppins' }}>
                    {createdRoom?.code}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleJoinCreatedRoom}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-300 to-lime-400 text-black rounded-lg font-medium hover:from-emerald-300 hover:to-line-300 transition-all duration-200 transform hover:scale-[1.02]"
                style={{ fontFamily: 'Poppins' }}
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Enter Room
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="w-full px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                style={{ fontFamily: 'Maven Pro' }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
