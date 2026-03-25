import { config } from 'dotenv';
config({ path: '.env.local' });
import { supabaseAdmin } from '../lib/supabase/server';

// Helper: next occurrence of a given weekday (0=Sun, 1=Mon, ..., 6=Sat)
function nextWeekday(weekday: number, weeksAhead = 0): string {
  const today = new Date();
  const todayDay = today.getDay();
  let daysUntil = (weekday - todayDay + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // always future
  daysUntil += weeksAhead * 7;
  const d = new Date(today);
  d.setDate(today.getDate() + daysUntil);
  return d.toISOString().split('T')[0];
}

const IMG = {
  historicCenter: 'https://images.unsplash.com/photo-1518659526054-190340b32735?w=1200&q=80',
  romaCondesa:    'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80',
  reforma:        'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80',
  coyoacan:       'https://images.unsplash.com/photo-1568736333610-eae6e0ab0f68?w=1200&q=80',
  chapultepec:    'https://images.unsplash.com/photo-1570737543098-0c32dc185b5c?w=1200&q=80',
  teotihuacan:    'https://images.unsplash.com/photo-1518659526054-190340b32735?w=1200&q=80',
  polanco:        'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80',
  custom:         'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?w=1200&q=80',
};

// weekday: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const tours = [
  {
    title: 'Historic Center Tour',
    slug: 'historic-center',
    short_description: 'Walk through centuries of history — from Aztec ruins to colonial masterpieces in the heart of CDMX.',
    full_description: 'Immerse yourself in the vibrant soul of Mexico City on this 4-hour walking tour through the Historic Center. Begin at the iconic Zócalo, explore the ruins of Templo Mayor, marvel at Diego Rivera murals inside the National Palace, and discover hidden courtyards and street art along the way.',
    cover_image: IMG.historicCenter,
    gallery_images: [IMG.historicCenter, IMG.romaCondesa],
    area: 'Centro Histórico',
    duration: '4 Hours',
    meeting_point: 'Zócalo Plaza, Metro Zócalo Exit',
    language: 'EN / ES',
    type: 'shared',
    base_price: 20,
    price_label: '$20 / person',
    capacity_default: 12,
    active: true, published: true, featured: true,
    weekday: 2, // Tuesday
    departure_time: '10:00',
    highlights: ['Templo Mayor archaeological site', 'Diego Rivera Murals at the National Palace', 'Palacio de Correos', 'Hidden colonial courtyards'],
    included_items: ['Professional bilingual guide', 'Bottled water'],
    faq_items: [{ question: 'What should I wear?', answer: 'Comfortable walking shoes. Layers recommended.' }, { question: 'What happens if it rains?', answer: 'The tour runs rain or shine. Many stops are indoors.' }],
  },
  {
    title: 'Roma + Condesa Tour',
    slug: 'roma-condesa',
    short_description: 'Explore the art deco streets, leafy parks, and vibrant café culture of Roma and Condesa.',
    full_description: 'Discover two of Mexico City\'s most beloved neighborhoods on this 3.5-hour walking tour. Stroll through tree-lined streets, admire Art Deco architecture, visit Parque México, and explore the independent galleries, bookshops, and coffee culture that define this creative district.',
    cover_image: IMG.romaCondesa,
    gallery_images: [IMG.romaCondesa, IMG.reforma],
    area: 'Roma / Condesa',
    duration: '3.5 Hours',
    meeting_point: 'Parque México, Condesa',
    language: 'EN / ES',
    type: 'shared',
    base_price: 20,
    price_label: '$20 / person',
    capacity_default: 12,
    active: true, published: true, featured: true,
    weekday: 3, // Wednesday
    departure_time: '10:00',
    highlights: ['Art Deco architecture', 'Parque México', 'Independent galleries and bookshops', 'Local café culture'],
    included_items: ['Professional bilingual guide', 'Bottled water'],
    faq_items: [{ question: 'Is this tour walkable?', answer: 'Yes, approximately 3 km at a relaxed pace with stops.' }],
  },
  {
    title: 'Reforma + Colonia Juárez Tour',
    slug: 'reforma-juarez',
    short_description: 'Walk the grand boulevard of Reforma and discover the hidden gems of Colonia Juárez.',
    full_description: 'This 3.5-hour tour takes you along Paseo de la Reforma — Mexico City\'s most iconic boulevard — and into the elegant streets of Colonia Juárez. Discover monuments, embassies, and the neighborhood\'s rich history as a hub of culture and nightlife.',
    cover_image: IMG.reforma,
    gallery_images: [IMG.reforma, IMG.historicCenter],
    area: 'Reforma / Colonia Juárez',
    duration: '3.5 Hours',
    meeting_point: 'Ángel de la Independencia, Paseo de la Reforma',
    language: 'EN / ES',
    type: 'shared',
    base_price: 20,
    price_label: '$20 / person',
    capacity_default: 12,
    active: true, published: true, featured: false,
    weekday: 4, // Thursday
    departure_time: '10:00',
    highlights: ['Paseo de la Reforma boulevard', 'Ángel de la Independencia monument', 'Colonia Juárez architecture', 'Cultural landmarks'],
    included_items: ['Professional bilingual guide', 'Bottled water'],
    faq_items: [{ question: 'How much walking is involved?', answer: 'Approximately 3 km at a relaxed pace.' }],
  },
  {
    title: 'Coyoacán Tour',
    slug: 'coyoacan',
    short_description: 'Wander the cobblestone streets of Frida Kahlo\'s beloved neighborhood — art, culture, and local flavors.',
    full_description: 'Step into the bohemian charm of Coyoacán on this 4-hour tour. Visit the iconic Casa Azul (Frida Kahlo Museum), explore the lively Jardín Centenario and Mercado de Coyoacán, and discover hidden gems. The tour includes tastings of local street food and traditional sweets.',
    cover_image: IMG.coyoacan,
    gallery_images: [IMG.coyoacan, IMG.romaCondesa],
    area: 'Coyoacán',
    duration: '4 Hours',
    meeting_point: 'Jardín Centenario, Coyoacán',
    language: 'EN / ES',
    type: 'shared',
    base_price: 20,
    price_label: '$20 / person',
    capacity_default: 12,
    active: true, published: true, featured: true,
    weekday: 5, // Friday
    departure_time: '10:00',
    highlights: ['Casa Azul — Frida Kahlo Museum', 'Jardín Centenario', 'Mercado de Coyoacán', 'Local street food tastings'],
    included_items: ['Professional bilingual guide', 'Bottled water', 'Street food tasting stop'],
    faq_items: [{ question: 'Is Casa Azul entry included?', answer: 'Entry to Casa Azul is not included but we guide you through the process. Tickets are ~$4 USD.' }],
  },
  {
    title: 'Chapultepec: Forest, Castle & Anthropology Museum',
    slug: 'chapultepec',
    short_description: 'Explore the ancient forest, the hilltop castle, and one of the world\'s greatest museums in one day.',
    full_description: 'This 5-hour tour covers the full Chapultepec experience: the ancient forest, the iconic castle with panoramic city views, and the world-renowned National Museum of Anthropology. A deep dive into Mexican history from pre-Hispanic civilizations to the modern era.',
    cover_image: IMG.chapultepec,
    gallery_images: [IMG.chapultepec, IMG.reforma],
    area: 'Chapultepec',
    duration: '5 Hours',
    meeting_point: 'Chapultepec Forest Main Entrance, Metro Chapultepec',
    language: 'EN / ES',
    type: 'shared',
    base_price: 50,
    price_label: '$50 / person',
    capacity_default: 12,
    active: true, published: true, featured: true,
    weekday: 6, // Saturday
    departure_time: '10:00',
    highlights: ['Chapultepec Castle with panoramic views', 'National Museum of Anthropology', 'Ancient forest walk', 'Aztec Sun Stone and Aztec artifacts'],
    included_items: ['Professional bilingual guide', 'Museum entry fees', 'Castle entry fee', 'Bottled water'],
    faq_items: [{ question: 'Is the museum entry included?', answer: 'Yes, entry to both the castle and the Anthropology Museum is included.' }, { question: 'How much walking is involved?', answer: 'This is a full 5-hour experience with significant walking. Comfortable shoes are essential.' }],
  },
  {
    title: 'Teotihuacán Tour',
    slug: 'teotihuacan',
    short_description: 'Rise early and climb the Pyramids of the Sun and Moon before the crowds arrive.',
    full_description: 'An early morning journey to the ancient city of Teotihuacán, one of the most significant archaeological sites in the Americas. Climb the Pyramid of the Sun and the Pyramid of the Moon, walk the Avenue of the Dead, and explore the Temple of Quetzalcóatl. We depart early to experience the site at its most magical — quiet, golden, and alive.',
    cover_image: IMG.teotihuacan,
    gallery_images: [IMG.teotihuacan, IMG.historicCenter],
    area: 'Teotihuacán',
    duration: '6 Hours',
    meeting_point: 'Metro Autobuses del Norte, Platform 8',
    language: 'EN / ES',
    type: 'shared',
    base_price: 100,
    price_label: '$100 / person',
    capacity_default: 12,
    active: true, published: true, featured: true,
    weekday: 0, // Sunday
    departure_time: '08:00',
    highlights: ['Pyramid of the Sun', 'Pyramid of the Moon', 'Avenue of the Dead', 'Temple of Quetzalcóatl', 'Early morning golden light'],
    included_items: ['Professional bilingual guide', 'Round-trip transportation', 'Site entry fees', 'Bottled water'],
    faq_items: [{ question: 'Why do we depart at 8:00 AM?', answer: 'Early arrival means fewer crowds and the best light for photography. The site gets very busy after 11 AM.' }, { question: 'Is transportation included?', answer: 'Yes, round-trip transportation from the meeting point is included.' }],
  },
  {
    title: 'Polanco Tour',
    slug: 'polanco',
    short_description: 'A private exploration of Mexico City\'s most elegant neighborhood — architecture, art, and gastronomy.',
    full_description: 'Polanco is Mexico City\'s most sophisticated neighborhood — home to world-class restaurants, luxury boutiques, and important cultural institutions. This private tour is tailored to your interests: architecture, contemporary art, gastronomy, or all three. Available by request only.',
    cover_image: IMG.polanco,
    gallery_images: [IMG.polanco, IMG.reforma],
    area: 'Polanco',
    duration: 'Flexible',
    meeting_point: 'To be arranged',
    language: 'EN / ES',
    type: 'private',
    base_price: 0,
    price_label: 'Pricing upon request',
    capacity_default: 8,
    active: true, published: true, featured: false,
    weekday: null, // private / request only
    departure_time: null,
    highlights: ['World-class architecture', 'Contemporary art galleries', 'Luxury gastronomy', 'Soumaya Museum'],
    included_items: ['Private bilingual guide', 'Custom itinerary', 'Flexible schedule'],
    faq_items: [{ question: 'How do I book?', answer: 'Submit a request through our Custom Tours page and we\'ll get back to you within 24 hours.' }],
  },
  {
    title: 'Custom Private Tour',
    slug: 'custom-private-tour',
    short_description: 'Design your own Mexico City experience — tell us your interests and we\'ll craft the perfect itinerary.',
    full_description: 'Create a one-of-a-kind Mexico City experience tailored entirely to your interests, schedule, and group size. Whether you\'re passionate about art, architecture, gastronomy, history, or nightlife — we design a bespoke route just for you.',
    cover_image: IMG.custom,
    gallery_images: [IMG.custom],
    area: 'CDMX',
    duration: 'Flexible',
    meeting_point: 'To be arranged',
    language: 'EN / ES',
    type: 'custom',
    base_price: 0,
    price_label: 'Pricing upon request',
    capacity_default: 1,
    active: true, published: true, featured: true,
    weekday: null,
    departure_time: null,
    highlights: ['Fully customizable itinerary', 'Private bilingual guide', 'Flexible duration and schedule'],
    included_items: ['Private bilingual guide', 'Custom itinerary planning'],
    faq_items: [{ question: 'How far in advance should I book?', answer: 'We recommend at least 48 hours notice.' }, { question: 'How is pricing determined?', answer: 'Pricing depends on duration, group size, and activities. We\'ll provide a quote after reviewing your request.' }],
  },
];

// Generate next 8 occurrences of a given weekday
function nextOccurrences(weekday: number, count = 8): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    dates.push(nextWeekday(weekday, i));
  }
  return dates;
}

async function seed() {
  console.log('🌱 Seeding EMO Tours CDMX (weekly schedule model)...\n');

  console.log('Clearing existing data...');
  await supabaseAdmin.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('departures').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabaseAdmin.from('tours').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Strip weekday/departure_time before inserting (not DB columns)
  const toursForDB = tours.map(({ weekday: _w, departure_time: _dt, ...rest }) => rest);

  console.log('Inserting tours...');
  const { data: insertedTours, error: toursError } = await supabaseAdmin
    .from('tours')
    .insert(toursForDB)
    .select();

  if (toursError) {
    console.error('❌ Error inserting tours:', toursError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${insertedTours.length} tours\n`);

  // Build departures for fixed public tours (shared type with a weekday)
  const departures: Array<{
    tour_id: string; date: string; time: string;
    capacity: number; spots_left: number;
    active: boolean; sold_out: boolean; hidden: boolean;
  }> = [];

  for (const tour of insertedTours) {
    const tourDef = tours.find(t => t.slug === tour.slug);
    if (!tourDef || tourDef.weekday === null || tourDef.departure_time === null) continue;

    const dates = nextOccurrences(tourDef.weekday, 8);
    for (const date of dates) {
      departures.push({
        tour_id: tour.id,
        date,
        time: tourDef.departure_time,
        capacity: tour.capacity_default,
        spots_left: tour.capacity_default,
        active: true,
        sold_out: false,
        hidden: false,
      });
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

  console.log('📋 Seed Summary:');
  for (const tour of insertedTours) {
    const tourDef = tours.find(t => t.slug === tour.slug);
    const tourDeps = insertedDepartures.filter((d) => d.tour_id === tour.id);
    const schedule = tourDef?.weekday !== null
      ? `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][tourDef!.weekday!]} @ ${tourDef!.departure_time}`
      : 'request only';
    console.log(`  • ${tour.title} — ${schedule} — ${tourDeps.length} departures — $${tour.base_price || 'request'}`);
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});
