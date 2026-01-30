
export type RoomId = '521' | '522' | '523' | '531' | '532';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface User {
  studentId: string;
  name: string;
  role: 'student' | 'admin';
}

export interface Booking {
  id: string;
  roomId: RoomId;
  studentId: string;
  startTime: string;
  endTime: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Room {
  id: RoomId;
  name: string;
  capacity: number;
  status: RoomStatus;
  features: string[];
}

export interface UsageStats {
  totalBookings: number;
  totalHours: number;
  popularRoom: RoomId | 'N/A';
  purposeBreakdown: Record<string, number>;
}
