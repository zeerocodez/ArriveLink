import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Smartphone, User, CreditCard, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Button } from '@/components/ui/Button';

import { useAuth } from '@/context/AuthContext';

interface BookingFlowProps {
  route: any;
  onClose: () => void;
}

export function BookingFlow({ route, onClose }: BookingFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'fee' | 'seats' | 'payment' | 'details' | 'confirm'>('fee');
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handlePayFee = async () => {
    setIsPayingFee(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPayingFee(false);
    setStep('seats');
  };

  const seats = Array.from({ length: 14 }, (_, i) => `S${i + 1}`);

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handlePayment = () => {
    if (selectedSeats.length === 0) return;
    setStep('payment');
  };

  const handleDetails = () => {
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!name || !phone || !route) return;
    setIsSubmitting(true);
    const path = 'bookings';
    try {
      const docRef = await addDoc(collection(db, path), {
        userId: user?.uid || null,
        routeId: route.id || 'unknown',
        operatorName: route.operatorName || 'Unknown',
        from: route.from || 'Unknown',
        to: route.to || 'Unknown',
        userName: name,
        userPhone: phone,
        seats: selectedSeats,
        totalPrice: ((route.price || 0) * selectedSeats.length) + 200, // Price + Fee
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: serverTimestamp(),
      });
      setBookingId(docRef.id);
      setStep('confirm');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    if (!route) return;
    const message = `Hello, I just booked ${selectedSeats.length} seat(s) on ArriveLink for the ${route.from || 'Unknown'} to ${route.to || 'Unknown'} route (${route.operatorName || 'Unknown'}). Booking ID: ${bookingId}. My name is ${name}. Please confirm my seats: ${selectedSeats.join(', ')}.`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const totalPrice = ((route?.price || 0) * selectedSeats.length) + 200;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative border border-mist"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-forest/40 hover:text-forest transition-colors z-10 bg-mist rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-10 max-h-[90vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'fee' && (
              <motion.div
                key="fee"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center text-emerald mx-auto mb-6">
                    <CreditCard size={32} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-forest tracking-tight">Search Fee Required</h3>
                  <p className="text-sm text-forest/60 mt-2">To unlock online booking for this route, a one-time search fee of ₦200 is required.</p>
                </div>

                <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-forest/60 font-medium">Search Fee</span>
                    <span className="text-forest font-bold">₦200.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-mist">
                    <span className="text-forest font-bold">Total to Pay</span>
                    <span className="text-pine font-bold text-lg">₦200.00</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    fullWidth 
                    onClick={handlePayFee} 
                    disabled={isPayingFee}
                    className="py-4"
                  >
                    {isPayingFee ? <Loader2 className="animate-spin mr-2" /> : <CreditCard size={18} className="mr-2" />}
                    Pay ₦200 with Paystack
                  </Button>
                  <p className="text-[10px] text-center text-forest/40 font-medium">Secure payment processed by Paystack. One-time fee per booking.</p>
                </div>
              </motion.div>
            )}

            {step === 'seats' && (
              <motion.div
                key="seats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-heading font-bold text-forest tracking-tight">Select Your Seats</h3>
                  <p className="text-sm text-forest/60 mt-1">Choose your preferred position in the bus.</p>
                </div>

              <div className="bg-mist/30 p-8 rounded-3xl border border-mist">
                <div className="grid grid-cols-4 gap-4">
                  {/* Driver Seat */}
                  <div className="col-start-4 w-12 h-12 rounded-xl bg-mist flex items-center justify-center text-[10px] font-bold text-forest/40 uppercase tracking-widest">
                    DRV
                  </div>
                  
                  {/* Passenger Seats */}
                  {seats.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      className={cn(
                        "w-12 h-12 rounded-xl text-[12px] font-bold transition-all",
                        selectedSeats.includes(seat)
                          ? "bg-emerald text-forest shadow-cta scale-110"
                          : "bg-white border border-mist text-forest/60 hover:border-emerald/50 hover:text-forest"
                      )}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-mist">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Total Price</div>
                  <div className="text-2xl font-bold text-pine">₦{totalPrice.toLocaleString()}</div>
                </div>
                <Button
                  disabled={selectedSeats.length === 0}
                  onClick={handlePayment}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="text-emerald" size={40} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-forest tracking-tight">Unlock Access</h3>
                <p className="text-sm text-forest/60 mt-2">Pay the ₦200 verification fee to confirm your seats with the operator.</p>
              </div>

              <div className="bg-mist/30 p-6 rounded-2xl border border-mist space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-forest/60">Bus Fare ({selectedSeats.length} seats)</span>
                  <span className="font-bold text-forest">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest/60">Verification Fee</span>
                  <span className="font-bold text-forest">₦200</span>
                </div>
                <div className="pt-4 border-t border-mist flex justify-between font-bold text-forest text-lg">
                  <span>Total Due Now</span>
                  <span className="text-emerald">₦200</span>
                </div>
              </div>

              <Button
                onClick={handleDetails}
                fullWidth
                className="py-5"
              >
                Pay ₦200 & Continue
              </Button>
              <p className="text-[11px] text-center text-forest/40 font-medium tracking-wide">
                Secure payment powered by ArriveLink. Bus fare is paid at the terminal.
              </p>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-heading font-bold text-forest tracking-tight">Passenger Details</h3>
                <p className="text-sm text-forest/60 mt-1">We need this to generate your booking pass.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-mist/30 border border-mist rounded-xl px-4 py-4 text-sm text-forest outline-none focus:ring-2 focus:ring-emerald/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-forest/40 font-bold flex items-center gap-2">
                    <Smartphone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080 0000 0000"
                    className="w-full bg-mist/30 border border-mist rounded-xl px-4 py-4 text-sm text-forest outline-none focus:ring-2 focus:ring-emerald/30 transition-all"
                  />
                </div>
              </div>

              <Button
                disabled={!name || !phone || isSubmitting}
                onClick={handleSubmit}
                fullWidth
                className="py-5"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Booking'}
              </Button>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald" size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-forest tracking-tight">Booking Confirmed!</h3>
                <p className="text-sm text-forest/60 mt-2">Your seats are reserved. Please save your booking ID.</p>
              </div>

              <div className="bg-mist/30 p-6 rounded-2xl border border-mist text-left space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-mist">
                  <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Booking ID</span>
                  <span className="text-xs font-mono font-bold text-forest bg-white px-2 py-1 rounded border border-mist">{bookingId?.slice(-8).toUpperCase()}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Operator</span>
                    <p className="text-xs font-bold text-forest">{route.operatorName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Seats</span>
                    <p className="text-xs font-bold text-forest">{selectedSeats.join(', ')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Passenger</span>
                    <p className="text-xs font-bold text-forest truncate">{name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Total Price</span>
                    <p className="text-xs font-bold text-pine">₦{totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-mist">
                  <span className="text-[10px] uppercase tracking-widest text-forest/40 font-bold">Route</span>
                  <p className="text-xs font-bold text-forest">{route.from} → {route.to}</p>
                </div>
              </div>

              <div className="bg-emerald/5 p-6 rounded-2xl border-2 border-dashed border-emerald/20">
                <p className="text-xs text-forest/70 mb-4 leading-relaxed">
                  Connect with our representative <span className="text-emerald font-bold">Musa</span> to finalize your payment and get your ticket.
                </p>
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg text-sm"
                >
                  <MessageSquare size={18} /> Connect on WhatsApp
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-xs text-forest/40 font-bold hover:text-forest transition-colors uppercase tracking-widest"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  </motion.div>
  );
}
