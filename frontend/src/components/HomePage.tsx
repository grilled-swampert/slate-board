import React, { useState } from "react";
import type { Room, User } from "../types";
import { ArrowRight, Check, Copy, Plus, Users } from "lucide-react";

interface HomePageProps {
  onJoinRoom: (room: Room, user: User) => void;
  currentUser: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ onJoinRoom, currentUser }) => {
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState(currentUser?.name || "");
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
    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCreateRoom = () => {
    if (!userName.trim()) return;

    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      code: generateRoomCode(),
      name: `${userName}'s Room`,
      createdAt: new Date(),
      users: [],
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
      joinedAt: new Date(),
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
      joinedAt: new Date(),
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
      console.error("Failed to copy room code");
    }
  };

  return (
    <div className="">
      <div>
        <div>
          <div>
            <div>
              <Users />
            </div>
          </div>
          <h1>slateboard</h1>
          <p>collaborative board</p>
        </div>

        {!isCreating ? (
          <div>
            <div>
              <div>
                <label htmlFor="userName">Your Name</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <button onClick={handleCreateRoom} disabled={!userName.trim()}>
                  <Plus />
                  Create Room
                </button>

                <div>
                  <div>
                    <div></div>
                  </div>
                  <div>
                    <span>or</span>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                  />
                  <button
                    onClick={handleJoinExistingRoom}
                    disabled={!roomCode.trim() || !userName.trim()}
                  >
                    <ArrowRight />
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div>
                <Check />
              </div>
              <h2>Room Created.</h2>
              <p>Share this code with others to collaborate!</p>
            </div>

            <div>
              <div>
                <p>Room Code</p>
                <div>
                  <span>{createdRoom?.code}</span>
                  <button onClick={copyRoomCode}>
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  onClick={handleJoinCreatedRoom}
                >
                  <ArrowRight />
                  Enter Room
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
