import React from 'react';
import { X, Crown } from 'lucide-react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  isVisible: boolean;
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-20">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Users ({users.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{user.name}</span>
                {index === 0 && (
                  <Crown className="w-4 h-4 text-yellow-500" title="Room Owner" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-green-500"
                  title="Online"
                />
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600 text-center">
          Invite others by sharing the room code
        </div>
      </div>
    </div>
  );
};

export default UserList;