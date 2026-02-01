
import React, { useState, useEffect, useMemo } from 'react';
import { User, RoomId, Booking, Room, BookingStatus, UsageStats } from './types';
import { ROOMS, MVSK_LOGO } from './constants';
import Layout from './components/Layout';
import RoomCard from './components/RoomCard';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginId, setLoginId] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showBookingModal, setShowBookingModal] = useState<Room | null>(null);
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [bookingDuration, setBookingDuration] = useState('1');

  // Load state from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mvsk_user');
    const savedBookings = localStorage.getItem('mvsk_bookings');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    localStorage.setItem('mvsk_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId.length < 5) {
      alert("กรุณาใส่เลขประจำตัวนักเรียนให้ถูกต้อง (อย่างน้อย 5 หลัก)");
      return;
    }
    const newUser: User = {
      studentId: loginId,
      name: `นักเรียนรหัส ${loginId}`,
      role: 'student'
    };
    setUser(newUser);
    localStorage.setItem('mvsk_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    localStorage.removeItem('mvsk_user');
  };

  const createBooking = () => {
    if (!showBookingModal || !user) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: showBookingModal.id,
      studentId: user.studentId,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + parseInt(bookingDuration) * 60 * 60 * 1000).toISOString(),
      purpose: bookingPurpose || 'ใช้งานทั่วไป',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    setShowBookingModal(null);
    setBookingPurpose('');
    setBookingDuration('1');
    alert(`จองห้อง ${showBookingModal.id} สำเร็จ!`);
  };

  const handleCheckIn = (id: string) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'active', actualCheckIn: new Date().toISOString() } : b
    ));
  };

  const handleCheckOut = (id: string) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'completed', actualCheckOut: new Date().toISOString() } : b
    ));
  };

  const isRoomOccupied = (roomId: RoomId) => {
    return bookings.some(b => b.roomId === roomId && b.status === 'active');
  };

  const stats: UsageStats = useMemo(() => {
    const completed = bookings.filter(b => b.status === 'completed');
    const totalHours = completed.reduce((acc, b) => {
      if (!b.actualCheckIn || !b.actualCheckOut) return acc;
      const diff = new Date(b.actualCheckOut).getTime() - new Date(b.actualCheckIn).getTime();
      return acc + (diff / (1000 * 60 * 60));
    }, 0);

    const roomCounts: Record<string, number> = {};
    const purposeCounts: Record<string, number> = {};
    
    completed.forEach(b => {
      roomCounts[b.roomId] = (roomCounts[b.roomId] || 0) + 1;
      purposeCounts[b.purpose] = (purposeCounts[b.purpose] || 0) + 1;
    });

    const popularRoom = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as RoomId || 'N/A';

    return {
      totalBookings: completed.length,
      totalHours: Math.round(totalHours * 10) / 10,
      popularRoom,
      purposeBreakdown: purposeCounts
    };
  }, [bookings]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#001f3f] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#003366] via-[#001f3f] to-[#000a1a]">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-top-10 duration-1000">
            <div className="mb-6 inline-block relative group">
              <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
                <img 
                  src={MVSK_LOGO} 
                  alt="MVSK School Logo" 
                  className="w-36 h-36 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all group-hover:scale-110 duration-700"
                  onError={(e) => {
                    // Fallback to stylized M if image fails
                    (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=MVSK&backgroundColor=003366&fontFamily=Arial&fontWeight=700";
                  }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">MVSK COMPUTER BOOKING</h1>
            <p className="text-[#bf9b30] text-sm font-semibold uppercase tracking-widest">โรงเรียนมหาวชิราวุธ จังหวัดสงขลา</p>
          </div>

          <form 
            onSubmit={handleLogin} 
            className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 animate-in zoom-in-95 duration-500"
          >
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">
                Student ID (เลขประจำตัวนักเรียน)
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">👤</span>
                <input 
                  type="text"
                  placeholder="กรอกรหัสประจำตัว 5 หลัก"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#003366]/10 focus:border-[#003366] outline-none transition-all text-xl font-bold text-slate-800 placeholder:text-slate-300"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full py-5 bg-[#003366] text-white rounded-2xl font-black text-xl hover:bg-[#002244] transform transition-all active:scale-[0.98] shadow-2xl shadow-[#003366]/30 group flex items-center justify-center gap-3 overflow-hidden relative"
            >
              <span className="relative z-10">SIGN IN / เข้าสู่ระบบ</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </button>
            
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
               <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                 Powered by IT Center MVSK
               </p>
            </div>
          </form>
          
          <div className="mt-8 text-center text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} Mahavajiravudh Songkhla School</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} currentView={currentView} onViewChange={setCurrentView}>
      
      {currentView === 'dashboard' && (
        <div className="animate-in fade-in duration-700">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-[#003366] tracking-tight mb-2">ระบบจองห้องคอมพิวเตอร์</h2>
              <p className="text-slate-500 font-medium">ตรวจสอบสถานะห้องว่างและทำการจองแบบเรียลไทม์</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute opacity-75"></div>
                <div className="relative w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <span className="text-sm font-black text-[#003366] uppercase tracking-widest">สถานะระบบ: ปกติ</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROOMS.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                isOccupied={isRoomOccupied(room.id)}
                onBook={(r) => setShowBookingModal(r)}
              />
            ))}
          </div>
        </div>
      )}

      {currentView === 'my-bookings' && (
        <div className="animate-in slide-in-from-right-10 duration-500">
          <header className="mb-10">
            <h2 className="text-4xl font-black text-[#003366] tracking-tight mb-2">รายการจองของฉัน</h2>
            <p className="text-slate-500">จัดการการเข้าใช้งานและตรวจสอบประวัติย้อนหลัง</p>
          </header>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8fafc] border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">ห้อง / สถานะ</th>
                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">เวลาที่จอง</th>
                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">วัตถุประสงค์</th>
                    <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-slate-400">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.filter(b => b.studentId === user.studentId).length > 0 ? (
                    bookings.filter(b => b.studentId === user.studentId).reverse().map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-7">
                          <div className="font-black text-xl text-slate-800">Lab {b.roomId}</div>
                          <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            b.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 
                            b.status === 'completed' ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {b.status === 'pending' ? 'รอเช็คอิน' : b.status === 'active' ? 'กำลังใช้งาน' : 'เสร็จสิ้น'}
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="text-base font-bold text-slate-700">{new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                          <div className="text-xs text-slate-400 font-bold">{new Date(b.startTime).toLocaleDateString()}</div>
                        </td>
                        <td className="px-10 py-7">
                          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">{b.purpose}</span>
                        </td>
                        <td className="px-10 py-7">
                          {b.status === 'pending' && (
                            <button 
                              onClick={() => handleCheckIn(b.id)}
                              className="px-6 py-3 bg-[#003366] text-white rounded-2xl text-xs font-black hover:bg-[#002244] transition-all shadow-lg shadow-[#003366]/20 active:scale-95"
                            >
                              เช็คอินเข้าใช้งาน
                            </button>
                          )}
                          {b.status === 'active' && (
                            <button 
                              onClick={() => handleCheckOut(b.id)}
                              className="px-6 py-3 bg-rose-500 text-white rounded-2xl text-xs font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95"
                            >
                              คืนห้อง (Check-Out)
                            </button>
                          )}
                          {b.status === 'completed' && (
                            <div className="flex items-center gap-2 text-xs text-emerald-500 font-black">
                              <span className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                สำเร็จแล้ว
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center text-slate-400 font-bold italic">
                        ยังไม่มีประวัติการจองในขณะนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {currentView === 'reports' && (
        <div className="animate-in zoom-in-95 duration-500">
          <header className="mb-10">
            <h2 className="text-4xl font-black text-[#003366] tracking-tight mb-2">รายงานการเข้าใช้งาน</h2>
            <p className="text-slate-500">สถิติรวมจากการบันทึกข้อมูลการใช้งานห้องคอมพิวเตอร์</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <StatCard label="ครั้งที่ใช้งานสำเร็จ" value={stats.totalBookings} icon="📋" color="bg-indigo-600" />
            <StatCard label="ชั่วโมงรวมทั้งหมด" value={`${stats.totalHours} ชม.`} icon="⏱️" color="bg-[#003366]" />
            <StatCard label="ห้องที่นิยมที่สุด" value={`Room ${stats.popularRoom}`} icon="🏆" color="bg-[#bf9b30]" />
            <StatCard label="จำนวนผู้ใช้รายคน" value={new Set(bookings.map(b => b.studentId)).size} icon="👥" color="bg-emerald-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-[#003366] mb-8 flex items-center gap-3">
                <span className="text-2xl">📊</span> วิเคราะห์วัตถุประสงค์
              </h3>
              <div className="space-y-6">
                {Object.entries(stats.purposeBreakdown).length > 0 ? (
                  Object.entries(stats.purposeBreakdown).map(([purpose, count]) => (
                    <div key={purpose} className="group">
                      <div className="flex justify-between text-sm mb-2 font-black text-slate-600">
                        <span>{purpose}</span>
                        <span className="text-[#003366]">{count} รายการ</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#003366] to-[#0055aa] rounded-full transition-all duration-1000 group-hover:brightness-125" 
                          style={{ width: `${(count / stats.totalBookings) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-300 italic font-bold">ยังไม่มีข้อมูลเพียงพอสำหรับการวิเคราะห์</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-[#003366] mb-8 flex items-center gap-3">
                <span className="text-2xl">📝</span> ล็อกล่าสุดในระบบ
              </h3>
              <div className="space-y-4">
                {bookings.filter(b => b.status === 'completed').slice(-6).reverse().map(b => (
                  <div key={b.id} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="w-14 h-14 bg-[#003366]/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💻</div>
                    <div className="flex-grow">
                      <div className="text-base font-black text-slate-800">Room {b.roomId}</div>
                      <div className="text-xs font-bold text-slate-400">รหัสนักเรียน: {b.studentId}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">LOGGED</div>
                      <div className="text-xs text-slate-500 font-bold mt-1">{new Date(b.actualCheckOut!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                ))}
                {bookings.filter(b => b.status === 'completed').length === 0 && (
                   <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest italic">No System Logs</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-[#001f3f]/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-[#003366] mb-1">ยืนยันการจอง</h3>
                <p className="text-slate-500 font-bold">ห้อง {showBookingModal.id} • {showBookingModal.name}</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(null)} 
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white shadow-sm transition-all text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">เลือกระยะเวลา</label>
                <div className="grid grid-cols-2 gap-3">
                  {['1', '2', '3', '4'].map(h => (
                    <button 
                      key={h}
                      onClick={() => setBookingDuration(h)}
                      className={`py-4 px-6 rounded-2xl font-black text-lg transition-all border-2 ${
                        bookingDuration === h 
                        ? 'bg-[#003366] border-[#003366] text-white shadow-xl shadow-[#003366]/20' 
                        : 'bg-white border-slate-200 text-slate-400 hover:border-[#003366]/30'
                      }`}
                    >
                      {h} ชั่วโมง
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-widest">วัตถุประสงค์ (ระบุเพื่อเก็บสถิติ)</label>
                <textarea 
                  rows={3}
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  placeholder="เช่น ทำโครงงานวิชาคอมพิวเตอร์, ค้นคว้าข้อมูลวิจัย..."
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-[#003366]/10 focus:border-[#003366] outline-none resize-none font-bold"
                ></textarea>
              </div>

              <div className="bg-[#fff9e6] border border-[#fce8b2] p-6 rounded-[2rem] flex gap-4">
                <span className="text-2xl">🚩</span>
                <div className="text-xs text-[#856404] leading-relaxed font-bold">
                  <strong>นโยบายโรงเรียน:</strong> ข้อมูลการใช้งานนี้จะถูกจัดเก็บเพื่อใช้ในการพัฒนาคุณภาพการเรียนการสอน โปรดรักษาความสะอาดและปิดเครื่องหลังใช้งานทุกครั้ง
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#f8fafc] flex gap-4">
              <button 
                onClick={() => setShowBookingModal(null)}
                className="flex-grow py-5 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all text-lg"
              >
                ยกเลิก
              </button>
              <button 
                onClick={createBooking}
                className="flex-grow py-5 bg-[#003366] text-white rounded-2xl font-black hover:bg-[#002244] transition-all shadow-2xl shadow-[#003366]/20 active:scale-95 text-lg"
              >
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      )}

      <AIAssistant roomStatus={{ rooms: ROOMS, activeBookings: bookings.filter(b => b.status === 'active').length, stats }} />
    </Layout>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex items-start justify-between group hover:border-[#003366]/20 transition-all hover:translate-y-[-4px]">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{label}</p>
      <h4 className="text-3xl font-black text-slate-800">{value}</h4>
    </div>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl shadow-2xl shadow-black/5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

export default App;
