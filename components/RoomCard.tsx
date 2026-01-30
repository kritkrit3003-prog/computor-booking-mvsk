
import React from 'react';
import { Room, RoomStatus } from '../types';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  isOccupied: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook, isOccupied }) => {
  const statusColor = isOccupied ? 'bg-amber-500' : 'bg-emerald-500';
  const statusText = isOccupied ? 'In Use' : 'Available';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-2 bg-slate-100 relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${statusColor}`} style={{ width: isOccupied ? '100%' : '0%' }}></div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
              Room {room.id}
            </h3>
            <p className="text-sm text-slate-500">{room.name}</p>
          </div>
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${statusColor}`}>
            {statusText}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="opacity-70">👥</span>
            <span>Capacity: {room.capacity} students</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {room.features.map(f => (
              <span key={f} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onBook(room)}
          disabled={isOccupied}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${
            isOccupied 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200'
          }`}
        >
          {isOccupied ? 'Room Occupied' : 'Book Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
