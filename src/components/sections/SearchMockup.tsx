import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Heart } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { OperatorCard } from '@/components/ui/OperatorCard';
import { cn } from '@/lib/utils';
import { BookingFlow } from './BookingFlow';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/Button';

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

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse border border-mist">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-mist rounded-md" />
          <div className="h-4 w-24 bg-mist rounded-md" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-7 w-20 bg-mist rounded-md ml-auto" />
          <div className="h-3 w-28 bg-mist rounded-md ml-auto" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-12 bg-mist rounded-md" />
            <div className="h-4 w-20 bg-mist rounded-md" />
          </div>
        ))}
      </div>

      <div className="w-full h-11 bg-mist rounded-xl" />
    </div>
  );
}

export function SearchMockup() {
  const [results, setResults] = useState<BusRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromCity, setFromCity] = useState('Lagos');
  const [toCity, setToCity] = useState('Abuja');
  const [fleetFilter, setFleetFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('price-asc');
  const [favorites, setFavorites] = useState<BusRoute[]>([]);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<BusRoute | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arrivelink_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('arrivelink_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const parseTime = (timeStr: string) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, modifier] = parts;
    const timeParts = time.split(':');
    if (timeParts.length < 2) return 0;
    let [hours, minutes] = timeParts.map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const seedData = async () => {
    try {
      const routesRef = collection(db, 'routes');
      const q = await getDocs(routesRef);
      
      if (q.empty) {
        console.log("Seeding initial bus routes...");
        const initialRoutes = [
          { operatorName: 'GUO Transport', from: 'Lagos', to: 'Abuja', price: 9500, departureTime: '6:00 AM', fleetType: 'Air-Conditioned', rating: 4.6, reviews: 238, lastVerified: serverTimestamp() },
          { operatorName: 'ABC Transport', from: 'Lagos', to: 'Abuja', price: 8200, departureTime: '7:30 AM', fleetType: 'Standard', rating: 4.2, reviews: 189, lastVerified: serverTimestamp() },
          { operatorName: 'GIG Mobility (GIGM)', from: 'Lagos', to: 'Abuja', price: 11000, departureTime: '5:30 AM', fleetType: 'Executive', rating: 4.8, reviews: 512, lastVerified: serverTimestamp() },
          { operatorName: 'Peace Mass Transit', from: 'Lagos', to: 'Port Harcourt', price: 8500, departureTime: '6:30 AM', fleetType: 'Standard', rating: 3.9, reviews: 412, lastVerified: serverTimestamp() },
          { operatorName: 'Chisco Transport', from: 'Lagos', to: 'Port Harcourt', price: 10500, departureTime: '7:00 AM', fleetType: 'Air-Conditioned', rating: 4.4, reviews: 156, lastVerified: serverTimestamp() },
          { operatorName: 'Kano Line', from: 'Abuja', to: 'Kano', price: 4500, departureTime: '8:00 AM', fleetType: 'Standard', rating: 3.5, reviews: 89, lastVerified: serverTimestamp() },
          { operatorName: 'Royal Express', from: 'Abuja', to: 'Kano', price: 6500, departureTime: '9:30 AM', fleetType: 'Air-Conditioned', rating: 4.1, reviews: 67, lastVerified: serverTimestamp() },
          { operatorName: 'Young Shall Grow', from: 'Enugu', to: 'Lagos', price: 9000, departureTime: '6:00 AM', fleetType: 'Standard', rating: 4.0, reviews: 320, lastVerified: serverTimestamp() },
          { operatorName: 'Cross Country', from: 'Ibadan', to: 'Abuja', price: 8800, departureTime: '7:15 AM', fleetType: 'Air-Conditioned', rating: 4.3, reviews: 112, lastVerified: serverTimestamp() },
          { operatorName: 'Big Joe Motors', from: 'Benin City', to: 'Lagos', price: 5500, departureTime: '7:45 AM', fleetType: 'Standard', rating: 4.2, reviews: 204, lastVerified: serverTimestamp() },
        ];

        for (const route of initialRoutes) {
          try {
            await addDoc(routesRef, route);
          } catch (e) {
            if (e instanceof Error && e.message.includes('permission')) {
              console.warn("Skipping seed: No permission to write routes.");
              break;
            }
            throw e;
          }
        }
        return true;
      }
    } catch (error) {
      console.error("Seed data error:", error);
    }
    return false;
  };

  const fetchRoutes = async () => {
    setIsLoading(true);
    const path = 'routes';
    try {
      const routesRef = collection(db, path);
      const q = query(
        routesRef, 
        where('from', '==', fromCity),
        where('to', '==', toCity)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedResults: BusRoute[] = [];
      querySnapshot.forEach((doc) => {
        fetchedResults.push({ id: doc.id, ...doc.data() } as BusRoute);
      });
      
      setResults(fetchedResults);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await seedData();
      await fetchRoutes();
    };
    init();
  }, [fromCity, toCity]);

  const filteredResults = results.filter(route => {
    const matchesFleet = fleetFilter === 'All' || route.fleetType === fleetFilter;
    const matchesRating = route.rating >= ratingFilter;
    return matchesFleet && matchesRating;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'departure':
        return parseTime(a.departureTime) - parseTime(b.departureTime);
      default:
        return 0;
    }
  });

  return (
    <section id="mockup" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[32px] md:text-[48px] font-heading font-bold text-forest mb-6 tracking-tight">This is what finding your bus looks like.</h2>
          <p className="text-[18px] text-forest/70 max-w-2xl mx-auto">Real-time prices fetched from our verified database. Experience the future of Nigerian travel.</p>
        </div>

        <div className="perspective-[3000px]">
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 20, rotateY: -15, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 12, rotateY: -8, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2.5rem] shadow-mockup overflow-hidden border border-mist"
          >
            {/* Mock Browser Header */}
            <div className="bg-mist border-b border-mist px-6 py-4 flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
              </div>
              <div className="flex-1 bg-white border border-mist rounded-lg px-4 py-1.5 text-[12px] text-forest/40 font-sans tracking-wide">
                arrivelink.com/search?from={fromCity.toLowerCase()}&to={toCity.toLowerCase()}
              </div>
            </div>

            {/* Mock Search Bar */}
            <div className="p-8 border-b border-mist bg-mist/20">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-forest/60 font-bold">From</label>
                  <select 
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-medium outline-none focus:ring-2 focus:ring-emerald/30 transition-all"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Ibadan">Ibadan</option>
                    <option value="Benin City">Benin City</option>
                    <option value="Kano">Kano</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-forest/60 font-bold">To</label>
                  <select 
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-medium outline-none focus:ring-2 focus:ring-emerald/30 transition-all"
                  >
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Port Harcourt">Port Harcourt</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Kano">Kano</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-forest/60 font-bold">Date</label>
                  <div className="bg-white border border-mist rounded-xl px-4 py-3.5 text-sm text-forest font-medium flex items-center justify-between cursor-pointer hover:bg-mist/50 transition-all">
                    Fri, Apr 25 <span>▾</span>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={fetchRoutes}
                    fullWidth
                  >
                    <Search size={18} className="mr-2" /> Search Routes
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-mist">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-forest/60 uppercase tracking-widest">Fleet:</span>
                  <div className="flex gap-2">
                    {['All', 'Standard', 'Air-Conditioned', 'Executive'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFleetFilter(type)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider",
                          fleetFilter === type 
                            ? "bg-emerald text-forest shadow-sm" 
                            : "bg-white border border-mist text-forest/60 hover:bg-mist"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-forest/60 uppercase tracking-widest">Rating:</span>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setRatingFilter(rating)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider",
                          ratingFilter === rating 
                            ? "bg-emerald text-forest shadow-sm" 
                            : "bg-white border border-mist text-forest/60 hover:bg-mist"
                        )}
                      >
                        {rating === 0 ? 'Any' : `${rating}+ ★`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-[11px] font-bold text-forest/60 uppercase tracking-widest">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-mist rounded-lg px-4 py-2 text-[11px] font-bold text-forest outline-none focus:ring-2 focus:ring-emerald/30 transition-all uppercase tracking-wider"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="departure">Departure Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mock Results */}
            <div className="p-8 bg-mist/10 min-h-[500px]">
              <ErrorBoundary>
                {/* Favorites Section */}
                <AnimatePresence>
                  {favorites.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-12"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <Heart size={18} className="text-red-500 fill-current" />
                        <h3 className="text-lg font-bold text-forest tracking-tight">Your Favorites</h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {favorites.map((fav) => (
                          <OperatorCard
                            key={`fav-${fav.id}`}
                            id={fav.id}
                            name={fav.operatorName}
                            rating={fav.rating}
                            reviews={fav.reviews}
                            route={`${fav.from} → ${fav.to}`}
                            departure={fav.departureTime}
                            fleet={fav.fleetType}
                            price={fav.price}
                            verifiedDays={1}
                            isFavorited={true}
                            onFavoriteToggle={toggleFavorite}
                            onBook={() => setSelectedRouteForBooking(fav)}
                          />
                        ))}
                      </div>
                      <div className="mt-10 border-b border-mist" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-8 shadow-sm animate-pulse border border-mist h-32" />
                    ))}
                  </div>
                ) : sortedResults.length > 0 ? (
                  <div className="space-y-6">
                    {sortedResults.map((result, i) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <OperatorCard 
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
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-24">
                    <p className="text-forest/40 font-medium">No verified routes found matching your filters.</p>
                  </div>
                )}
              </ErrorBoundary>
              <p className="text-center text-[12px] text-forest/30 font-medium mt-12 tracking-wide">
                ℹ Prices and departure times verified by ArriveLink team. Last batch: April 2026.
              </p>
            </div>
          </motion.div>
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
    </section>
  );
}
