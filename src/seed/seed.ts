import { supabaseAdmin } from '../lib/supabase/server';

// Helper: date N days from now as YYYY-MM-DD
function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const COVER_IMAGES = {
  historicCenter:
    'https://images.unsplash.com/photo-1518659526054-190340b32735?w=1200&q=80',
  bellasArtes:
    'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80',
  coyoacan:
    'https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=1200&q=80',
  custom:
    'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80',
};

const GALLERY = {
  historicCenter: [
    'https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80',
    'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80',
    'https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80',
  ],
  bellasArtes: [
    'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80',
    'https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&q=80',
  ],
  coyoacan: [
    'https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=800&q=80',
    'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80',
  ],
  custom: [
    'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=800&q=80',
  ],
};

const tours = [
  {
    title: 'Historic Center Tour',
    slug: 'historic-center',
    short_description:
      'Walk through centuries of history in the heart of Mexico City — from Aztec ruins to colonial masterpieces.',
    full_description:
      'Immerse yourself in the vibrant soul of Mexico City on this 4.5-hour walking tour through the Historic Center. Begin at the iconic Zócalo, one of the largest public squares in the world, and explore the ruins of Templo Mayor, the sacred heart of the Aztec empire. Marvel at the Diego Rivera murals inside the National Palace, stroll through the stunning Palacio de Correos, and discover hidden courtyards and street art along the way. The tour includes a culinary interlude at a traditional cantina where you will taste authentic Mexican flavors.',
    cover_image: COVER_IMAGES.historicCenter,
    gallery_images: GALLERY.historicCenter,
    area: 'Centro Histórico',
    duration: '4.5 Hours',
    meeting_point: 'Zócalo Plaza',
    language: 'EN / ES',
    type: 'shared',
    base_price: 120,
    price_label: '$120/person',
    capacity_default: 8,
    active: true,
    published: true,
    featured: true,
    highlights: [
      'Templo Mayor archaeological site',
      'Diego Rivera Murals at the National Palace',
      'Palacio de Correos (Postal Palace)',
      'Traditional cantina culinary stop',
      'Hidden courtyards and street art',
    ],
    included_items: [
      'Culinary Interlude at a traditional cantina',
      'Entry Access to Templo Mayor',
      'Private Curator guide',
      'Bottled water',
    ],
    faq_items: [
      {
        question: 'What should I wear?',
        answer:
          'Comfortable walking shoes are essential. We recommend layers as weather can change quickly in the city center.',
      },
      {
        question: 'Is the tour suitable for children?',
        answer:
          'Yes! Children aged 6 and above are welcome. Kids under 12 receive a 50% discount.',
      },
      {
        question: 'What happens if it rains?',
        answer:
          'The tour runs rain or shine. Many stops are indoors, and we provide umbrellas if needed.',
      },
    ],
  },
  {
    title: 'Bellas Artes + Alameda Tour',
    slug: 'bellas-artes-alameda',
    short_description:
      'Discover the artistic jewel of Mexico City — from Art Nouveau grandeur to peaceful park strolls.',
    full_description:
      'Explore the cultural heart of Mexico City on this 3-hour tour centered around the magnificent Palacio de Bellas Artes and the historic Alameda Central park. Admire the breathtaking Art Nouveau and Art Deco architecture of Bellas Artes, home to murals by Siqueiros, Orozco, and Rivera. Stroll through the Alameda, the oldest public park in the Americas, and learn about its transformation from an Aztec marketplace to a colonial promenade. The tour also visits the Museo Mural Diego Rivera and the vibrant surrounding streets.',
    cover_image: COVER_IMAGES.bellasArtes,
    gallery_images: GALLERY.bellasArtes,
    area: 'Bellas Artes / Alameda',
    duration: '3 Hours',
    meeting_point: 'Palacio de Bellas Artes',
    language: 'EN / ES',
    type: 'shared',
    base_price: 85,
    price_label: '$85/person',
    capacity_default: 6,
    active: true,
    published: true,
    featured: true,
    highlights: [
      'Palacio de Bellas Artes interior and murals',
      'Alameda Central park history',
      'Museo Mural Diego Rivera',
      'Art Nouveau and Art Deco architecture',
    ],
    included_items: [
      'Entry Access to Bellas Artes',
      'Professional bilingual guide',
      'Bottled water',
    ],
    faq_items: [
      {
        question: 'Is photography allowed inside Bellas Artes?',
        answer:
          'Photography without flash is allowed in most areas. Tripods are not permitted.',
      },
      {
        question: 'How much walking is involved?',
        answer:
          'The tour covers approximately 2.5 km at a leisurely pace with several stops.',
      },
    ],
  },
  {
    title: 'Coyoacán Tour',
    slug: 'coyoacan',
    short_description:
      'Wander the cobblestone streets of Frida Kahlo\'s beloved neighborhood — art, culture, and local flavors.',
    full_description:
      'Step into the bohemian charm of Coyoacán on this 5-hour private tour through one of Mexico City\'s most beloved neighborhoods. Visit the iconic Casa Azul (Frida Kahlo Museum), explore the lively Jardín Centenario and Mercado de Coyoacán, and discover hidden gems like the Viveros de Coyoacán park. Learn about the neighborhood\'s rich history from pre-Hispanic times through the colonial era to its role as an artistic haven. The tour includes tastings of local street food and traditional sweets.',
    cover_image: COVER_IMAGES.coyoacan,
    gallery_images: GALLERY.coyoacan,
    area: 'Coyoacán',
    duration: '5 Hours',
    meeting_point: 'Jardín Centenario',
    language: 'EN / ES',
    type: 'private',
    base_price: 150,
    price_label: '$150/person',
    capacity_default: 10,
    active: true,
    published: true,
    featured: true,
    highlights: [
      'Casa Azul — Frida Kahlo Museum',
      'Jardín Centenario and Mercado de Coyoacán',
      'Viveros de Coyoacán park',
      'Local street food tastings',
      'Colonial architecture walking route',
    ],
    included_items: [
      'Entry Access to Casa Azul (Frida Kahlo Museum)',
      'Private bilingual guide',
      'Street food tasting stops',
      'Bottled water and traditional sweets',
    ],
    faq_items: [
      {
        question: 'Do I need to book Casa Azul tickets separately?',
        answer:
          'No, entry to Casa Azul is included in the tour price. We handle the reservation for you.',
      },
      {
        question: 'Can the tour be customized?',
        answer:
          'Absolutely! As a private tour, we can adjust the itinerary based on your interests.',
      },
      {
        question: 'Is the tour accessible for people with mobility issues?',
        answer:
          'Most of the route is flat cobblestone. Please let us know in advance and we can adapt the itinerary.',
      },
    ],
  },
  {
    title: 'Custom Private Tour',
    slug: 'custom-private-tour',
    short_description:
      'Design your own Mexico City experience — tell us your interests and we\'ll craft the perfect itinerary.',
    full_description:
      'Create a one-of-a-kind Mexico City experience tailored entirely to your interests, schedule, and group size. Whether you\'re passionate about art, architecture, gastronomy, history, or nightlife, our expert local guides will design a bespoke itinerary just for you. From hidden mezcalerías to private gallery visits, rooftop dining to archaeological deep-dives — the city is yours to explore on your terms.',
    cover_image: COVER_IMAGES.custom,
    gallery_images: GALLERY.custom,
    area: 'CDMX',
    duration: 'Flexible',
    meeting_point: 'To be arranged',
    language: 'EN / ES',
    type: 'custom',
    base_price: 0,
    price_label: 'Quote',
    capacity_default: 1,
    active: true,
    published: true,
    featured: true,
    highlights: [
      'Fully customizable itinerary',
      'Private bilingual guide',
      'Flexible duration and schedule',
      'Access to exclusive venues and experiences',
    ],
    included_items: [
      'Private bilingual guide',
      'Custom itinerary planning',
      'Flexible pickup location',
    ],
    faq_items: [
      {
        question: 'How far in advance should I book?',
        answer:
          'We recommend at least 48 hours notice, but we can sometimes accommodate last-minute requests.',
      },
      {
        question: 'How is pricing determined?',
        answer:
          'Pricing depends on duration, group size, and activities included. We\'ll provide a detailed quote after reviewing your request.',
      },
    ],
  },
];

async function seed() {
  console.log('🌱 Seeding EMO Tours CDMX...\n');

  // Clear existing data (departures first due to FK)
  console.log('Clearing existing data...');
  await supabaseAdmin.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('departures').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('tours').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert tours
  console.log('Inserting tours...');
  const { data: insertedTours, error: toursError } = await supabaseAdmin
    .from('tours')
    .insert(tours)
    .select();

  if (toursError) {
    console.error('❌ Error inserting tours:', toursError);
    process.exit(1);
  }

  console.log(`✅ Inserted ${insertedTours.length} tours\n`);

  // Insert departures for fixed tours (shared & private)
  const fixedTours = insertedTours.filter((t) => t.type !== 'custom');
  const departures: Array<{
    tour_id: string;
    date: string;
    time: string;
    capacity: number;
    spots_left: number;
    active: boolean;
    sold_out: boolean;
    hidden: boolean;
  }> = [];

  for (const tour of fixedTours) {
    const offsets = [7, 14, 21];
    const times = ['09:30', '14:30'];

    for (const offset of offsets) {
      for (const time of times) {
        departures.push({
          tour_id: tour.id,
          date: futureDate(offset),
          time,
          capacity: tour.capacity_default,
          spots_left: tour.capacity_default,
          active: true,
          sold_out: false,
          hidden: false,
        });
      }
    }
  }

  console.log('Inserting departures...');
  const { data: insertedDepartures, error: depsError } = await supabaseAdmin
    .from('departures')
    .insert(departures)
    .select();

  if (depsError) {
    console.error('❌ Error inserting departures:', depsError);
    process.exit(1);
  }

  console.log(`✅ Inserted ${insertedDepartures.length} departures\n`);

  // Summary
  console.log('📋 Seed Summary:');
  for (const tour of insertedTours) {
    const tourDeps = insertedDepartures.filter((d) => d.tour_id === tour.id);
    console.log(`  • ${tour.title} (${tour.type}) — ${tourDeps.length} departures`);
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
