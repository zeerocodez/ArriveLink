import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit3,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { seedMajorRoutes } from '@/lib/seed';

interface Route {
  id: string;
  operatorName: string;
  from: string;
  to: string;
  price: number;
  departureTime: string;
  fleetType: string;
  rating: number;
  reviews: number;
}

interface Booking {
  id: string;
  userName: string;
  userPhone: string;
  operatorName: string;
  from: string;
  to: string;
  seats: string[];
  totalPrice: number;
  status: string;
  createdAt: any;
}

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'bookings' | 'users'>('overview');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const routesUnsubscribe = onSnapshot(
      query(collection(db, 'routes'), orderBy('operatorName')),
      (snapshot) => {
        const fetchedRoutes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Route[];
        setRoutes(fetchedRoutes);
        setIsLoading(false);
      }
    );

    const bookingsUnsubscribe = onSnapshot(
      query(collection(db, 'bookings'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
        setBookings(fetchedBookings);
      }
    );

    return () => {
      routesUnsubscribe();
      bookingsUnsubscribe();
    };
  }, [isAdmin]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedMajorRoutes();
    } catch (error) {
      console.error("Seeding failed:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      await deleteDoc(doc(db, 'routes', id));
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4">
          <XCircle size={48} className="text-red-500 mx-auto" />
          <h2 className="text-2xl font-heading font-bold text-forest">Access Denied</h2>
          <p className="text-forest/60">You do not have permission to view this page.</p>
          <Button onClick={() => window.location.href = '/'}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist/20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-forest text-white p-8 flex flex-col fixed h-full z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
            <span className="text-forest font-heading text-2xl">A</span>
          </div>
          <span className="text-xl font-heading font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-grow">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'overview' ? "bg-emerald text-forest" : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'routes' ? "bg-emerald text-forest" : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Bus size={18} /> Manage Routes
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'bookings' ? "bg-emerald text-forest" : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Calendar size={18} /> Bookings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'users' ? "bg-emerald text-forest" : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Users size={18} /> Users
          </button>
        </nav>

        <div className="pt-8 border-t border-white/10">
          <Button 
            variant="secondary" 
            fullWidth 
            size="sm" 
            onClick={handleSeed}
            disabled={isSeeding}
          >
            {isSeeding ? <Loader2 className="animate-spin mr-2" size={14} /> : <TrendingUp size={14} className="mr-2" />}
            Seed Major Routes
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-forest tracking-tight capitalize">{activeTab}</h1>
            <p className="text-sm text-forest/60">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/30" size={16} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white border border-mist rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald/30 w-64"
              />
            </div>
            <div className="w-10 h-10 bg-white border border-mist rounded-xl flex items-center justify-center text-forest/60">
              <Filter size={18} />
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-mist shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald/10 rounded-xl text-emerald">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-forest">{bookings.length}</h3>
                <p className="text-xs text-forest/40 font-bold uppercase tracking-widest">Total Bookings</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-mist shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                    <Bus size={24} />
                  </div>
                  <span className="text-xs font-bold text-blue-500">{routes.length}</span>
                </div>
                <h3 className="text-2xl font-bold text-forest">{routes.length}</h3>
                <p className="text-xs text-forest/40 font-bold uppercase tracking-widest">Active Routes</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-mist shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold text-orange-500">+5</span>
                </div>
                <h3 className="text-2xl font-bold text-forest">124</h3>
                <p className="text-xs text-forest/40 font-bold uppercase tracking-widest">Total Users</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-mist shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pine/10 rounded-xl text-pine">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-xs font-bold text-pine">₦24.5k</span>
                </div>
                <h3 className="text-2xl font-bold text-forest">₦{bookings.reduce((acc, b) => acc + b.totalPrice, 0).toLocaleString()}</h3>
                <p className="text-xs text-forest/40 font-bold uppercase tracking-widest">Revenue</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl border border-mist shadow-sm overflow-hidden">
                <div className="p-6 border-b border-mist flex justify-between items-center">
                  <h3 className="font-bold text-forest">Recent Bookings</h3>
                  <Button variant="secondary" size="sm">View All</Button>
                </div>
                <div className="divide-y divide-mist">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-mist/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-mist rounded-full flex items-center justify-center text-forest/40">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-forest">{booking.userName}</p>
                          <p className="text-xs text-forest/40">{booking.from} → {booking.to}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-pine">₦{booking.totalPrice.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-forest/40 uppercase">{booking.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-mist shadow-sm overflow-hidden">
                <div className="p-6 border-b border-mist flex justify-between items-center">
                  <h3 className="font-bold text-forest">Top Routes</h3>
                  <Button variant="secondary" size="sm">Analytics</Button>
                </div>
                <div className="p-6 space-y-6">
                  {['Lagos → Abuja', 'Abuja → Kano', 'Enugu → Lagos'].map((route, i) => (
                    <div key={route} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-forest">{route}</span>
                        <span className="text-forest/40">{85 - i * 15}% occupancy</span>
                      </div>
                      <div className="h-2 bg-mist rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald rounded-full" 
                          style={{ width: `${85 - i * 15}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-forest">{routes.length} Active Routes</h3>
              <Button size="sm">
                <Plus size={18} className="mr-2" /> Add New Route
              </Button>
            </div>

            <div className="bg-white rounded-2xl border border-mist shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-mist/30 border-b border-mist">
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Operator</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">From</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">To</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Departure</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Price</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Fleet</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {routes.map((route) => (
                    <tr key={route.id} className="hover:bg-mist/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-mist rounded-lg flex items-center justify-center text-forest/40">
                            <Bus size={16} />
                          </div>
                          <span className="text-sm font-bold text-forest">{route.operatorName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-forest/60 font-medium">{route.from}</td>
                      <td className="p-4 text-sm text-forest/60 font-medium">{route.to}</td>
                      <td className="p-4 text-sm text-forest/60 font-medium">{route.departureTime}</td>
                      <td className="p-4 text-sm font-bold text-pine">₦{route.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-emerald/10 text-emerald rounded-full">
                          {route.fleetType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-forest/40 hover:text-emerald transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRoute(route.id)}
                            className="p-2 text-forest/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-forest">{bookings.length} Total Bookings</h3>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Export CSV</Button>
                <Button variant="secondary" size="sm">Filter</Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-mist shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-mist/30 border-b border-mist">
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Customer</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Route</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Seats</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Total</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Status</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Date</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest text-forest/40 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-mist/10 transition-colors">
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-forest">{booking.userName}</p>
                          <p className="text-[10px] text-forest/40 font-medium">{booking.userPhone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-forest/60 font-medium">{booking.from} → {booking.to}</td>
                      <td className="p-4 text-sm text-forest/60 font-medium">{booking.seats.join(', ')}</td>
                      <td className="p-4 text-sm font-bold text-pine">₦{booking.totalPrice.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
                          booking.status === 'pending' && "bg-yellow-100 text-yellow-700",
                          booking.status === 'confirmed' && "bg-emerald/10 text-emerald",
                          booking.status === 'cancelled' && "bg-red-100 text-red-700"
                        )}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-forest/60 font-medium">
                        {booking.createdAt?.toDate ? new Date(booking.createdAt.toDate()).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {booking.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                className="p-2 text-emerald hover:bg-emerald/10 rounded-lg transition-all"
                                title="Confirm Booking"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Cancel Booking"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {booking.status !== 'pending' && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(booking.id, 'pending')}
                              className="p-2 text-forest/40 hover:text-forest transition-colors"
                              title="Reset to Pending"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
