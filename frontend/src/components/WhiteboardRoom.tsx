import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [previewStroke, setPreviewStroke] = useState<DrawingStroke | null>(
    null
  );
  const currentStrokeRef = useRef<DrawingStroke | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorThrottleRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      setConnectionError(null);
      
      // Join room after connection is established
      socket.emit("join-room", {
        roomCode: room.code,
        user: { ...user, socketId: socket.id },
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
      setConnectionError("Connection lost. Attempting to reconnect...");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError("Failed to connect to server");
    });

    socket.on("joined-room", ({ roomCode, users }) => {
      console.log(`Successfully joined room ${roomCode}`);
      setUsers(users);
      setConnectionError(null);
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
      
      // Remove stale cursors after 2 seconds
      setTimeout(() => {
        setUserCursors((prev) => prev.filter((c) => c.userId !== cursorData.userId));
      }, 2000);
    });

    socket.on("clear", () => {
      setStrokes([]);
      console.log("Canvas cleared by another user");
    });

    socket.on("undo", () => {
      setStrokes((prev) => prev.slice(0, -1));
      console.log("Undo performed by another user");
    });

    socket.on("error", ({ message }) => {
      console.error("Server error:", message);
      setConnectionError(message);
    });

    return () => {
      if (cursorThrottleRef.current) {
        clearTimeout(cursorThrottleRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
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
      id: `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        newStroke.endPoint = { x, y };
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

    if (currentTool.type === "pen" || currentTool.type === "eraser") {
      // Continuous drawing for pen/eraser
      currentStroke.points.push({ x, y });
      
      // Update local state immediately for smooth drawing
      setStrokes((prev) => {
        const newStrokes = [...prev];
        const existingIndex = newStrokes.findIndex((s) => s.id === currentStroke.id);
        if (existingIndex >= 0) {
          newStrokes[existingIndex] = { ...currentStroke };
        } else {
          newStrokes.push({ ...currentStroke });
        }
        return newStrokes;
      });

      // Emit to server with throttling
      socketRef.current?.emit("stroke", {
        roomCode: room.code,
        stroke: { ...currentStroke },
      });
    } else {
      // For shapes - update preview
      currentStroke.endPoint = { x, y };
      setPreviewStroke({ ...currentStroke });
    }
  };

  const handleStopDrawing = () => {
    if (!isDrawing || !currentStrokeRef.current) return;

    const finalStroke = currentStrokeRef.current;

    // For shapes, finalize and send to server
    if (currentTool.type !== "pen" && currentTool.type !== "eraser" && currentTool.type !== "text") {
      setStrokes((prev) => [...prev, finalStroke]);
      socketRef.current?.emit("stroke", {
        roomCode: room.code,
        stroke: finalStroke,
      });
    }

    setIsDrawing(false);
    currentStrokeRef.current = null;
    setPreviewStroke(null);
  };

  const handleClearCanvas = () => {
    if (!isConnected) return;
    setStrokes([]);
    socketRef.current?.emit("clear", { roomCode: room.code, userId: user.id });
  };

  const handleUndo = () => {
    if (!isConnected || strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
    socketRef.current?.emit("undo", { roomCode: room.code, userId: user.id });
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality with history stack
    console.log("Redo functionality - to be implemented");
  };

  const sendCursorPosition = useCallback((x: number, y: number) => {
    if (!isConnected) return;

    // Throttle cursor updates to reduce network load
    if (cursorThrottleRef.current) return;

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

    cursorThrottleRef.current = setTimeout(() => {
      cursorThrottleRef.current = null;
    }, 50); // 50ms throttle (20 updates/sec max)
  }, [isConnected, room.code, user]);

  const handleExportCanvas = () => {
    // Export canvas as PNG
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `whiteboard-${room.code}-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export canvas. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <RoomHeader
        room={room}
        user={user}
        users={users}
        onLeaveRoom={onLeaveRoom}
        onToggleUserList={() => setShowUserList(!showUserList)}
      />

      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm">
          {connectionError || "Connecting to room..."}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          currentTool={currentTool}
          onToolChange={handleToolChange}
          onClearCanvas={handleClearCanvas}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onExport={handleExportCanvas}
          canUndo={strokes.length > 0}
          canRedo={false}
        />
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
  );
};

export default WhiteboardRoom;
