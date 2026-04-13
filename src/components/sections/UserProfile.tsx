import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Calendar, MapPin, Bus, ChevronRight, Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Booking {
  id: string;
  operatorName: string;
  from: string;
  to: string;
  seats: string[];
  totalPrice: number;
  status: string;
  createdAt: any;
  bookingId?: string;
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');

  useEffect(() => {
    if (isOpen && user) {
      fetchBookings();
    }
  }, [isOpen, user]);

  const fetchBookings = async () => {
    if (!user) return;
    setIsLoading(true);
    const path = 'bookings';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // We don't use handleFirestoreError here to avoid throwing and breaking the UI
      // but we could log it or show a toast
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative border border-mist flex flex-col md:flex-row h-[80vh] md:h-auto md:max-h-[85vh]"
          >
            {/* Sidebar / Navigation */}
            <div className="w-full md:w-64 bg-mist/30 border-b md:border-b-0 md:border-r border-mist p-8 flex flex-col">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="relative mb-4">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-20 h-20 rounded-full border-2 border-emerald shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center border-2 border-emerald">
                      <User size={40} className="text-emerald" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-forest text-lg truncate w-full">{user.displayName}</h3>
                <p className="text-xs text-forest/40 font-medium truncate w-full">{user.email}</p>
              </div>

              <nav className="space-y-2 flex-grow">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'profile' ? "bg-emerald text-forest shadow-sm" : "text-forest/60 hover:bg-mist hover:text-forest"
                  )}
                >
                  <User size={18} /> Profile Info
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'history' ? "bg-emerald text-forest shadow-sm" : "text-forest/60 hover:bg-mist hover:text-forest"
                  )}
                >
                  <Calendar size={18} /> Booking History
                </button>
              </nav>

              <div className="mt-auto pt-8 hidden md:block">
                <p className="text-[10px] text-forest/30 font-bold uppercase tracking-widest">Member Since</p>
                <p className="text-xs font-bold text-forest/60">{new Date(user.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col relative overflow-hidden">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-forest/40 hover:text-forest transition-colors z-10 bg-mist rounded-full"
              >
                <X size={20} />
              </button>

              <div className="p-10 overflow-y-auto flex-grow">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-3xl font-heading font-bold text-forest tracking-tight">Your Profile</h2>
                      <p className="text-sm text-forest/60 mt-2 leading-relaxed">Manage your personal information and travel preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                          <User size={12} /> Display Name
                        </span>
                        <p className="text-sm font-bold text-forest">{user.displayName}</p>
                      </div>
                      <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                          <Mail size={12} /> Email Address
                        </span>
                        <p className="text-sm font-bold text-forest">{user.email}</p>
                      </div>
                      <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                          <MapPin size={12} /> Preferred Region
                        </span>
                        <p className="text-sm font-bold text-forest">Lagos, Nigeria</p>
                      </div>
                      <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                          <Bus size={12} /> Travel Frequency
                        </span>
                        <p className="text-sm font-bold text-forest">Frequent Traveler</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-mist">
                      <h4 className="text-sm font-bold text-forest mb-4">Security & Privacy</h4>
                      <div className="flex items-center justify-between p-4 bg-emerald/5 rounded-xl border border-emerald/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald/20 rounded-full flex items-center justify-center">
                            <CheckCircle size={20} className="text-emerald" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-forest">Google Account Linked</p>
                            <p className="text-xs text-forest/60">Your account is verified and secure.</p>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">Manage</Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-heading font-bold text-forest tracking-tight">Booking History</h2>
                        <p className="text-sm text-forest/60 mt-2">View and manage your past travel reservations.</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={fetchBookings} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Refresh"}
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-forest/40">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="text-sm font-bold uppercase tracking-widest">Loading your trips...</p>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id}
                            className="bg-white rounded-2xl p-6 border border-mist shadow-sm hover:border-emerald/30 transition-all group"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-mist rounded-xl flex items-center justify-center text-forest/40 group-hover:bg-emerald/10 group-hover:text-emerald transition-colors">
                                  <Bus size={24} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-forest">{booking.operatorName}</h4>
                                    <span className="text-[10px] font-mono font-bold text-forest/40 bg-mist px-1.5 py-0.5 rounded">#{booking.id.slice(-8).toUpperCase()}</span>
                                  </div>
                                  <p className="text-xs text-forest/40 font-medium">
                                    {booking.createdAt?.toDate ? new Date(booking.createdAt.toDate()).toLocaleDateString() : 'Recent'}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                                  booking.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-emerald/10 text-emerald"
                                )}>
                                  {booking.status}
                                </span>
                                <p className="text-sm font-bold text-pine mt-1">₦{booking.totalPrice.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-mist">
                              <div className="flex items-center gap-2 text-sm font-bold text-forest">
                                <span>{booking.from}</span>
                                <ChevronRight size={14} className="text-forest/30" />
                                <span>{booking.to}</span>
                              </div>
                              <div className="text-xs font-bold text-forest/40">
                                {booking.seats.length} Seat(s): {booking.seats.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center bg-mist/20 rounded-3xl border-2 border-dashed border-mist">
                        <div className="w-16 h-16 bg-mist rounded-full flex items-center justify-center mb-6 text-forest/20">
                          <AlertCircle size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-forest mb-2">No bookings found</h4>
                        <p className="text-sm text-forest/60 max-w-xs mx-auto mb-8">You haven't made any bookings yet. Start your journey today!</p>
                        <Button onClick={onClose}>Search Routes</Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
