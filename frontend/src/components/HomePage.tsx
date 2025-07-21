import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Copy, Check, AlertCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');

  // Auto-focus and validation
  useEffect(() => {
    setError('');
  }, [userName, roomCode]);

  // Validate room code format
  useEffect(() => {
    if (roomCode && roomCode.length > 0) {
      if (roomCode.length < 6) {
        setRoomCodeError('Room code must be 6 characters');
      } else if (!/^[A-Z0-9]{6}$/.test(roomCode)) {
        setRoomCodeError('Room code must contain only letters and numbers');
      } else {
        setRoomCodeError('');
      }
    } else {
      setRoomCodeError('');
    }
  }, [roomCode]);

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

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        code: generateRoomCode(),
        name: `${userName.trim()}'s Room`,
        createdAt: new Date(),
        users: []
      };

      setCreatedRoom(newRoom);
      setIsCreating(true);
    } catch (err) {
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCreatedRoom = async () => {
    if (!createdRoom) return;

    setIsLoading(true);

    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 200));

    const user: User = {
      id: currentUser?.id || generateUserId(),
      name: userName.trim(),
      color: currentUser?.color || generateUserColor(),
      isOnline: true,
      joinedAt: new Date().toISOString()
    };

    const updatedRoom = { ...createdRoom, users: [user] };

    onJoinRoom(updatedRoom, user);
  };

  const handleJoinExistingRoom = async () => {
    const trimmedRoomCode = roomCode.trim();
    const trimmedUserName = userName.trim();

    if (!trimmedRoomCode) {
      setError('Please enter a room code');
      return;
    }

    if (!trimmedUserName) {
      setError('Please enter your name');
      return;
    }

    if (roomCodeError) {
      setError('Please enter a valid room code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate room validation
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const user: User = {
        id: currentUser?.id || generateUserId(),
        name: trimmedUserName,
        color: currentUser?.color || generateUserColor(),
        isOnline: true,
        joinedAt: new Date().toISOString()
      };

      const room: Room = {
        id: Math.random().toString(36).substr(2, 9),
        code: trimmedRoomCode.toUpperCase(),
        name: `Room ${trimmedRoomCode.toUpperCase()}`,
        createdAt: new Date(),
        users: [user],
      };

      onJoinRoom(room, user);
    } catch (err) {
      setError('Room not found. Please check the code and try again.');
      setIsLoading(false);
    }
  };

  const copyRoomCode = async () => {
    if (!createdRoom) return;

    try {
      await navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = createdRoom.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleBack = () => {
    setIsCreating(false);
    setCreatedRoom(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
            slateboard
          </h1>
          <p className="text-gray-600 italic" style={{ fontFamily: 'Maven Pro' }}>
            collaborative whiteboard
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm" style={{ fontFamily: 'Trirong' }}>
              {error}
            </p>
          </div>
        )}

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
                  onKeyPress={(e) => handleKeyPress(e, handleCreateRoom)}
                  className="w-full px-4 py-3 border bg-gradient-to-r from-white to-slate-50 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Enter your name"
                  style={{ fontFamily: 'Trirong' }}
                  maxLength={30}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Trirong' }}>
                  This is how others will see you in the room
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCreateRoom}
                disabled={!userName.trim() || isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-300 to-lime-400 text-gray-800 rounded-lg font-medium hover:from-emerald-300 hover:to-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] relative"
                style={{ fontFamily: 'Poppins' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Plus className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Creating...' : 'Create New Room'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-slate-600 rounded-full border border-slate-200" style={{ fontFamily: 'Trirong' }}>or join existing</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    onKeyPress={(e) => handleKeyPress(e, handleJoinExistingRoom)}
                    className={`w-full px-4 py-3 border bg-gradient-to-r from-white to-slate-50 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                      roomCodeError 
                        ? 'border-red-300 focus:ring-red-400' 
                        : 'border-slate-200 focus:ring-indigo-500'
                    }`}
                    placeholder="Enter 6-character room code"
                    style={{ fontFamily: 'Trirong' }}
                    maxLength={6}
                  />
                  {roomCodeError && (
                    <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Trirong' }}>
                      {roomCodeError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Trirong' }}>
                    Ask the room creator for this code
                  </p>
                </div>
                <button
                  onClick={handleJoinExistingRoom}
                  disabled={!roomCode.trim() || !userName.trim() || !!roomCodeError || isLoading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 rounded-lg font-medium hover:from-slate-200 hover:to-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Joining...' : 'Join Room'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                Room Created!
              </h2>
              <p className="text-gray-600" style={{ fontFamily: 'Maven Pro' }}>
                Share this code with others to collaborate
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl border border-indigo-200 p-6 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Trirong' }}>
                  Room Code
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900 tracking-wider select-all" style={{ fontFamily: 'Poppins' }}>
                    {createdRoom?.code}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title={copied ? 'Copied!' : 'Copy room code'}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-xs mt-2" style={{ fontFamily: 'Trirong' }}>
                    Room code copied to clipboard!
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleJoinCreatedRoom}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-300 to-lime-400 text-black rounded-lg font-medium hover:from-emerald-300 hover:to-lime-400 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                style={{ fontFamily: 'Poppins' }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 mr-2 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Entering...' : 'Enter Room'}
              </button>
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="w-full px-4 py-3 text-slate-600 hover:text-slate-800 transition-colors border border-slate-300 rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center disabled:opacity-50"
                style={{ fontFamily: 'Maven Pro' }}
              >
                Create Different Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;