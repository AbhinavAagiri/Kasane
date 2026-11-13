import type { CultureProfile } from '@/data/culture.types';

export const cultureProfilesFour: CultureProfile[] = [
  {
    destinationSlug: 'marrakech',
    standfirst:
      'Marrakech is a Muslim city with Amazigh roots, a Jewish past and a commercial present. Its culture is not confined to the medina’s monuments; it is in the courtyard, the hammam, the workshop and the evening square.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'A city of faiths and neighbourhoods',
        body: 'Marrakech is predominantly Sunni Muslim, with a long Amazigh (Berber) presence and a Jewish community that once lived in the mellah. The call to prayer structures the day, Ramadan changes the rhythm of the streets, and shrines and mosques remain places of devotion rather than visitor attractions. The city’s Jewish heritage is part of its history, not a decorative layer; the mellah and its synagogue sites are best visited with local context.',
        note: 'Non-Muslims may not enter most mosques in Morocco. Ask before photographing worshippers, and dress modestly in religious areas.',
      },
      {
        theme: 'traditions',
        title: 'Hospitality, tea and the hammam',
        body: 'Mint tea is offered as a sign of welcome, often poured from a height to aerate it. The hammam is a social and bodily ritual, with steam rooms, black soap and kessa gloves; public baths and spa versions are different experiences. Friday is the main day of communal prayer, and many shops close or shorten hours. Bargaining in the souks is a performance of relationship as much as price — stay courteous, and walk away if it stops being enjoyable.',
        note: 'Use your right hand for food and greetings. Ask before photographing people, interiors or a craftsman at work.',
      },
      {
        theme: 'food',
        title: 'Slow cooking, shared bread',
        body: 'Moroccan food is built for hospitality: bread, olives, salads, tagines, couscous and fruit. The Friday couscous is a communal meal; harira is a Ramadan staple; msemen and baghrir are breakfast breads. Spices are layered rather than hot, and preserved lemon, saffron, cumin and coriander do much of the work. In Marrakech, the best meals are often in a riad courtyard or a neighbourhood restaurant rather than on the main square.',
        note: 'Tap water is not for visitors. Vegetarian food is common, but ask about stock and cooking fat.',
      },
      {
        theme: 'arts',
        title: 'The geometry of the interior',
        body: 'Zellige tilework, carved cedar, tadelakt plaster and stucco are not ornament added to a building; they are the building’s surface logic. The medina’s crafts — leather, metal, textiles, lanterns, wood — still support working workshops, though many goods are now made for export and tourism. Gnawa music, with its guembri and iron castanets, has roots in sub-Saharan African spiritual traditions and is performed both ritually and in concert.',
        note: 'A workshop visit should be arranged directly. Buy something small rather than treating a craftsperson as a photo opportunity.',
      },
      {
        theme: 'nature',
        title: 'Water in a dry city',
        body: 'Marrakech sits on a plain between the High Atlas and the Atlantic. Its gardens, courtyards and hammams are responses to heat and water scarcity; the Menara’s olive groves and the Majorelle garden are different versions of the same argument. Drought and groundwater depletion are serious pressures. The Atlas valleys are beautiful and fragile; travel with a licensed guide, respect village privacy and do not walk through irrigated fields.',
        note: 'Summer heat can be dangerous. Carry water, avoid midday exposure and dress for sun rather than only for photographs.',
      },
    ],
    etiquette: [
      'Dress modestly in the medina and at religious sites; cover shoulders and knees.',
      'Ask before photographing people, especially women and worshippers.',
      'Do not enter a mosque unless it is explicitly open to non-Muslim visitors.',
      'Bargain politely in souks; fixed-price cooperatives are different.',
    ],
    stayArea: 'A riad in the medina for atmosphere, or Gueliz for easier parking and a more contemporary city rhythm',
    arrival:
      'Marrakech Menara Airport is a short taxi ride from the centre. Agree the fare or use an official taxi rank; the medina is best entered on foot.',
    gettingAround:
      'Walk the medina in daylight, use a local guide for the first orientation, and take taxis for longer hops. A car is useful only for the Atlas and surrounding valleys.',
    sources: [
      { label: 'UNESCO — Medina of Marrakesh', url: 'https://whc.unesco.org/en/list/331/' },
      { label: 'Visit Morocco', url: 'https://www.visitmorocco.com/en' },
    ],
  },
  {
    destinationSlug: 'istanbul',
    standfirst:
      'Istanbul’s culture is built on encounter: Greek, Roman, Byzantine, Ottoman, Turkish and migrant histories have all left their grammar in the same streets. The city is secular in law and intensely layered in practice.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'A secular state, a religious city',
        body: 'Türkiye is a secular republic with a majority Sunni Muslim population, alongside Alevi, Orthodox Christian, Armenian, Jewish and other communities. Istanbul’s skyline is dominated by mosques, but its religious landscape is plural and contested. Hagia Sophia’s changing status — church, mosque, museum and mosque again in 2020 — is a reminder that heritage and faith are political as well as spiritual. Visitors should follow current access rules and dress codes rather than assume.',
        note: 'Do not photograph people at prayer without permission. Avoid visiting during Friday prayer if you are not worshipping.',
      },
      {
        theme: 'traditions',
        title: 'Tea, coffee and the long visit',
        body: 'Tea arrives in tulip glasses; Turkish coffee is served with water and lokum. Hospitality is expansive, and a visit can include several rounds of tea before business. Hammams remain social institutions as well as bathing spaces. Bayram (Eid) brings family visits and sweets; Ramadan changes restaurant hours and evening life. Remove shoes when entering a home or mosque, and follow the lead of your host.',
        note: 'Do not rush a greeting or a glass of tea. Ask before taking a portrait in a bazaar or a residential street.',
      },
      {
        theme: 'food',
        title: 'A cuisine of many kitchens',
        body: 'Istanbul’s food is not one tradition. Ottoman palace cooking, Anatolian home cooking, Aegean olive-oil dishes, Black Sea fish, Kurdish and Armenian kitchens, and modern restaurant culture all meet here. Breakfast can be a spread of cheese, olives, eggs, bread and tea; meze is a social format, not a starter list. Fish is best near the water, and neighbourhood lokantas often outperform the famous tourist restaurants.',
        note: 'Ask about alcohol if it matters to you; many restaurants serve it, but not all. Tap water is generally treated, but bottled water is common.',
      },
      {
        theme: 'arts',
        title: 'Mosaic, calligraphy and the contemporary',
        body: 'Byzantine mosaics, Ottoman tilework, calligraphy and miniature painting are part of the city’s visual grammar. The Grand Bazaar and the arts of the book are commercial and devotional at once. Contemporary Istanbul has galleries, private museums, festivals and a strong photography and film scene, often engaged with politics, migration and memory. The city’s cultural institutions are concentrated in Beyoğlu, Karaköy and the Asian side as well as the historic peninsula.',
        note: 'Museum and gallery opening hours change; check before travelling across the city for a single exhibition.',
      },
      {
        theme: 'nature',
        title: 'The strait as a way of life',
        body: 'The Bosphorus connects the Black Sea to the Sea of Marmara and divides Europe from Asia. It is a shipping lane, a ferry route and a public space; its currents and weather are serious. Istanbul’s climate is Mediterranean with continental and Black Sea influences, and the city is exposed to earthquakes. Parks, the Princes’ Islands and the Belgrade Forest offer breathing room, but the water remains the city’s defining geography.',
        note: 'Use licensed ferries and check sea conditions. Do not swim in the shipping lanes.',
      },
    ],
    etiquette: [
      'Remove shoes in mosques and homes; dress modestly at religious sites.',
      'Ask before photographing worshippers, shopkeepers or children.',
      'Do not assume everyone speaks English or identifies as Turkish before Kurdish or other identities.',
      'Stand for the national anthem if it is played at a public event.',
    ],
    stayArea: 'Beyoğlu for walkability and nightlife, or the historic peninsula for monuments and ferries',
    arrival:
      'Istanbul Airport is connected by metro and shuttle; Sabiha Gökçen serves the Asian side. Allow plenty of time for traffic and security.',
    gettingAround:
      'Use the metro, tram and public ferries; they are faster and more legible than taxis. Walk neighbourhoods rather than trying to cross the whole city on foot.',
    sources: [
      { label: 'UNESCO — Historic Areas of Istanbul', url: 'https://whc.unesco.org/en/list/356/' },
      { label: 'Go Türkiye — Istanbul', url: 'https://istanbul.goturkiye.com/' },
    ],
  },
  {
    destinationSlug: 'hanoi',
    standfirst:
      'Hanoi’s culture is a conversation between ancestor veneration, Confucian learning, Buddhist practice, socialist history and a fast-moving contemporary city. Much of it happens on the pavement.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Ancestors, temples and the state',
        body: 'Many Vietnamese households keep an ancestor altar and observe death anniversaries; Mahayana Buddhism, Confucianism and local spirit beliefs overlap in temples and family practice. Catholicism has a long presence in Hanoi, and the state maintains a secular socialist framework. The Temple of Literature honours Confucian learning; Ngọc Sơn Temple on Hoan Kiem Lake is a living shrine. These are not interchangeable “attractions”; each has its own protocol.',
        note: 'Ask before photographing altars or worshippers. Do not touch offerings or leave incense unattended.',
      },
      {
        theme: 'traditions',
        title: 'Tết and the family calendar',
        body: 'Tết, the lunar new year, is the central family festival: homes are cleaned, ancestor altars are prepared, and travel peaks as people return to their home provinces. Mid-Autumn is a children’s festival with lanterns and mooncakes. The full-moon and first-day observances bring people to temples. Everyday etiquette includes using both hands for gifts and receiving, and respecting elders in speech and seating.',
        note: 'Tết is a family time; many businesses close and transport is fully booked. Avoid treating the holiday as a tourist spectacle.',
      },
      {
        theme: 'food',
        title: 'One dish, one stall',
        body: 'Hanoi’s food culture is specialist: a stall may sell only phở, only bún chả, or only bánh cuốn. Breakfast is a serious meal; coffee is strong, often with condensed milk or egg. Herbs, fish sauce, lime and chilli are adjusted at the table. Street food is generally safe where turnover is high, but drink bottled or filtered water and be cautious with raw vegetables if you are sensitive. Vegetarian and vegan food exists, but fish sauce and meat stock are common.',
        note: 'Do not eat or drink noisily on a residential lane if locals are not; follow the pace of the stall.',
      },
      {
        theme: 'arts',
        title: 'Lacquer, puppets and the contemporary',
        body: 'Vietnamese lacquer is a serious craft, built from layer upon layer of resin, pigment and polishing. Water puppetry originated in the Red River Delta and is performed in a pool with wooden figures and live music; the stories are folk and village narratives. Contemporary Hanoi has a growing gallery scene, independent cinema, fashion and design. The city’s older craft streets still cluster by trade, even when the goods have changed.',
        note: 'Buy from galleries and cooperatives that credit artists; avoid objects made from endangered materials.',
      },
      {
        theme: 'nature',
        title: 'The Red River and the lakes',
        body: 'Hanoi is a delta city, built on low ground beside the Red River. Its lakes moderate the heat and provide public space; West Lake is larger and quieter, Hoan Kiem is central and social. The monsoon brings heavy rain and flooding, and summer heat is intense. The city is also sinking as groundwater is extracted, while upstream dams change the river’s flow. The landscape is not separate from the city’s politics.',
        note: 'Cross roads steadily and predictably; motorbikes flow around pedestrians rather than stopping.',
      },
    ],
    etiquette: [
      'Use both hands to give and receive gifts or business cards.',
      'Ask before photographing people, altars or a food stall’s customers.',
      'Dress modestly at temples; cover shoulders and knees.',
      'Do not discuss the war casually or assume a single political view.',
    ],
    stayArea: 'Hoan Kiem for the lake and old quarter, or Tay Ho for a quieter expatriate and lakeside rhythm',
    arrival:
      'Noi Bai International Airport is about 45–60 minutes from the centre by taxi or shuttle, depending on traffic. Agree the fare or use a licensed ride app.',
    gettingAround:
      'Walk the old quarter and lake, use ride-hailing for longer trips, and take a Grab or taxi rather than driving yourself. Cross streets at a steady pace.',
    sources: [
      { label: 'UNESCO — Imperial Citadel of Thăng Long', url: 'https://whc.unesco.org/en/list/1328/' },
      { label: 'Vietnam Tourism', url: 'https://vietnam.travel/' },
    ],
  },
  {
    destinationSlug: 'bangkok',
    standfirst:
      'Bangkok is a Theravada Buddhist city, a constitutional monarchy and a global metropolis. Its culture is not a set of temple postcards; it is a negotiation between merit, commerce, power and everyday life.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Merit, monarchy and the wat',
        body: 'Theravada Buddhism shapes Thai public life: monks receive alms, temples host festivals and cremations, and making merit is a daily practice. The monarchy is constitutionally protected and deeply symbolic; treat images of the king and the royal family with respect. Spirit houses stand outside many buildings, and amulets are worn for protection and luck. These practices are living religion, not folklore for visitors.',
        note: 'Never climb on a Buddha image, turn your back to one for a photo, or touch a monk. Women should not hand objects directly to monks.',
      },
      {
        theme: 'traditions',
        title: 'The calendar of the city',
        body: 'Songkran in April marks the Thai new year with water blessings and, in the city, a mass water fight; Loy Krathong in the cool season involves floating offerings on water. Temple fairs, ordinations and royal ceremonies punctuate the year. Everyday etiquette includes the wai greeting, removing shoes in temples and homes, and avoiding touch on the head. The monarchy, religion and national identity are closely entwined; humour about them is not universally welcome.',
        note: 'Dress modestly at temples: cover shoulders, knees and midriffs. Follow posted photography rules.',
      },
      {
        theme: 'food',
        title: 'A capital of regional kitchens',
        body: 'Bangkok’s food brings central Thai cooking together with Isan, southern, Chinese-Thai and Muslim traditions. Street stalls specialise; markets are organised by ingredient and time of day. Fish sauce, chilli, lime, palm sugar and herbs are balanced rather than simply hot. Yaowarat’s Chinese-Thai stalls and Bang Rak’s old shophouses are good entry points. Hygiene is generally best where turnover is high, but raw seafood and ice outside tourist areas deserve caution.',
        note: 'Ask for less chilli rather than assuming you can handle it. Do not photograph a stall’s customers without permission.',
      },
      {
        theme: 'arts',
        title: 'Murals, masks and modernism',
        body: 'Thai temple murals narrate the Ramakien and Buddhist cosmology; khon dance drama performs the same stories with masks and stylised movement. Lacquer, gold leaf, silk and nielloware are court and craft traditions. Bangkok’s contemporary art scene includes private museums, university galleries and experimental spaces, often exploring politics, gender and urban change. The city’s design culture is visible in its cafés, hotels and advertising as well as its galleries.',
        note: 'Check whether photography is allowed in galleries and performances; flash can damage works.',
      },
      {
        theme: 'nature',
        title: 'A city built on water',
        body: 'Bangkok began as a canal city on the Chao Phraya. Many khlongs have been filled in, but the river still carries commuters and goods, and the remaining canals support communities and temples. The monsoon brings flooding; the city is sinking as groundwater is pumped, and sea-level rise is a long-term threat. Parks and the riverfront are essential public spaces. The tropical heat is real; plan outdoor time for early morning and evening.',
        note: 'Do not swim in canals or the river. Use public ferries and cross-river boats rather than improvised tours.',
      },
    ],
    etiquette: [
      'Return a wai greeting, but do not wai children or service staff first.',
      'Remove shoes before entering temples and homes; dress modestly at religious sites.',
      'Do not touch people’s heads or point your feet at people or Buddha images.',
      'Treat the monarchy and religious images with respect; do not mock them in public.',
    ],
    stayArea: 'Rattanakosin for monuments, or Sukhumvit/Sathorn for transport and contemporary city life',
    arrival:
      'Suvarnabhumi and Don Mueang airports are connected by rail, bus and taxi. The airport rail link is the most predictable option at peak times.',
    gettingAround:
      'Use the BTS Skytrain, MRT and public boats; they avoid the worst traffic. Taxis are metered — insist on the meter or use a ride app.',
    sources: [
      { label: 'Tourism Authority of Thailand', url: 'https://www.tourismthailand.org/' },
      { label: 'Bangkok Metropolitan Administration', url: 'https://www.bangkok.go.th/' },
    ],
  },
  {
    destinationSlug: 'ubud',
    standfirst:
      'Ubud is a Balinese town, not a generic island resort. Its culture is grounded in Balinese Hinduism, irrigated rice, temple ritual and a working arts economy — all now under intense tourism pressure.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Balinese Hinduism',
        body: 'Balinese Hinduism differs from Indian Hinduism in its rituals, temple organisation and emphasis on local spirits and ancestors. Tri Hita Karana — balance among people, nature and the divine — is a guiding philosophy. Every compound has a family shrine; temples belong to villages, descent groups or water societies. Offerings are placed daily, and ceremonies can close a street or a temple without notice. Visitors are often welcome, but never automatically.',
        note: 'Wear a sarong and sash at temples. Do not step over offerings, point with your feet, or stand above a priest.',
      },
      {
        theme: 'traditions',
        title: 'Offerings, cremation and the subak',
        body: 'Galungan and Kuningan mark the victory of dharma over adharma; Ngaben is a cremation ritual that releases the soul; full-moon temple festivals draw whole villages. The subak irrigation system is a religious and social institution as well as an engineering one, organised around water temples. Ubud’s palace still sponsors dance and ceremony. These are not performances on a schedule for tourists, though shortened versions are staged for visitors.',
        note: 'Ask before entering a temple courtyard during a ceremony. Menstruating women are traditionally expected to avoid some temple areas; follow local guidance.',
      },
      {
        theme: 'food',
        title: 'Rice, pork and the market',
        body: 'Balinese cooking uses rice, coconut, shallot, garlic, chilli, turmeric, ginger and fermented shrimp paste. Babi guling (suckling pig), bebek betutu (slow-cooked duck) and lawar are ceremonial and everyday foods. Because most Balinese are Hindu, pork is common; Muslim and vegetarian visitors need to ask. The morning market is the best place to read the local pantry, and warungs are often better than resort restaurants.',
        note: 'Ask about pork, shrimp paste and coconut if you have dietary restrictions. Tap water is not for drinking.',
      },
      {
        theme: 'arts',
        title: 'A working arts economy',
        body: 'Ubud’s painting and carving traditions were reshaped in the twentieth century by local artists, royal patronage and foreign buyers. Today, workshops produce ritual objects, furniture, silver and textiles for export as well as for temples. Dance and gamelan are taught in village groups; the Legong and Barong performed for visitors are excerpts from longer ritual forms. Buying directly from artists and paying properly is a better relationship than photographing a workshop for free.',
        note: 'Do not handle ritual objects without permission. Ask before filming a performance or a ceremony.',
      },
      {
        theme: 'nature',
        title: 'Terraces, water and pressure',
        body: 'The rice terraces around Ubud are the visible expression of the subak system: water is shared from springs through temples and channels to fields. The landscape also includes the Ayung River, forest patches and volcanic slopes. Tourism has increased water demand, traffic and land conversion; some terraces are kept for scenery rather than harvest. Walk on paths, do not enter planted fields, and avoid attractions that treat rice farmers as props.',
        note: 'Carry out plastic waste, avoid single-use bottles where possible and use reef-safe products if swimming.',
      },
    ],
    etiquette: [
      'Wear a sarong and sash at temples; cover shoulders and knees.',
      'Do not step over offerings or touch a priest’s ritual objects.',
      'Ask before photographing ceremonies, dancers or villagers.',
      'Do not enter rice fields or climb terrace walls; stay on marked paths.',
    ],
    stayArea: 'Central Ubud for walkability, or a village guesthouse outside the centre for a quieter, more local rhythm',
    arrival:
      'Ngurah Rai International Airport is about 1.5–2 hours from Ubud by car, depending on traffic. A pre-booked transfer is simpler than negotiating at the airport.',
    gettingAround:
      'Walk the centre, use a scooter only if licensed and experienced, or hire a driver for the day. Ride-hailing is restricted in some village areas.',
    sources: [
      { label: 'UNESCO — Cultural Landscape of Bali', url: 'https://whc.unesco.org/en/list/1194/' },
      { label: 'Indonesia Travel', url: 'https://www.indonesia.travel/' },
    ],
  },
  {
    destinationSlug: 'mexico-city',
    standfirst:
      'Mexico City’s culture is a braid of indigenous and Catholic practice, revolutionary public art, market life and a contemporary scene that is never only one thing.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Guadalupe, the Virgin and the older city',
        body: 'Catholicism is central to Mexican public life, but it is not separate from indigenous cosmology. The Virgin of Guadalupe is a national symbol with a basilica and a pilgrimage tradition; Day of the Dead combines Catholic All Souls with indigenous remembrance. Many households keep altars, and saints are invoked for specific needs. The country is constitutionally secular, and Mexico City is one of Latin America’s most secular capitals, but religious practice remains visible and varied.',
        note: 'Do not treat Day of the Dead as “Mexican Halloween”. It is a family and community observance; ask before photographing altars.',
      },
      {
        theme: 'traditions',
        title: 'The street as a social form',
        body: 'Mexico City lives outdoors: markets, street vendors, food stalls, organ grinders, protest marches and quinceañera processions share the pavement. Posadas re-enact Mary and Joseph’s search for shelter before Christmas; comparsas and dances mark neighbourhood festivals. Tipping is customary for service, and a friendly greeting when entering a shop is expected. The city’s social warmth coexists with inequality and a constant negotiation over public space.',
        note: 'Say “buenos días” or “buenas tardes” when entering a small shop or waiting room. Ask before photographing people.',
      },
      {
        theme: 'food',
        title: 'A capital of regional cooking',
        body: 'Mexico City’s food is regional Mexico compressed into one place: tacos al pastor, tamales, tortas, mole, pozole, seafood, Yucatecan and Oaxacan kitchens, and endless market antojitos. Corn, beans, chilli and squash are the foundation; colonial and migrant influences are part of the story. Markets are the best places to eat and learn. Street food is generally safe where turnover is high; tap water is not for visitors.',
        note: 'Ask about spice and meat stock. Vegetarian options exist but are not universal; “sin carne” does not always mean no animal fat.',
      },
      {
        theme: 'arts',
        title: 'Muralism and after',
        body: 'Diego Rivera, José Clemente Orozco and David Alfaro Siqueiros made the mural a public argument about nationhood, labour and history. The Palacio de Bellas Artes, the Secretaría de Educación Pública and the university campuses hold major works. Contemporary art is international and local at once: museums, independent galleries, artist-run spaces and a strong photography and design scene. Lucha libre, sonidero and street music are part of the same visual and performative culture.',
        note: 'Some murals are in working government buildings; check access and photography rules.',
      },
      {
        theme: 'nature',
        title: 'A basin, a lake and a water crisis',
        body: 'The city occupies the Basin of Mexico, ringed by volcanoes and mountains. Tenochtitlan was built on an island in Lake Texcoco; the lake was drained over centuries, and the city now sinks as it pumps groundwater. Heavy rain floods low districts, while some neighbourhoods lack reliable water. The chinampas of Xochimilco are a surviving agricultural system and a reminder that the lake is not entirely gone. Altitude and air quality affect visitors.',
        note: 'Take the first day slowly at 2,200 metres. Do not swim in canals or eat unwashed produce from street stalls if you are sensitive.',
      },
    ],
    etiquette: [
      'Greet people when entering small shops or waiting rooms.',
      'Ask before photographing people, markets or religious ceremonies.',
      'Do not treat Day of the Dead or religious processions as costume events.',
      'Tip for table service and carry small change for markets.',
    ],
    stayArea: 'Roma or Condesa for walkability, or Coyoacán for a slower neighbourhood base',
    arrival:
      'Benito Juárez International Airport is close to the centre; allow time for traffic and use an authorised taxi or ride app. The metro is cheap but crowded at peak hours.',
    gettingAround:
      'Use the metro for distance, walk neighbourhoods, and take ride-hailing at night. Traffic is heavy; group sights by district.',
    sources: [
      { label: 'UNESCO — Historic Centre of Mexico City', url: 'https://whc.unesco.org/en/list/412/' },
      { label: 'Visit Mexico', url: 'https://www.visitmexico.com/' },
    ],
  },
  {
    destinationSlug: 'cusco',
    standfirst:
      'Cusco’s culture is Andean and colonial at once. Quechua language, reciprocity and weaving continue beside Catholic feast days and a tourist economy that can flatten both.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Pachamama and the saints',
        body: 'Andean cosmology centres on reciprocity with Pachamama (the earth), the apus (mountain spirits) and ancestors. Catholic saints and feast days were layered onto these practices during the colonial period, producing a syncretic religious life that is neither simply “Inca” nor simply “Catholic”. Offerings to the earth are still made at building sites and during August. Be careful not to present living Quechua practice as a survival of an ancient past.',
        note: 'Ask before photographing rituals or altars. Do not touch offerings or assume a ceremony is staged for visitors.',
      },
      {
        theme: 'traditions',
        title: 'Inti Raymi and the weaving calendar',
        body: 'Inti Raymi, the June solstice festival, is a modern civic re-enactment based on colonial chronicles rather than an unbroken Inca ritual. Corpus Christi and local saint festivals are living Catholic events. Weaving is a daily and ceremonial practice: backstrap looms, natural dyes and community-specific motifs. Many villages organise cooperatives so that textile income stays with makers. Buy from those directly where possible.',
        note: 'Inti Raymi is a performance for visitors as well as a civic event; treat it as such, not as an authentic Inca ceremony.',
      },
      {
        theme: 'food',
        title: 'Highland ingredients',
        body: 'Cusco’s food is built on potatoes, maize, quinoa, beans, squash and highland herbs. Cuy (guinea pig) is a traditional festive dish; alpaca and trout are common. Chicha de jora is fermented maize beer, often home-brewed. The altitude can suppress appetite, so eat lightly at first and drink water. Market comedores serve generous set lunches and are a good introduction to everyday cooking.',
        note: 'Ask about chicha’s alcohol content and whether it is homemade. Tap water is not for drinking.',
      },
      {
        theme: 'arts',
        title: 'Stone, cloth and the colonial image',
        body: 'Inca masonry is the city’s most famous art: polygonal blocks fitted without mortar, designed to move with earthquakes. The colonial Cusco School of painting combined European religious imagery with Andean details and local pigments. Textiles, silverwork and carpentry remain strong. The city’s museums are uneven, but the best collections explain the relationship between Inca and colonial visual culture rather than treating them as separate civilisations.',
        note: 'Do not buy textiles made from endangered animal fibres. Ask whether a piece is handwoven or machine-made.',
      },
      {
        theme: 'nature',
        title: 'Altitude and the sacred valley',
        body: 'Cusco sits at about 3,400 metres in a high Andean valley. The surrounding landscape is puna grassland, glaciated peaks and terraced valleys; weather changes quickly and the sun is intense. The Sacred Valley and Machu Picchu are downriver and lower, but access requires permits and planning. Altitude sickness is a real risk; acclimatise before hiking, and do not treat the mountains as a challenge to conquer.',
        note: 'Carry water, sun protection and layers. Avoid alcohol and strenuous activity on the first day.',
      },
    ],
    etiquette: [
      'Ask before photographing people, especially in markets and villages.',
      'Use both hands or a slight bow when receiving something; greet people first.',
      'Do not touch or climb Inca stonework.',
      'Buy crafts from cooperatives that credit the maker.',
    ],
    stayArea: 'The historic centre near the Plaza de Armas, or San Blas for a quieter artisan quarter',
    arrival:
      'Alejandro Velasco Astete Airport is close to the centre; taxis are short but agree the fare. Acclimatise for at least a day before hiking or taking on a long itinerary.',
    gettingAround:
      'Walk the centre slowly; taxis are cheap for longer trips. For the Sacred Valley, use a licensed driver or organised transport rather than improvising.',
    sources: [
      { label: 'UNESCO — City of Cuzco', url: 'https://whc.unesco.org/en/list/273/' },
      { label: 'Peru Tourism', url: 'https://www.peru.travel/en' },
    ],
  },
  {
    destinationSlug: 'cape-town',
    standfirst:
      'Cape Town’s culture is inseparable from its geography and its violence: Khoisan history, slavery, colonialism and apartheid have shaped who lives where, and the mountain looks on.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Faiths of the Cape',
        body: 'Christianity is the largest religion, with a strong Muslim community in Bo-Kaap descended from enslaved and exiled people brought by the Dutch, and a smaller Jewish community. Khoisan heritage and traditional healing practices survive despite centuries of dispossession. The city is constitutionally secular, but religion is visible in its streets, music and food. Apartheid’s racial categories still shape congregations and neighbourhoods.',
        note: 'Bo-Kaap is a residential neighbourhood, not a photo set. Ask before photographing people or entering a mosque.',
      },
      {
        theme: 'traditions',
        title: 'Carnival, cooking and remembrance',
        body: 'The Cape Town Minstrel Carnival (Tweede Nuwe Jaar) fills the streets on 2 January with teams in satin and face paint, a tradition with roots in slavery and emancipation. Cape Malay cooking, Friday prayers and the call to prayer in Bo-Kaap are part of the city’s rhythm. Braai is a social ritual across communities. Remembrance is also a tradition: District Six and Robben Island keep the memory of forced removals and political imprisonment alive.',
        note: 'Do not enter a mosque without permission or appropriate dress. Carnival is crowded; keep valuables close.',
      },
      {
        theme: 'food',
        title: 'Cape Malay, seafood and the braai',
        body: 'Cape Malay food blends Indonesian, Malay, Indian and Dutch influences: bobotie, bredie, koeksisters, samoosas and spicy curries. Seafood is best near the harbour, and the Winelands produce some of the country’s best-known wines. Braai — a wood or charcoal grill — is a social format rather than a restaurant dish. The food economy is marked by inequality; choose local businesses and ask about labour practices at wine estates.',
        note: 'Tap water is generally safe in the city. Ask about alcohol and pork if you keep halal or vegetarian.',
      },
      {
        theme: 'arts',
        title: 'Art after apartheid',
        body: 'Cape Town’s art scene includes major institutions such as Zeitz MOCAA, the Iziko museums and the District Six Museum, as well as commercial galleries and community arts centres. Jazz, hip-hop and gospel are part of the city’s sound. The legacies of apartheid, forced removals and migration are central to contemporary practice, and artists often work against the city’s scenic self-image. Look for work that engages with the city rather than only the landscape.',
        note: 'Check gallery hours; many smaller spaces are closed on Mondays.',
      },
      {
        theme: 'nature',
        title: 'Mountain, fynbos and two oceans',
        body: 'Table Mountain is a flat-topped sandstone massif covered in fynbos, a fire-adapted vegetation found only in the Cape. The cold Benguela current runs along the Atlantic coast; False Bay is warmer. The city’s water supply depends on distant catchments, and drought is a recurring crisis. Hiking is popular but serious: weather changes fast, and the mountain has claimed lives. Use marked routes and check conditions.',
        note: 'Do not hike alone or without water and wind protection. Follow fire bans and wildlife rules.',
      },
    ],
    etiquette: [
      'Ask before photographing people, especially in Bo-Kaap and townships.',
      'Do not treat poverty or apartheid history as a tourist attraction.',
      'Tip for service; many workers depend on it.',
      'Use licensed guides and local businesses where possible.',
    ],
    stayArea: 'City Bowl for walkability, or Sea Point/Green Point for the promenade and easier parking',
    arrival:
      'Cape Town International Airport is about 30–40 minutes from the centre. Use an authorised taxi or ride app; avoid unmarked cars.',
    gettingAround:
      'A car is useful for the peninsula and Winelands; in the centre, walk and use ride-hailing. Check safety advice for specific areas after dark.',
    sources: [
      { label: 'UNESCO — Robben Island', url: 'https://whc.unesco.org/en/list/916/' },
      { label: 'Cape Town Tourism', url: 'https://www.capetown.travel/' },
    ],
  },
  {
    destinationSlug: 'athens',
    standfirst:
      'Athens is an ancient city and a modern European capital, and the two are not separate. Orthodox Christianity, migration, crisis and a dense street culture shape the city as much as the Parthenon.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Orthodoxy and the ancient inheritance',
        body: 'The Greek Orthodox Church is the established faith, and its calendar shapes public holidays, name days and Easter. Ancient religion is not practised as a civic cult, though small groups honour the old gods. Athens is also home to Muslim, Jewish and Catholic communities, often migrant or historically rooted. The Acropolis is a archaeological site and a national symbol; the Parthenon’s sculptures are a live argument about repatriation, not simply a classical decoration.',
        note: 'Dress modestly in churches; women may be asked to cover shoulders and legs. Do not photograph worshippers without permission.',
      },
      {
        theme: 'traditions',
        title: 'Name days, Easter and the long table',
        body: 'Greek social life is built around name days, Easter, saints’ festivals and the evening meal. Orthodox Easter is the central religious holiday, with midnight services and family gatherings. The afternoon coffee and the late dinner are social institutions, not tourist clichés. Hospitality can be enthusiastic; accepting a glass of water or a sweet is polite. Political conversation is common and often passionate.',
        note: 'Do not assume everyone is Orthodox or Greek-born. Athens is a city of migrants and refugees.',
      },
      {
        theme: 'food',
        title: 'Olive oil, mezze and the taverna',
        body: 'Athenian food is Mediterranean and regional: olives, feta, tomatoes, pulses, grilled fish, lamb, and a strong culture of shared plates. Souvlaki is the everyday street food; a neighbourhood taverna is the better evening. Greek salad is not a national cliché but a summer dish of tomatoes, cucumber, onion, olives and feta. Ask for seasonal dishes and house wine rather than ordering from a photograph menu.',
        note: 'Bread and water may be charged separately. Tip modestly for table service.',
      },
      {
        theme: 'arts',
        title: 'Theatre, marble and the contemporary',
        body: 'Athens invented tragedy and comedy, and the ancient theatres of Epidaurus and the Acropolis still host performances. The National Archaeological Museum, the Acropolis Museum and the Benaki collections hold different versions of Greek history. Contemporary art spaces, independent galleries and a strong music scene engage with crisis, migration and gentrification. The city’s street art is part of its political language.',
        note: 'Some archaeological sites close early; check hours. Do not remove stones or touch the marble.',
      },
      {
        theme: 'nature',
        title: 'Heat, hills and the sea',
        body: 'Athens sits in the Attica basin, surrounded by mountains and opening to the Saronic Gulf. Summers are hot and dry, with wildfire risk; winters are mild and wet. Lycabettus and Philopappos hills give the best orientation. The city’s trees and water are precious, and heatwaves are becoming more severe. The coast at Piraeus and the southern suburbs is reachable by tram or metro.',
        note: 'Carry water in summer, avoid midday sun and follow fire warnings. Do not swim at unmarked rocky spots.',
      },
    ],
    etiquette: [
      'Dress modestly in churches; cover shoulders and knees.',
      'Say “kalimera” (good morning) when entering a shop.',
      'Do not photograph people in distress or protests without consent.',
      'Accept hospitality graciously; refuse only if you must.',
    ],
    stayArea: 'Koukaki or Plaka for walkability, or Exarchia for a more political, bohemian neighbourhood',
    arrival:
      'Athens International Airport is connected by metro line 3 and express buses. The metro is reliable; allow extra time during strikes.',
    gettingAround:
      'Walk the historic centre, use the metro for distance, and take the tram to the coast. Taxis are plentiful but traffic can be heavy.',
    sources: [
      { label: 'UNESCO — Acropolis, Athens', url: 'https://whc.unesco.org/en/list/404/' },
      { label: 'Visit Greece', url: 'https://www.visitgreece.gr/' },
    ],
  },
  {
    destinationSlug: 'queenstown',
    standfirst:
      'Queenstown is a Māori landscape, a gold-rush town and an adventure capital. Its culture is shaped by the lake, the mountains and the people who work in both.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Kai Tahu and the lake',
        body: 'Queenstown is within the rohe of Kai Tahu, the South Island iwi. Lake Wakatipu is central to local whakapapa and tradition; the mountains and rivers are ancestors and places of significance, not simply resources. Pākehā (European) settlement brought Christianity and a secular outdoor culture. Many visitors encounter Māori culture only through tourism, but mana whenua relationships continue in land, water and local decision-making.',
        note: 'Do not repeat Māori stories as “legends” without context. Seek Māori-led interpretation where possible.',
      },
      {
        theme: 'traditions',
        title: 'Gold, seasons and Matariki',
        body: 'The Otago gold rush of the 1860s created Arrowtown and accelerated European settlement; Chinese miners’ settlements are part of that history. Farming, tourism and outdoor recreation followed. Matariki, the Māori new year, is now a public holiday and is marked with storytelling, food and remembrance. Anzac Day and Waitangi Day are national observances with local significance. The town’s calendar is now organized around ski season and summer visitors.',
        note: 'Do not treat Matariki as a fireworks festival; it is a time of reflection, remembrance and gathering.',
      },
      {
        theme: 'food',
        title: 'Lamb, stone fruit and pinot',
        body: 'Central Otago is a fruit-growing and wine region, known for pinot noir, cherries, apricots and thyme. Queenstown’s restaurants serve lamb, venison, seafood and a strong café culture. The town is small and seasonal; staff turnover is high, and quality varies. A farm shop or a local bakery can be better than a waterfront restaurant. Food here is expensive by New Zealand standards because of remoteness and tourism.',
        note: 'Tap water is safe. Ask about allergens; kitchens are often small and busy.',
      },
      {
        theme: 'arts',
        title: 'Māori making and the adventure image',
        body: 'Kai Tahu carving, weaving and storytelling are part of the region’s visual culture, though tourism often reduces them to souvenir motifs. Queenstown’s galleries show landscape photography and adventure film as well as contemporary work. The town has a strong documentary and outdoor-film culture; the risk is that the landscape becomes a backdrop for adrenaline rather than a place with history. Look for work by Māori and local artists.',
        note: 'Buy Māori art from Māori artists or authorised galleries. Avoid objects that misuse sacred motifs.',
      },
      {
        theme: 'nature',
        title: 'A glacial lake and a fragile alpine world',
        body: 'Lake Wakatipu was carved by glaciers and is fed by mountain rivers; its level rises and falls with snowmelt and rain. The Remarkables and the Harris Mountains frame the town, and the alpine environment is fragile. Weather changes rapidly, avalanches are a real risk in winter, and wildfires can close tracks. Adventure tourism is regulated, but risk remains. The landscape is not a playground without consequences.',
        note: 'Check forecasts and avalanche reports. Do not hike alone in exposed alpine terrain.',
      },
    ],
    etiquette: [
      'Give way on walking tracks; uphill walkers often have right of way.',
      'Do not approach wildlife or feed birds.',
      'Ask before photographing people, especially Māori cultural performers.',
      'Pack out rubbish and respect track closures.',
    ],
    stayArea: 'Central Queenstown for walkability, or Frankton/Arrowtown for quieter access and parking',
    arrival:
      'Queenstown Airport is close to Frankton; taxis and buses reach the centre. The drive from Christchurch is long and mountain roads can close in winter.',
    gettingAround:
      'Walk the centre, use the local bus network, or hire a car for the wider region. Book activities and transfers ahead in peak season.',
    sources: [
      { label: 'New Zealand Tourism', url: 'https://www.newzealand.com/' },
      { label: 'Queenstown NZ', url: 'https://www.queenstownnz.co.nz/' },
    ],
  },
];
