import React, { useRef, useEffect, useState } from "react";
import type { DrawingStroke, DrawingTool, UserCursor } from "../types";

interface CanvasProps {
  strokes: DrawingStroke[];
  userCursors: UserCursor[];
  isDrawing: boolean;
  currentTool: DrawingTool;
  onStartDrawing: (x: number, y: number) => void;
  onDrawing: (x: number, y: number) => void;
  onStopDrawing: () => void;
  onMouseMove?: (x: number, y: number) => void;
  previewStroke?: DrawingStroke | null;
}

const Canvas: React.FC<CanvasProps> = ({
  strokes,
  userCursors,
  isDrawing,
  onStartDrawing,
  onDrawing,
  currentTool,
  onStopDrawing,
  onMouseMove,
  previewStroke,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 600;
        setCanvasSize({ width, height });
      }
    };

    const timeoutId = setTimeout(updateCanvasSize, 10);
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Touch support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      onStartDrawing(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      onDrawing(x, y);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      onStopDrawing();
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDrawing, onStartDrawing, onDrawing, onStopDrawing]);

  // Render strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render all strokes
    const renderStroke = (stroke: DrawingStroke, alpha: number = 1) => {
      if (stroke.points.length < 1) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool.color;
      ctx.lineWidth = stroke.tool.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool.type === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalCompositeOperation = "source-over";
      }

      switch (stroke.tool.type) {
        case "pen":
        case "eraser":
          if (stroke.points.length < 2) break;
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          ctx.stroke();
          break;

        case "line":
          if (!stroke.startPoint || !stroke.endPoint) break;
          ctx.moveTo(stroke.startPoint.x, stroke.startPoint.y);
          ctx.lineTo(stroke.endPoint.x, stroke.endPoint.y);
          ctx.stroke();
          break;

        case "rectangle":
          if (!stroke.startPoint || !stroke.endPoint) break;
          const rectWidth = stroke.endPoint.x - stroke.startPoint.x;
          const rectHeight = stroke.endPoint.y - stroke.startPoint.y;
          ctx.strokeRect(
            stroke.startPoint.x,
            stroke.startPoint.y,
            rectWidth,
            rectHeight
          );
          break;

        case "circle":
          if (!stroke.startPoint || !stroke.endPoint) break;
          const centerX = stroke.startPoint.x;
          const centerY = stroke.startPoint.y;
          const radius = Math.sqrt(
            Math.pow(stroke.endPoint.x - centerX, 2) +
              Math.pow(stroke.endPoint.y - centerY, 2)
          );
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        case "text":
          if (!stroke.startPoint || !stroke.text) break;
          ctx.font = `${stroke.tool.size * 8}px Arial`;
          ctx.fillStyle = stroke.tool.color;
          ctx.fillText(stroke.text, stroke.startPoint.x, stroke.startPoint.y);
          break;
      }

      ctx.restore();
    };

    // Render all completed strokes
    strokes.forEach((stroke) => renderStroke(stroke));

    // Render preview stroke with transparency
    if (previewStroke) {
      renderStroke(previewStroke, 0.5);
    }
  }, [strokes, previewStroke, canvasSize]);

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getEventPosition(e);
    onStartDrawing(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getEventPosition(e);

    // Send cursor position for other users
    if (onMouseMove) {
      onMouseMove(pos.x, pos.y);
    }

    // Handle drawing
    if (isDrawing) {
      onDrawing(pos.x, pos.y);
    }
  };

  const handleMouseUp = () => {
    onStopDrawing();
  };

  const getCursorStyle = () => {
    switch (currentTool.type) {
      case "pen":
        return "crosshair";
      case "eraser":
        return "cell";
      case "text":
        return "text";
      default:
        return "crosshair";
    }
  };

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute top-0 left-0 w-full h-full"
        style={{ cursor: getCursorStyle() }}
      />
      
      {/* User cursors */}
      {userCursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none transition-all duration-100"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: cursor.color }}
          />
          <div
            className="absolute top-4 left-4 px-2 py-1 rounded text-white text-xs whitespace-nowrap shadow-md"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.userName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Canvas;
