import React from "react";
import {
  Pen,
  Eraser,
  Minus,
  Square,
  Circle,
  Type,
  Trash2,
  Undo,
  Redo,
  Download,
} from "lucide-react";
import type { DrawingTool } from "../types";

interface ToolbarProps {
  currentTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClearCanvas: () => void;
  onUndo: () => void;
  onRedo?: () => void;
  onExport: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  onClearCanvas,
  onUndo,
  onRedo,
  onExport,
  canUndo = true,
  canRedo = false,
}) => {
  const tools = [
    { type: "pen" as const, icon: Pen, label: "Pen" },
    { type: "eraser" as const, icon: Eraser, label: "Eraser" },
    { type: "line" as const, icon: Minus, label: "Line" },
    { type: "rectangle" as const, icon: Square, label: "Rectangle" },
    { type: "circle" as const, icon: Circle, label: "Circle" },
    { type: "text" as const, icon: Type, label: "Text" },
  ];

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
    "#FFFFFF",
  ];

  const sizes = [1, 2, 4, 8, 16];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
      <div className="space-y-6">
        {/* Tools */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            {tools.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => onToolChange({ ...currentTool, type })}
                className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center lg:justify-start space-x-2 ${
                  currentTool.type === type
                    ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={label}
              >
                <Icon size={20} />
                <span className="hidden lg:inline text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onToolChange({ ...currentTool, color })}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                  currentTool.color === color
                    ? "border-indigo-500 transform scale-110 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Size ({currentTool.size}px)
          </h3>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onToolChange({ ...currentTool, size })}
                className={`flex-1 p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  currentTool.size === size
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center lg:justify-start space-x-2 ${
                canUndo
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Undo size={20} />
              <span className="hidden lg:inline">Undo</span>
            </button>

            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center lg:justify-start space-x-2 ${
                  canRedo
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Redo size={20} />
                <span className="hidden lg:inline">Redo</span>
              </button>
            )}

            <button
              onClick={onClearCanvas}
              className="w-full p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center lg:justify-start space-x-2"
            >
              <Trash2 size={20} />
              <span className="hidden lg:inline">Clear</span>
            </button>

            <button
              onClick={onExport}
              className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center lg:justify-start space-x-2"
            >
              <Download size={20} />
              <span className="hidden lg:inline">Export PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
