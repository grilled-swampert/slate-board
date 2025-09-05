import React, { useState, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UserList from "./UserList";
import RoomHeader from "./RoomHeader";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import type {
  DrawingStroke,
  DrawingTool,
  Room,
  User,
  UserCursor,
} from "../types";
import { BACKEND_URL } from "../config";

interface WhiteboardRoomProps {
  room: Room;
  user: User;
  onLeaveRoom: () => void;
}

const WhiteboardRoom: React.FC<WhiteboardRoomProps> = ({
  room,
  user,
  onLeaveRoom,
}) => {
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: "pen",
    color: "#000000",
    size: 2,
  });
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [users, setUsers] = useState<User[]>([user]);
  const [userCursors, setUserCursors] = useState<UserCursor[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [previewStroke, setPreviewStroke] = useState<DrawingStroke | null>(
    null
  );

  const currentStrokeRef = useRef<DrawingStroke | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);

      // * Join room after connection is established
      socket.emit("join-room", {
        roomCode: room.code,
        user: { ...user, socketId: socket.id },
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("joined-room", ({ roomCode, users }) => {
      console.log(`Successfully joined room ${roomCode}`);
      setUsers(users);
    });

    socket.on("existing-strokes", ({ strokes }) => {
      setStrokes(strokes);
    });

    socket.on("users-updated", ({ users }) => {
      setUsers(users);
    });

    socket.on("stroke", ({ stroke }) => {
      setStrokes((prev) => [...prev, stroke]);
    });

    socket.on("cursor", ({ cursorData }) => {
      setUserCursors((prev) => {
        const others = prev.filter((c) => c.userId !== cursorData.userId);
        return [...others, cursorData];
      });
    });

    socket.on("clear", () => setStrokes([]));

    socket.on("undo", () => setStrokes((prev) => prev.slice(0, -1)));

    return () => {
      socket.disconnect();
    };
  }, [room.code, user]);

  const handleToolChange = (tool: DrawingTool) => {
    setCurrentTool(tool);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!isConnected) return;

    setIsDrawing(true);
    const newStroke: DrawingStroke = {
      id: Math.random().toString(36).substr(2, 9),
      tool: currentTool,
      points: [{ x, y }],
      userId: user.id,
      timestamp: new Date(),
      startPoint: { x, y },
    };
    currentStrokeRef.current = newStroke;

    if (currentTool.type === "text") {
      const text = prompt("Enter text:");
      if (text) {
        newStroke.text = text;
        newStroke.endPoint = { x, y }; // For text, start and end are the same
        setStrokes((prev) => [...prev, newStroke]);
        socketRef.current?.emit("stroke", {
          roomCode: room.code,
          stroke: newStroke,
        });
      }
      setIsDrawing(false);
      currentStrokeRef.current = null;
      return;
    }
  };

  const handleDrawing = (x: number, y: number) => {
    if (!isDrawing || !currentStrokeRef.current || !isConnected) return;

    const currentStroke = currentStrokeRef.current;
    if (
      currentTool.type !== "pen" &&
      currentTool.type !== "eraser" &&
      currentTool.type !== "text"
    ) {
      setPreviewStroke({ ...currentStroke });
    }
    if (currentTool.type === "pen" || currentTool.type === "eraser") {
      // Original logic for pen/eraser - continuous drawing
      currentStroke.points.push({ x, y });
    } else {
      // For shapes (line, rectangle, circle) - only store end point
      currentStroke.endPoint = { x, y };
      // Keep only start point in points array for shapes
      currentStroke.points = [currentStroke.startPoint!];
    }

    // Update local state
    setStrokes((prev) => {
      const newStrokes = [...prev];
      const existingIndex = newStrokes.findIndex(
        (s) => s.id === currentStroke.id
      );

      if (existingIndex >= 0) {
        newStrokes[existingIndex] = { ...currentStroke };
      } else {
        newStrokes.push({ ...currentStroke });
      }
      return newStrokes;
    });

    // Emit to server
    socketRef.current?.emit("stroke", {
      roomCode: room.code,
      stroke: currentStroke,
    });
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
    currentStrokeRef.current = null;
    setPreviewStroke(null);
  };

  const handleClearCanvas = () => {
    if (!isConnected) return;

    setStrokes([]);
    socketRef.current?.emit("clear", { roomCode: room.code });
  };

  const handleUndo = () => {
    if (!isConnected) return;

    setStrokes((prev) => prev.slice(0, -1));
    socketRef.current?.emit("undo", { roomCode: room.code });
  };

  const sendCursorPosition = (x: number, y: number) => {
    if (!isConnected) return;

    const cursorData: UserCursor = {
      userId: user.id,
      x,
      y,
      userName: user.name,
      color: user.color,
    };
    socketRef.current?.emit("cursor", {
      roomCode: room.code,
      cursorData,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <RoomHeader
        room={room}
        user={user}
        users={users}
        onLeaveRoom={onLeaveRoom}
        onToggleUserList={() => setShowUserList(!showUserList)}
      />

      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-medium">Connecting to room...</p>
        </div>
      )}

      <div className="flex-1 flex relative">
        <Toolbar
          currentTool={currentTool}
          onToolChange={handleToolChange}
          onClearCanvas={handleClearCanvas}
          onUndo={handleUndo}
        />

        <div className="flex-1 relative">
          <Canvas
            strokes={strokes}
            userCursors={userCursors}
            isDrawing={isDrawing}
            currentTool={currentTool}
            onStartDrawing={handleStartDrawing}
            onDrawing={handleDrawing}
            onStopDrawing={handleStopDrawing}
            onMouseMove={sendCursorPosition}
            previewStroke={previewStroke}
          />
        </div>

        <UserList
          users={users}
          isVisible={showUserList}
          onClose={() => setShowUserList(false)}
        />
      </div>
    </div>
  );
};

export default WhiteboardRoom;
