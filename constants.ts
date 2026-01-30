
import { Room, RoomStatus } from './types';

export const ROOMS: Room[] = [
  { id: '521', name: 'Computer Lab 521', capacity: 40, status: RoomStatus.AVAILABLE, features: ['Standard PCs', 'Whiteboard'] },
  { id: '522', name: 'Computer Lab 522', capacity: 40, status: RoomStatus.AVAILABLE, features: ['Standard PCs', 'Projector'] },
  { id: '523', name: 'Advanced Research Lab 523', capacity: 40, status: RoomStatus.AVAILABLE, features: ['High-end GPUs', 'VR Ready'] },
  { id: '531', name: 'Media & Design Lab 531', capacity: 40, status: RoomStatus.AVAILABLE, features: ['Dual Monitors', 'Drawing Tablets'] },
  { id: '532', name: 'Coding Workshop 532', capacity: 40, status: RoomStatus.AVAILABLE, features: ['High-speed Internet', 'Collaboration Space'] },
];

/**
 * โลโก้โรงเรียนมหาวชิราวุธ (MVSK) 
 * ใช้ URL จาก Wikipedia หรือแหล่งที่เข้าถึงได้ง่าย 
 * หากรูปภาพไม่ขึ้น กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
 */
export const MVSK_LOGO = "https://upload.wikimedia.org/wikipedia/th/thumb/a/a2/Mahavajiravudh_Songkhla_School_Logo.png/512px-Mahavajiravudh_Songkhla_School_Logo.png";

export const MVSK_LOGO_ALT = "https://api.dicebear.com/7.x/initials/svg?seed=MVSK&backgroundColor=003366&fontSize=40";
