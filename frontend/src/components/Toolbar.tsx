import React from 'react';
import { 
  Pen, 
  Eraser, 
  Minus, 
  Square, 
  Circle, 
  Type, 
  Trash2, 
  Undo,
  Download
} from 'lucide-react';
import type { DrawingTool } from '../types';

interface ToolbarProps {
  currentTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClearCanvas: () => void;
  onUndo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  currentTool, 
  onToolChange, 
  onClearCanvas, 
  onUndo 
}) => {
  const tools = [
    { type: 'pen' as const, icon: Pen, label: 'Pen' },
    { type: 'eraser' as const, icon: Eraser, label: 'Eraser' },
    { type: 'line' as const, icon: Minus, label: 'Line' },
    { type: 'rectangle' as const, icon: Square, label: 'Rectangle' },
    { type: 'circle' as const, icon: Circle, label: 'Circle' },
    { type: 'text' as const, icon: Type, label: 'Text' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080'
  ];

  const sizes = [1, 2, 4, 8, 16];

  return (
    <div className="w-16 lg:w-72 bg-white border-r border-gray-200 p-4 flex flex-col space-y-4">
      <div className="space-y-2">
        <h3 className="hidden lg:block text-sm font-medium text-gray-700">Tools</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {tools.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onToolChange({ ...currentTool, type })}
              className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center lg:justify-start space-x-2 ${
                currentTool.type === type
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={label}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="hidden lg:block text-sm font-medium text-gray-700">Colors</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => onToolChange({ ...currentTool, color })}
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                currentTool.color === color
                  ? 'border-gray-400 transform scale-110'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="hidden lg:block text-sm font-medium text-gray-700">Size</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => onToolChange({ ...currentTool, size })}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                currentTool.size === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div 
                className="rounded-full bg-current"
                style={{ 
                  width: `${Math.min(size * 2, 16)}px`, 
                  height: `${Math.min(size * 2, 16)}px` 
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-200">
        <h3 className="hidden lg:block text-sm font-medium text-gray-700">Actions</h3>
        <div className="space-y-2">
          <button
            onClick={onUndo}
            className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center lg:justify-start space-x-2"
          >
            <Undo className="w-5 h-5" />
            <span className="hidden lg:inline text-sm">Undo</span>
          </button>
          <button
            onClick={onClearCanvas}
            className="w-full p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center lg:justify-start space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden lg:inline text-sm">Clear</span>
          </button>

          {/*  // ! NEED TO BE ADDED 
          // */}
          <button
            onClick={() => {}}
            className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center lg:justify-start space-x-2"
          >
            <Download className="w-5 h-5" />
            <span className="hidden lg:inline text-sm">Export</span>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Toolbar;