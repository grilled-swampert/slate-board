import React, { useState } from 'react';
import { Users, Copy, Check, LogOut } from 'lucide-react';
import type { Room, User } from '../types';

interface RoomHeaderProps {
  room: Room;
  user: User;
  users: User[];
  onLeaveRoom: () => void;
  onToggleUserList: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ 
  room, 
  user, 
  users, 
  onLeaveRoom, 
  onToggleUserList 
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{room.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Room Code:</span>
              <span className="font-mono font-medium">{room.code}</span>
              <button
                onClick={copyRoomCode}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleUserList}
            className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">{users.length}</span>
          </button>
          
          <button
            onClick={onLeaveRoom}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Leave</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default RoomHeader;