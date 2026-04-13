import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const NIGERIAN_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Enugu', 'Ibadan', 'Benin City', 'Kano', 
  'Kaduna', 'Jos', 'Owerri', 'Aba', 'Warri', 'Uyo', 'Calabar', 'Akure', 
  'Abeokuta', 'Ilorin', 'Minna', 'Lokoja', 'Makurdi', 'Bauchi', 'Gombe', 
  'Yola', 'Maiduguri', 'Sokoto', 'Katsina', 'Zaria', 'Asaba', 'Onitsha'
];

const OPERATORS = [
  { name: 'GUO Transport', rating: 4.6, reviews: 238, fleet: 'Air-Conditioned' },
  { name: 'ABC Transport', rating: 4.2, reviews: 189, fleet: 'Standard' },
  { name: 'GIG Mobility (GIGM)', rating: 4.8, reviews: 512, fleet: 'Executive' },
  { name: 'Peace Mass Transit', rating: 3.9, reviews: 412, fleet: 'Standard' },
  { name: 'Chisco Transport', rating: 4.4, reviews: 156, fleet: 'Air-Conditioned' },
  { name: 'Young Shall Grow', rating: 4.0, reviews: 320, fleet: 'Standard' },
  { name: 'Cross Country', rating: 4.3, reviews: 112, fleet: 'Air-Conditioned' },
  { name: 'Royal Express', rating: 4.1, reviews: 67, fleet: 'Air-Conditioned' },
  { name: 'Big Joe Motors', rating: 4.2, reviews: 204, fleet: 'Standard' },
  { name: 'Libreville Express', rating: 4.5, reviews: 98, fleet: 'Executive' }
];

export async function seedMajorRoutes() {
  const routesRef = collection(db, 'routes');
  const q = query(routesRef, limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    console.log("Routes already seeded.");
    return;
  }

  console.log("Seeding major Nigerian routes...");
  
  const routesToSeed = [];

  // Generate a variety of routes between major cities
  for (let i = 0; i < NIGERIAN_CITIES.length; i++) {
    for (let j = 0; j < 5; j++) { // Each city has at least 5 outgoing routes
      const from = NIGERIAN_CITIES[i];
      let to = NIGERIAN_CITIES[Math.floor(Math.random() * NIGERIAN_CITIES.length)];
      
      while (to === from) {
        to = NIGERIAN_CITIES[Math.floor(Math.random() * NIGERIAN_CITIES.length)];
      }

      const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
      
      // Base price logic based on "distance" (randomized for now)
      const basePrice = 4000 + Math.floor(Math.random() * 8000);
      
      routesToSeed.push({
        operatorName: operator.name,
        from,
        to,
        price: basePrice,
        departureTime: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        fleetType: operator.fleet,
        rating: operator.rating,
        reviews: operator.reviews,
        lastVerified: serverTimestamp(),
        terminals: [
          `${from} Main Park`,
          `${from} Central Terminal`,
          `${operator.name} ${from} Hub`
        ]
      });
    }
  }

  // Batch seeding (Firestore doesn't have a simple bulk add, so we do it in chunks)
  const chunkSize = 20;
  for (let i = 0; i < routesToSeed.length; i += chunkSize) {
    const chunk = routesToSeed.slice(i, i + chunkSize);
    await Promise.all(chunk.map(route => addDoc(routesRef, route)));
    console.log(`Seeded ${i + chunk.length} routes...`);
  }

  console.log("Seeding complete!");
}
