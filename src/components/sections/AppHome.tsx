import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Heart, Filter, ArrowRight, MapPin, Calendar as CalendarIcon, ChevronDown, Star } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { OperatorCard } from '@/components/ui/OperatorCard';
import { cn } from '@/lib/utils';
import { BookingFlow } from './BookingFlow';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const NIGERIAN_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Enugu', 'Ibadan', 'Benin City', 'Kano', 
  'Kaduna', 'Jos', 'Owerri', 'Aba', 'Warri', 'Uyo', 'Calabar', 'Akure', 
  'Abeokuta', 'Ilorin', 'Minna', 'Lokoja', 'Makurdi', 'Bauchi', 'Gombe', 
  'Yola', 'Maiduguri', 'Sokoto', 'Katsina', 'Zaria', 'Asaba', 'Onitsha'
];

interface BusRoute {
  id: string;
  operatorName: string;
  from: string;
  to: string;
  price: number;
  departureTime: string;
  fleetType: string;
  rating: number;
  reviews: number;
  lastVerified: any;
}

export function AppHome() {
  const { user } = useAuth();
  const [results, setResults] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCity, setFromCity] = useState('Lagos');
  const [toCity, setToCity] = useState('Abuja');
  const [fleetFilter, setFleetFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [favorites, setFavorites] = useState<BusRoute[]>([]);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<BusRoute | null>(null);

  useEffect(() => {
    const path = 'routes';
    const routesRef = collection(db, path);
    const q = query(
      routesRef, 
      where('from', '==', fromCity),
      where('to', '==', toCity)
    );
    
    setIsLoading(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedResults: BusRoute[] = [];
      snapshot.forEach((doc) => {
        fetchedResults.push({ id: doc.id, ...doc.data() } as BusRoute);
      });
      setResults(fetchedResults);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching routes:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fromCity, toCity]);

  const toggleFavorite = (id: string) => {
    const isFav = favorites.some(f => f.id === id);
    if (isFav) {
      setFavorites(favorites.filter(f => f.id !== id));
    } else {
      const routeToAdd = results.find(r => r.id === id);
      if (routeToAdd) {
        setFavorites([...favorites, routeToAdd]);
      }
    }
  };

  const sortedResults = [...results]
    .filter(r => fleetFilter === 'All' || r.fleetType === fleetFilter)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-mist/20">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-mist p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                FROM
              </label>
              <div className="relative">
                <select 
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-bold outline-none focus:ring-2 focus:ring-emerald/30 transition-all appearance-none cursor-pointer"
                >
                  {NIGERIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest/40">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                TO
              </label>
              <div className="relative">
                <select 
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-bold outline-none focus:ring-2 focus:ring-emerald/30 transition-all appearance-none cursor-pointer"
                >
                  {NIGERIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-forest/40">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                DATE
              </label>
              <div className="w-full bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-bold flex items-center justify-between cursor-pointer hover:border-emerald/30 transition-all">
                Fri, Apr 25 <ChevronDown size={14} className="text-forest/40" />
              </div>
            </div>

            <Button 
              className="w-full md:w-auto px-10 py-4 h-auto bg-emerald hover:bg-emerald/90 text-white border-none shadow-lg shadow-emerald/20"
            >
              Search →
            </Button>
          </div>
        </div>

        {/* Filters & Results */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                <Filter size={12} /> Fleet Type
              </h4>
              <div className="space-y-2">
                {['All', 'Standard', 'Air-Conditioned', 'Executive'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFleetFilter(type)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all",
                      fleetFilter === type 
                        ? "bg-emerald text-forest shadow-sm" 
                        : "text-forest/60 hover:bg-white hover:text-forest"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-mist rounded-xl px-4 py-3 text-xs font-bold text-forest outline-none focus:ring-2 focus:ring-emerald/30 transition-all"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            {favorites.length > 0 && (
              <div className="pt-8 border-t border-mist">
                <h4 className="text-[10px] uppercase tracking-widest text-forest/40 font-bold mb-4 flex items-center gap-2">
                  <Heart size={12} className="text-red-500 fill-current" /> Favorites ({favorites.length})
                </h4>
                <div className="space-y-3">
                  {favorites.map(fav => (
                    <div key={fav.id} className="text-xs font-bold text-forest/60 hover:text-emerald cursor-pointer transition-colors flex items-center justify-between group">
                      <span className="truncate">{fav.operatorName}</span>
                      <button onClick={() => toggleFavorite(fav.id)} className="opacity-0 group-hover:opacity-100 text-red-400">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="flex-grow space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-forest/40 uppercase tracking-widest">
                {isLoading ? 'Searching...' : `${sortedResults.length} Verified Routes Found`}
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-10 border border-mist animate-pulse h-32" />
                  ))}
                </motion.div>
              ) : sortedResults.length > 0 ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {sortedResults.map((result, i) => (
                    <OperatorCard 
                      key={result.id}
                      id={result.id}
                      variant="horizontal"
                      name={result.operatorName}
                      rating={result.rating}
                      reviews={result.reviews}
                      route={`${result.from} → ${result.to}`}
                      departure={result.departureTime}
                      fleet={result.fleetType}
                      price={result.price}
                      verifiedDays={i + 1}
                      badge={i === 0 ? "HIGHEST RATED" : undefined}
                      isFavorited={favorites.some(f => f.id === result.id)}
                      onFavoriteToggle={toggleFavorite}
                      onBook={() => setSelectedRouteForBooking(result)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-mist"
                >
                  <div className="w-16 h-16 bg-mist rounded-full flex items-center justify-center mb-6 text-forest/20">
                    <Search size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-forest mb-2">No routes found</h4>
                  <p className="text-sm text-forest/60 max-w-xs mx-auto">Try adjusting your filters or searching for a different route.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedRouteForBooking && (
          <BookingFlow 
            route={selectedRouteForBooking} 
            onClose={() => setSelectedRouteForBooking(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
