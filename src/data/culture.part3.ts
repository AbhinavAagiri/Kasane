import type { CultureProfile } from '@/data/culture.types';

export const cultureProfilesThree: CultureProfile[] = [
  {
    destinationSlug: 'reykjavik',
    standfirst:
      'Reykjavík is a small capital on a volcanic island, where the weather is a social subject and the landscape is never fully out of the room.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Lutheran inheritance, lived lightly',
        body: 'Iceland’s national church is Lutheran, and the state still collects a church tax, but attendance is low and the country is one of the most secular in Europe. Older Norse religion survives in literature and in a small modern Ásatrú community, which is a contemporary religious practice rather than a Viking re-enactment. Folk beliefs about hidden people are widespread as cultural stories, not as a single organised faith.',
        note: 'Ask before photographing inside a church. Religious practice here is quiet and private, not a spectacle.',
      },
      {
        theme: 'myth',
        title: 'Elves, trolls and the land',
        body: 'Icelandic folklore is full of huldufólk — hidden people — and trolls turned to stone by daylight. These stories are sometimes described as environmental ethics in narrative form: a way of insisting that a rock or a ridge has a claim on our attention. Surveys show that a significant minority of Icelanders say they believe in hidden people; the stories are alive, but they are not natural history.',
        note: 'Folklore, not fact. The respectful position is curiosity without condescension.',
      },
      {
        theme: 'traditions',
        title: 'Books, pools and the long winter',
        body: 'Icelanders publish and read a remarkable number of books; the Christmas book flood, Jólabókaflóðið, is a real publishing season. Public swimming pools are the social infrastructure of the capital, used year-round, often with a cold plunge. On New Year’s Eve, families gather around bonfires and then set off fireworks in a genuinely civic display of noise.',
        note: 'Icelandic pools require a nude wash before putting on a swimsuit. Follow the signs and local practice.',
      },
      {
        theme: 'food',
        title: 'The sea, the sheep and the greenhouse',
        body: 'Icelandic cooking is shaped by scarcity and proximity: lamb, fish, skyr, rye bread and potatoes. Fermented shark and singed sheep’s head are heritage foods, often eaten as a dare; the everyday table is simpler. Geothermal greenhouses now grow tomatoes and cucumbers, and the capital’s bakeries are excellent. The hot dog stand is a legitimate cultural institution.',
        note: 'Tap water is excellent. Alcohol is expensive and sold in state liquor stores; do not assume a café serves wine.',
      },
      {
        theme: 'arts',
        title: 'A small scene with a long reach',
        body: 'Reykjavík’s music scene — from Björk to a dense network of experimental bands — grew out of small venues, cheap rehearsal space and a willingness to collaborate. Literature is even more central: sagas, crime fiction and poetry are part of the national self-image. Harpa, the glass concert hall on the harbour, is the architectural symbol of the city’s cultural investment.',
        note: 'Check small venues rather than only the big calendar. Tickets are often sold through local sites.',
      },
      {
        theme: 'festival',
        title: 'National Day and the arts festival',
        body: '17 June is Icelandic National Day, marking the republic’s founding in 1944; Reykjavík fills with parades, brass bands and street events. The Reykjavík Arts Festival runs in late May and early June with a programme that leans experimental. Winter brings the darkness and the music festival Iceland Airwaves in November, though dates and format can change.',
        note: 'National Day is free and family-oriented. Check the official programme for times, as the weather can alter plans.',
      },
      {
        theme: 'nature',
        title: 'A landscape that is also a warning',
        body: 'Iceland sits on the Mid-Atlantic Ridge, with active volcanoes, glaciers, geysers and earthquake swarms. The weather changes fast, even in the city; wind can make a car door dangerous and rain can arrive horizontally. The landscape is not a backdrop for adventure selfies. It is a system with its own rules, and the Icelandic search-and-rescue teams are volunteers who are called out too often.',
        note: 'Check vedur.is and safetravel.is before any excursion. Do not walk on glaciers without a guide and proper equipment.',
      },
      {
        theme: 'local',
        title: 'A city built for winter',
        body: 'Reykjavík’s social life moves indoors: cafés, bookshops, pools, bars and living rooms. The city is small enough that people run into one another constantly, which makes a certain discretion valuable. Tourism is now a major industry, and the tension between a tiny population and a huge visitor number is real. The best contribution is to slow down, stay longer in fewer places and respect the ordinary rhythms of the town.',
        note: 'Do not drive off-road; it is illegal and damages fragile moss. Buy Icelandic where you can, and do not treat the country as an empty playground.',
      },
    ],
    etiquette: [
      'Take off shoes in homes and many guesthouses.',
      'Shower nude before entering a public pool; this is not optional.',
      'Never drive off marked roads or stop in the middle of a road for a photo.',
      'Tip only for exceptional service; it is not expected.',
    ],
    stayArea: '101 downtown for walkability, or Grandi harbour for a quieter base',
    arrival:
      'Flybus or a direct airport coach from Keflavík takes about 45 minutes to the city. A rental car is useful only for excursions beyond the capital.',
    gettingAround:
      'The centre is compact and walkable. Buses cover the suburbs; taxis are expensive. For the Ring Road, rent a car with the right insurance and check the weather.',
    sources: [
      { label: 'Visit Reykjavík', url: 'https://www.visitreykjavik.is/' },
      { label: 'Safe Travel Iceland', url: 'https://safetravel.is/' },
    ],
  },
];
