import type { CultureProfile } from '@/data/culture.types';

export const cultureProfilesTwo: CultureProfile[] = [
  {
    destinationSlug: 'lucerne',
    standfirst:
      'Lucerne is a Catholic lake city with a carnival heart and a mountain horizon. Its culture is civic, musical and quietly self-assured.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Catholic roots, secular present',
        body: 'Lucerne was a Catholic stronghold in a Swiss Confederation shaped by the Reformation, and its churches, monasteries and pilgrimage traditions remain part of the city’s fabric. Today the population is largely secular, with a Catholic cultural inheritance that surfaces in processions, church music and the rhythms of the liturgical year.',
        note: 'Church interiors are active worship spaces. Visit quietly and check before taking photographs.',
      },
      {
        theme: 'myth',
        title: 'William Tell and the founding oath',
        body: 'The story of William Tell shooting an apple from his son’s head is a founding legend of the Swiss Confederation, not a documented historical event. The Rütli oath, similarly, is a national origin story rather than a court record. The legend matters because it encodes a civic idea: resistance to arbitrary power by ordinary people acting together.',
        note: 'National myth, not archival history. Treat it as a story about values, not a news report.',
      },
      {
        theme: 'traditions',
        title: 'Fasnacht turns the city inside out',
        body: 'Lucerne’s Fasnacht is one of Switzerland’s great carnivals: masked guilds, drum and piccolo bands, elaborate costumes and a week of planned disorder before Lent. It is not Oktoberfest and not a tourist showcase; the humour is local, often satirical and sometimes incomprehensible to outsiders. The city’s brass bands and yodelling clubs carry that same participatory culture through the year.',
        note: 'If you join Fasnacht, watch before you photograph. Many costumes and masks are private work, and crowds are dense.',
      },
      {
        theme: 'food',
        title: 'Cheese, lake fish and a serious bakery',
        body: 'Fondue and raclette are real, but they are winter dishes, not everyday ones. Lucerne’s own signature is Chügelipastete, a pastry shell filled with veal and mushrooms, and lake fish from the Vierwaldstättersee. Zopf, the braided Sunday bread, is a marker of the weekend. Meals are orderly and seasonal, with a strong preference for local produce.',
        note: 'Do not double-dip in a shared fondue. Sip, do not gulp, and keep “Prost” eye contact.',
      },
      {
        theme: 'arts',
        title: 'A city that takes music seriously',
        body: 'Lucerne has an outsized classical music culture for its size: the Lucerne Festival, the Symphony Orchestra and a conservatory that draws students from across Europe. The Kapellbrücke’s painted panels and the Bourbaki Panorama are civic storytelling on a grand scale. The Rosengart Collection adds a concentrated dose of Picasso and Klee.',
        note: 'Book major festival concerts early. Standing tickets and open rehearsals can be good value.',
      },
      {
        theme: 'festival',
        title: 'The lake as a stage',
        body: 'The Lucerne Festival runs through late summer, with orchestras and soloists in the Culture and Convention Centre. Fasnacht takes over the old town in February, and the Blue Balls festival brings contemporary music to the lakefront in July. National Day on 1 August is marked with fireworks and community gatherings.',
        note: 'Dates change annually. Check the official programme rather than relying on last year’s calendar.',
      },
      {
        theme: 'nature',
        title: 'A lake, a mountain, a weather system',
        body: 'Lucerne sits at the point where the Reuss leaves the Vierwaldstättersee, with Pilatus to the south and Rigi to the east. The Föhn wind can change the light and the mood of the city within an hour. Hiking is genuinely accessible from town, but mountain weather is not a city park: check forecasts and lift times before setting out.',
        note: 'Do not hike above the tree line without proper shoes and a weather check. The last cable car is not a suggestion.',
      },
      {
        theme: 'local',
        title: 'The civility of small routines',
        body: 'Swiss civic life runs on quiet rules: recycling schedules, noise-free hours, reserved rubbish bags, a general preference for not bothering anyone. Lucerne’s old town is small enough that residents and visitors share the same streets; the local response is patience, not performance. The lake ferries are public transport as much as an excursion, and the weekly market is the useful place to see the region’s produce.',
        note: 'Keep noise down after 10pm. Cross at marked crossings; jaywalking is fined. Do not assume everything is open on Sunday.',
      },
    ],
    etiquette: [
      'Greet shopkeepers with “Grüezi” and say goodbye with “Uf Wiederluege” (or a simple “Merci”).',
      'Keep quiet in residential areas after 10pm; Sunday is a rest day.',
      'Do not jaywalk; use marked crossings.',
      'Tip by rounding up or leaving 5–10%; service is included.',
    ],
    stayArea: 'Old town near the river, or Neustadt close to the station',
    arrival:
      'Direct trains from Zurich airport take about an hour. The station is on the south edge of the old town, within walking distance of most hotels.',
    gettingAround:
      'Walk the old town and lakefront; buses cover the hills. Boats and mountain railways are part of the public transport network, with their own fares.',
    sources: [
      { label: 'Lucerne Tourism', url: 'https://www.luzern.com/en/' },
      { label: 'Lucerne Festival', url: 'https://www.lucernefestival.ch/en/' },
    ],
  },
  {
    destinationSlug: 'lisbon',
    standfirst:
      'Lisbon is a port city that has learned to live with distance: from the sea, from its empire, from the future it once imagined for itself.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Catholic ritual and older layers',
        body: 'Lisbon is a Catholic city with a layered past of Muslim and Jewish presence, much of it erased or hidden after the 1497 forced conversions. Saints are part of the street calendar; neighbourhood churches are still social centres. Fado, often described as the sound of saudade, is not religious music, but it shares the same register of longing and restraint.',
        note: 'Do not enter a church during Mass for sightseeing. Jewish heritage sites are often community-run; check visiting rules.',
      },
      {
        theme: 'myth',
        title: 'The earthquake and the sea monsters',
        body: 'The 1755 earthquake, tsunami and fires destroyed much of Lisbon and became a European philosophical event. Some preachers interpreted it as divine punishment; the Marquis of Pombal’s rebuilding was an early exercise in empirical urban planning. Earlier maps and legends filled the Atlantic with monsters. The earthquake is fact; the moral explanation is myth.',
        note: 'Distinguish the documented disaster from the stories people told about it. Both shaped the city.',
      },
      {
        theme: 'traditions',
        title: 'Saints, tiles and the evening walk',
        body: 'Lisbon’s calendar is full of neighbourhood saints’ days, with decorations, grilled sardines and processions. Azulejo tiles are not merely decorative: they are a way of managing heat, light and the city’s Atlantic damp. The evening passeggiata, a slow walk and a stop at a miradouro, is the most reliable local ritual.',
        note: 'During festas, streets are packed and residents stay out late. Keep noise down when walking home through residential lanes.',
      },
      {
        theme: 'food',
        title: 'Salt cod and small plates',
        body: 'Bacalhau — salt cod — is claimed to have a thousand preparations, and the claim is not far off. Petiscos, small plates, are the useful way to eat: canned fish, cheese, olives, grilled octopus, bifanas. Pastéis de nata are best warm, with cinnamon and no ceremony. Coffee is strong and taken standing at the counter.',
        note: 'Bread and olives brought to the table are usually charged. Tipping is modest; 5–10% is generous.',
      },
      {
        theme: 'arts',
        title: 'Manueline stone and the city’s surface',
        body: 'The Manueline style — maritime rope, shells and exotic foliage carved into stone — is Lisbon’s most distinctive architectural language. The city is also a great place to read surfaces: azulejo façades, calçada patterns, tiled shopfronts and a strong tradition of street art and independent galleries. Fado houses range from serious listening rooms to tourist shows; ask around.',
        note: 'In a fado house, silence is part of the performance. Do not talk over a singer or use a flash.',
      },
      {
        theme: 'festival',
        title: 'June in Lisbon',
        body: 'The Festas de Lisboa fill June with street parties, sardine grills and the Marchas Populares, neighbourhood parades with costumes and songs. Santo António on 13 June is the city’s patron saint day, with weddings broadcast from the cathedral and a lot of communal eating. The city also hosts Rock in Rio and a growing number of smaller festivals.',
        note: 'June is crowded and hot. Book accommodation early and expect noise in the old neighbourhoods until late.',
      },
      {
        theme: 'nature',
        title: 'River, ocean, hills',
        body: 'Lisbon is built on steep hills above the Tejo estuary, with the Atlantic just beyond. The river is a working waterway and a public edge; the ocean is colder and more dangerous than the postcards suggest. Summer heat is intensifying, and the hills make even a short walk physical. The city’s famous light comes from the water and the low latitude, not from a filter.',
        note: 'Swim only at lifeguarded beaches; the Atlantic has strong currents. Wear shoes with grip on the calçada.',
      },
      {
        theme: 'local',
        title: 'A city under pressure',
        body: 'Lisbon’s popularity has driven rents up and pushed residents out of central neighbourhoods. The tram 28 queue is not the city; the local bus, the market and the neighbourhood café are. Learning a few words of Portuguese, shopping away from the main squares and staying in licensed accommodation are small but meaningful choices.',
        note: 'Do not photograph people’s homes or laundry as “authenticity”. Ask before taking portraits in markets.',
      },
    ],
    etiquette: [
      'Greet with “bom dia” or “boa tarde”; a handshake is normal on introduction.',
      'Do not talk during a fado performance.',
      'Bread, olives and cheese brought unasked are usually chargeable.',
      'Walk carefully on calçada; it is beautiful and slippery.',
    ],
    stayArea: 'Príncipe Real or the edge of Alfama; both are central without being in the tram crush',
    arrival:
      'Metro from Humberto Delgado airport to the centre in about 20 minutes; buy a Viva Viagem card for metro, tram and bus.',
    gettingAround:
      'Walk and use the metro; trams are charming but crowded. Taxis and ride-hailing are inexpensive compared with northern Europe. Wear grippy shoes.',
    sources: [
      { label: 'Visit Lisboa', url: 'https://www.visitlisboa.com/en' },
      { label: 'Festas de Lisboa', url: 'https://festasdelisboa.pt/' },
    ],
  },
  {
    destinationSlug: 'matera',
    standfirst:
      'Matera is a city carved out of soft rock and a modern lesson in how quickly a place can be labelled, emptied and rediscovered.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Peasant Catholicism and the rock churches',
        body: 'The Sassi grew around a network of rupestrian churches, some with Byzantine frescoes, and a form of peasant Catholicism shaped by poverty, distance and the agricultural year. The Madonna della Bruna is the city’s patron; her feast is the central civic-religious event. The cave churches are fragile, and many are cared for by volunteers and local associations.',
        note: 'Some rock churches require a guided visit. Do not touch frescoes or use flash; the pigments are vulnerable.',
      },
      {
        theme: 'myth',
        title: 'The “shame of Italy”',
        body: 'In the 1950s, Matera’s cave dwellings were described as a national shame: overcrowded, without proper water or sanitation, and blamed for disease. The state evacuated thousands to new housing. That history is real. The later story — that the Sassi were an untouched ancient world — is a simplification: they were continually adapted, and their rediscovery came through writers, filmmakers and local activism.',
        note: 'The Sassi are not a timeless village. They are a built environment shaped by poverty, policy and repair.',
      },
      {
        theme: 'traditions',
        title: 'The cart, the procession, the bread',
        body: 'Festa della Bruna centres on a decorated cart that is paraded through the city and then dismantled by the crowd — a ritual of communal taking-apart that visitors are warned not to join. The pasteruoli, shepherds who walk in the procession, are part of the living tradition. Matera’s bread, baked in wood-fired ovens, is a point of local pride.',
        note: 'The cart-breaking is not a photo opportunity. Stay behind barriers and follow the instructions of stewards.',
      },
      {
        theme: 'food',
        title: 'Cucina povera, not a brand',
        body: 'Matera’s cooking comes from scarcity: durum wheat bread, peppers, beans, lampascioni (wild hyacinth bulbs), lamb and caciocavallo. It is often described as cucina povera, but poverty is not a flavour; the skill is in preservation and patience. The best meals are in family-run trattorias where the menu changes with the garden.',
        note: 'Do not frame the food as “peasant chic”. Ask before photographing a family kitchen or a baker at work.',
      },
      {
        theme: 'arts',
        title: 'Architecture without architects',
        body: 'The Sassi are a lesson in passive design: thick tufa walls, underground cisterns, courtyards that shade and collect water. The city’s modern chapter includes Carlo Levi’s writing, Pasolini’s filming and a wave of restoration that turned caves into houses, hotels and museums. The risk is that the architecture becomes a backdrop for tourism rather than a place where people still live.',
        note: 'Stay in licensed cave accommodation and respect the structural limits. Do not climb roofs or enter unmarked cavities.',
      },
      {
        theme: 'festival',
        title: 'The second of July',
        body: 'Festa della Bruna on 2 July is Matera’s most important annual event: a procession, fireworks, the decorated cart and the ritual breaking. It is intensely local, with families claiming their spots and bands playing through the night. The city also hosts a growing programme of film and contemporary art events, often using the Sassi as a stage.',
        note: 'Book accommodation months ahead for the festival. Expect heat, crowds and late nights.',
      },
      {
        theme: 'nature',
        title: 'The gravina and the Murgia',
        body: 'Matera sits above a limestone gorge — the gravina — with the Murgia plateau beyond. The landscape is dry, sharply lit and full of rock-cut cisterns and shepherds’ paths. Summer heat is severe, and water is historically the limiting resource. The city’s survival has always depended on catching and storing rain.',
        note: 'Carry water on any walk in the gorge. Do not stray from marked paths; the rock edges are unstable.',
      },
      {
        theme: 'local',
        title: 'A place that people still live in',
        body: 'The Sassi are not only a heritage site. Residents, artisans and families share the lanes with visitors, and the tension between restoration and everyday life is ongoing. The most useful visit is slow: one cave church, one bakery, one long lunch, a walk across the gorge at dusk. Buy from local workshops and avoid treating the city as an open-air film set.',
        note: 'Keep voices low in residential lanes. Do not enter private courtyards or photograph doorways without invitation.',
      },
    ],
    etiquette: [
      'Cover shoulders in churches; remove hats.',
      'Do not join the cart-breaking at Festa della Bruna; it is dangerous.',
      'Ask before photographing people, courtyards or workshops.',
      'Wear shoes with grip; the Sassi steps are steep and polished.',
    ],
    stayArea: 'A licensed cave room in the Sassi, or a hotel near Piazza Vittorio Veneto for easier access',
    arrival:
      'Bus or train from Bari airport to Matera (about 1.5 hours); the station is a short taxi or walk from the Sassi. A car is not useful inside the old city.',
    gettingAround:
      'Walk. The Sassi are stairs and slopes; taxis can reach the edges but not the lanes. Allow more time than the map suggests.',
    sources: [
      { label: 'Matera tourism', url: 'https://www.materaturismo.it/en/' },
      { label: 'Festa della Bruna', url: 'https://www.festadellabruna.it/' },
    ],
  },
  {
    destinationSlug: 'ghent',
    standfirst:
      'Ghent is a medieval port turned student city, with a stubborn civic streak and a festival culture that belongs to its residents.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'A Catholic past and a secular present',
        body: 'Ghent’s skyline is defined by medieval churches and a bell tower that once signalled civic independence as much as faith. The Reformation was violently suppressed here, and the city remained largely Catholic under Spanish rule. Today it is secular and plural, with a strong tradition of social organisation, cooperatives and student activism.',
        note: 'Churches are active. Concerts and services are often open to visitors; check notices at the door.',
      },
      {
        theme: 'myth',
        title: 'The rebellious city',
        body: 'Ghent’s reputation for rebellion is grounded in real events: guild uprisings, a revolt against Charles V in 1539–40, and a long history of civic negotiation. The city’s self-image as stubbornly independent is also a story it likes to tell about itself. The “vegetarian capital” label is a recent piece of civic branding, not an ancient tradition.',
        note: 'Civic myth with a factual base. The rebellion happened; the swagger is curated.',
      },
      {
        theme: 'traditions',
        title: 'Students, bikes and ten days of street',
        body: 'Ghent is a university city, and its rhythms are shaped by students: cheap cafés, bicycles, late nights and a dense cultural calendar. The Gentse Feesten, ten days in July, turn the whole centre into a stage with music, theatre and street performance. Cycling is not a hobby; it is the default way to move.',
        note: 'Stay out of the bike lane. Lock your bike properly and do not block pavements.',
      },
      {
        theme: 'food',
        title: 'Stew, water and vegetables',
        body: 'Ghent’s classic dishes are stoofvlees (beef stew with beer) and waterzooi (a creamy chicken or fish soup). Cuberdons, cone-shaped raspberry sweets, are a local obsession. The city has a strong vegetarian and vegan scene, and its Thursday market is one of the best in Belgium. Beer is a cuisine here, with Trappist and lambic traditions nearby.',
        note: 'Ask for the house beer rather than the most famous export. Tipping is modest; rounding up is normal.',
      },
      {
        theme: 'arts',
        title: 'Van Eyck and after',
        body: 'The Adoration of the Mystic Lamb in St Bavo’s Cathedral is the city’s artistic anchor: a complex, recently restored altarpiece that rewards slow looking. Ghent also has a strong contemporary design and music scene, with venues like Vooruit and a street-art route through the centre. The city’s museums are ambitious without being blockbuster-driven.',
        note: 'Book the altarpiece in advance and use the audio guide; the panels are dense with detail.',
      },
      {
        theme: 'festival',
        title: 'The city as a stage',
        body: 'The Gentse Feesten in July is the defining event: free performances across squares and streets, run by a coalition of local organisations. The Film Festival in October and the Light Festival in January bring different crowds. Smaller neighbourhood festivals and student events fill the calendar in between.',
        note: 'Gentse Feesten is free but crowded. Pick a few stages rather than trying to see everything.',
      },
      {
        theme: 'nature',
        title: 'Rivers and a green edge',
        body: 'Ghent grew at the confluence of the Leie and Scheldt, and its medieval port identity is still legible in the canals and warehouses. The Bourgoyen-Ossemeersen nature reserve on the edge of the city is a wetland of international importance for birds. The flat landscape makes cycling easy, and the weather makes waterproofs essential.',
        note: 'Do not swim in the canals. The nature reserve is protected; stay on paths during breeding season.',
      },
      {
        theme: 'local',
        title: 'A city that argues in public',
        body: 'Ghent’s civic culture is participatory and sometimes confrontational: cooperatives, neighbourhood associations, protests and a strong local media scene. The city has experimented with car-free zones and pedestrianisation, with predictable arguments. Visitors can join the useful version of this by shopping locally, using the tram or bike, and treating the centre as a neighbourhood rather than a museum.',
        note: 'Learn a few words of Dutch; English is widely spoken but the effort is appreciated.',
      },
    ],
    etiquette: [
      'Greet with “goeiedag”; a handshake is standard.',
      'Never walk or stop in a bike lane.',
      'Keep noise down in residential streets after 10pm.',
      'Ask before photographing people in the street or at markets.',
    ],
    stayArea: 'Patershol for medieval lanes, or near Sint-Pieters station for easy arrival',
    arrival:
      'Frequent trains from Brussels take about 35 minutes to Gent-Sint-Pieters; tram 1 or 3 connects the station to the centre.',
    gettingAround:
      'Walk and cycle. Trams cover the centre and station. The old town is compact but cobbled; comfortable shoes are essential.',
    sources: [
      { label: 'Visit Ghent', url: 'https://visit.gent.be/en' },
      { label: 'Gentse Feesten', url: 'https://gentsefeesten.stad.gent/' },
    ],
  },
  {
    destinationSlug: 'valletta',
    standfirst:
      'Valletta is a fortified city built by an order of knights on a limestone peninsula: very small, very dense, and still arguing with its own baroque image.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'An island of saints and festas',
        body: 'Malta is overwhelmingly Catholic, and Valletta’s calendar is organised around saints’ days, processions and village bands. Each town has a patron saint and a festa; the rivalry between bands is real and occasionally heated. The Knights of St John built the city as a fortress of the faith, but the everyday religion is more local: family, neighbourhood, and the saint who belongs to your street.',
        note: 'Festa fireworks and processions are loud and late. Dress modestly in churches and do not block the procession route.',
      },
      {
        theme: 'myth',
        title: 'The city built in fifteen years',
        body: 'Valletta was founded in 1566 after the Great Siege and built with extraordinary speed; its grid and fortifications are a deliberate act of Renaissance planning. The romantic version — a perfect city conjured by Grand Master La Valette — leaves out the labour, the enslaved people, the Inquisition and the ordinary Maltese who lived outside the walls. The plan was real; the glory story is selective.',
        note: 'Documented planning, selective memory. Look for the histories the postcard omits.',
      },
      {
        theme: 'traditions',
        title: 'Bands, processions and għana',
        body: 'Malta’s festa culture combines religious procession, brass bands, fireworks and communal eating. Għana is a traditional Maltese folk song, often improvised and competitive, with a guitar accompaniment; it survives in local clubs rather than on the tourist circuit. The Good Friday processions are solemn, with statues and penitents, and are not meant as spectacle.',
        note: 'During processions, keep a respectful distance and do not photograph penitents’ faces without consent.',
      },
      {
        theme: 'food',
        title: 'Rabbit, pastry and a British ghost',
        body: 'Maltese cooking combines Sicilian, North African and British influences: rabbit stew, pastizzi (flaky pastries filled with ricotta or peas), ftira bread, ġbejna cheese and capers. The British legacy is visible in tea, sandwiches and the English language. Valletta’s food is best at a neighbourhood bakery or a family-run restaurant, not on the main tourist strip.',
        note: 'Pastizzi are cheap and eaten at any hour. Do not expect a long lunch on Sunday; many family places close.',
      },
      {
        theme: 'arts',
        title: 'Caravaggio in a fortress',
        body: 'Valletta’s artistic centrepiece is Caravaggio’s Beheading of Saint John the Baptist, painted for the oratory of St John’s Co-Cathedral. The city’s baroque interiors are astonishing, but its cultural life also includes contemporary art at MUŻA, a strong theatre scene and a growing design community. The limestone itself is the city’s most consistent material.',
        note: 'St John’s Co-Cathedral requires modest dress and a ticket. Photography may be restricted in the oratory.',
      },
      {
        theme: 'festival',
        title: 'Notte Bianca and the village festa',
        body: 'Notte Bianca in October opens museums and palaces late into the night, with performances across the city. The Malta Jazz Festival and the Valletta Baroque Festival bring international programming. The village festas run through the summer, each with its own saint, band and fireworks; they are the more authentic calendar.',
        note: 'Fireworks are ubiquitous and loud in summer. Check dates locally; they shift with the liturgical calendar.',
      },
      {
        theme: 'nature',
        title: 'Limestone, harbour, heat',
        body: 'Valletta is built on a limestone peninsula between two harbours, with no rivers and little shade. Summer heat is severe, and water is scarce. The sea is central to the city’s identity, but the swimming spots are rocky and the currents can be strong. The harbour ferries are both transport and a way to see the city’s scale.',
        note: 'Carry water and wear a hat in summer. Swim at supervised spots and respect the red flags.',
      },
      {
        theme: 'local',
        title: 'A small city with a long memory',
        body: 'Valletta’s population is small, and the city’s daytime crowds are largely commuters and visitors. The local rhythm is early: markets, errands, church, a long lunch, a late passeggiata. Gentrification and short-term rentals are pressing issues. The most respectful visit is to use the ferries and buses, eat in family restaurants, and treat the steep streets as a neighbourhood rather than a stage.',
        note: 'The streets are steep and slippery; wear shoes with grip. Do not photograph people’s doorways or laundry without asking.',
      },
    ],
    etiquette: [
      'Dress modestly in churches; shoulders and knees covered.',
      'Do not interrupt or photograph a religious procession.',
      'Keep voices low in residential streets, especially during siesta.',
      'Ask before photographing fishers or market traders at work.',
    ],
    stayArea: 'Valletta centre for walkability, or Birgu across the harbour for quiet',
    arrival:
      'Bus or taxi from Malta International Airport takes about 20 minutes. The ferry from Birgu and the bus terminal outside the City Gate are the main connections.',
    gettingAround:
      'Walk within Valletta; the grid is steep but compact. Buses and ferries connect the harbour towns. Driving is not recommended.',
    sources: [
      { label: 'Visit Malta', url: 'https://www.visitmalta.com/' },
      { label: 'Valletta Cultural Agency', url: 'https://www.vallettaculturalagency.mt/' },
    ],
  },
  {
    destinationSlug: 'essaouira',
    standfirst:
      'Essaouira is a wind-battered Atlantic port where Amazigh, Arab, Jewish and sub-Saharan traditions have been meeting for centuries — and where the gulls are louder than the cars.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Islam, Amazigh custom and Gnawa spirituality',
        body: 'Morocco is a Muslim country, and Essaouira’s daily rhythm follows the call to prayer, Ramadan and the Islamic calendar. The town also has a strong Amazigh (Berber) heritage and a Gnawa tradition with roots in sub-Saharan Africa: a spiritual music and healing practice that is distinct from tourism. Essaouira once had a significant Jewish community; its mellah and synagogue are part of the town’s history.',
        note: 'Do not enter a mosque unless invited. During Ramadan, be considerate about eating and drinking in public during daylight.',
      },
      {
        theme: 'myth',
        title: 'The hippie port and the film set',
        body: 'Essaouira’s reputation as a 1960s and 70s bohemian refuge — Jimi Hendrix, Cat Stevens, Orson Welles — is partly true and heavily embellished. The story that Hendrix wrote “Castles Made of Sand” here is widely repeated but not reliably documented. The film-set image has been good for tourism and less good for the fishing town that existed before it.',
        note: 'A useful story, not a confirmed biography. Enjoy the atmosphere without repeating it as fact.',
      },
      {
        theme: 'traditions',
        title: 'Tea, hammam and the evening walk',
        body: 'Mint tea is the social gesture: poured high, sweet, and offered before business. The hammam is a practical institution as much as a ritual, with separate hours for men and women. In the late afternoon, families walk the ramparts and the beach; the wind is a constant subject. The fishing port is a working space, not a photo opportunity at dawn.',
        note: 'Accept tea with your right hand. Ask before photographing fishers unloading the catch; they are working.',
      },
      {
        theme: 'food',
        title: 'The Atlantic on a plate',
        body: 'Essaouira eats fish: sardines, sea bream, squid, oysters from nearby beds. The port stalls grill what was landed that morning; the medina has tagines, msemen and argan oil. Moroccan cooking is regional, and the coast is distinct from the interior. Alcohol is available in licensed hotels and some restaurants, but not openly everywhere.',
        note: 'Shellfish and street food are best at high-turnover stalls. Drink bottled or filtered water.',
      },
      {
        theme: 'arts',
        title: 'Thuya, paint and a guitar',
        body: 'The medina’s workshops are known for thuya wood marquetry, inlaid with silver and mother-of-pearl; the craft is a family trade under pressure from cheaper imitations. Essaouira has a long painting tradition and a music culture that spills into the streets during the Gnaoua festival. The ramparts and the old Portuguese fortifications are the town’s most dramatic architecture.',
        note: 'Buy from workshops where you can see the work being made. Bargaining is expected, but not in fixed-price galleries.',
      },
      {
        theme: 'festival',
        title: 'Gnaoua and the Atlantic wind',
        body: 'The Gnaoua World Music Festival in June brings Gnawa masters and international musicians together; it is the town’s biggest event and a genuine musical meeting, though the crowds transform the medina. The Alizés festival and smaller cultural events fill the rest of the year. Ramadan and the Islamic calendar move through the seasons.',
        note: 'Book accommodation well ahead for the Gnaoua festival. Respect the spiritual context of Gnawa performances.',
      },
      {
        theme: 'nature',
        title: 'Wind, sand and a fragile coast',
        body: 'Essaouira sits on a windy Atlantic coast with a long beach and dunes that are increasingly under pressure from development and water extraction. The trade winds make it a windsurfing destination; they also shape the architecture, the fishing and the daily mood. The argan forest inland is a fragile ecosystem, not a backdrop for a camel ride.',
        note: 'Swim with care; the Atlantic has strong currents. Do not ride camels or quad bikes on fragile dunes without checking local rules.',
      },
      {
        theme: 'local',
        title: 'A working town inside a postcard',
        body: 'The medina is a living neighbourhood: schoolchildren, fishers, shopkeepers and families who are not on holiday. Tourism is the main economy, and the pressure is visible in the way the port and the square are organised. The useful visitor learns a few words of Arabic or French, buys from the workshop, and does not treat the town as a costume.',
        note: 'Ask before taking portraits. Dress modestly in the medina. Do not photograph the fishing catch without permission.',
      },
    ],
    etiquette: [
      'Greet with “salam alaikum”; the response is “wa alaikum salam”.',
      'Use your right hand for food, tea and greetings.',
      'Dress modestly in the medina and at religious sites.',
      'Ask before photographing fishers, artisans or children.',
    ],
    stayArea: 'A riad inside the medina, within the walls and a short walk from the port',
    arrival:
      'Essaouira airport is 20 minutes from the medina; most visitors arrive by road from Marrakech (about 2.5–3 hours).',
    gettingAround:
      'The medina is pedestrian and compact; walk everywhere. Petit taxis cover the beach and airport. The wind makes a light jacket useful even in summer.',
    sources: [
      { label: 'Visit Morocco', url: 'https://www.visitmorocco.com/en' },
      { label: 'Gnaoua Festival', url: 'https://www.festival-gnaoua.net/' },
    ],
  },
  {
    destinationSlug: 'paris',
    standfirst:
      'Paris is a city of institutions and neighbourhoods, of grand axes and small rooms. Its culture is argued in public and lived at the table.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Laïcité and the sacred',
        body: 'France’s principle of laïcité — state secularism — shapes public life, but Paris is full of religious presence: Catholic churches, mosques, synagogues, Buddhist centres and a visible Jewish quarter. The tension between secular neutrality and religious identity is a live political argument, not a settled fact. Visitors should treat places of worship as communities, not as architectural interiors.',
        note: 'Cover shoulders in churches; some require silence or restrict photography. Do not assume a secular city is a religion-free one.',
      },
      {
        theme: 'myth',
        title: 'The Parisian',
        body: 'The myth of the effortlessly elegant Parisian — thin, white, chain-smoking, left-bank — is a marketing image with a long history. The real city is one of the most diverse in Europe, with large North and West African, Asian, Caribbean and Middle Eastern communities, and a working class that has largely been pushed to the banlieues. The myth is seductive; the city is more interesting.',
        note: 'A national self-image, not a demographic description. Look beyond the centre for the actual city.',
      },
      {
        theme: 'traditions',
        title: 'The café, the market, the apéro',
        body: 'Parisian daily life is organised around small rituals: the morning café at the counter, the market on a specific street on a specific day, the apéro before dinner, the long Sunday lunch. The boulangerie is protected by law and civic pride. These routines are not performances for visitors; they are the infrastructure of neighbourhood life.',
        note: 'Say “bonjour” when entering a shop; it is the basic social contract. Ask for the bill rather than waiting for it.',
      },
      {
        theme: 'food',
        title: 'Terroir in a small room',
        body: 'Paris is not the source of French cuisine so much as its stage. The city’s food culture is built on regional produce, strict appellations and a dense network of markets, bakeries, cheesemongers and bistros. The best value is often a fixed lunch menu, a market sandwich or a neighbourhood wine bar with a short list. Haute cuisine exists; it is not the whole story.',
        note: 'Service is included; leave a small tip for good service. Tap water is free and normal to ask for.',
      },
      {
        theme: 'arts',
        title: 'The museum and the street',
        body: 'Paris’s cultural institutions are immense, but its artistic life is also in cinemas, bookshops, small galleries and the fabric of the street. The Louvre and Orsay reward planning; the Palais de Tokyo and smaller foundations reward curiosity. Photography, cinema and fashion are part of the city’s self-definition, and the line between art and commerce is often deliberately blurred.',
        note: 'Book major museums in advance. Many have free or reduced entry for under-26s and EU residents; check current rules.',
      },
      {
        theme: 'festival',
        title: 'Music in the street',
        body: 'Fête de la Musique on 21 June fills the city with free performances, from professional stages to amateur bands on corners. Bastille Day on 14 July brings a military parade and fireworks; the Nuit Blanche in June/July opens galleries and installations late into the night. These are civic events with a political edge, not just entertainment.',
        note: 'Expect crowds and transport disruptions. Check the official programme and avoid unofficial “ticket” sellers.',
      },
      {
        theme: 'nature',
        title: 'The river and the edge',
        body: 'The Seine is the city’s spine, and its banks are a UNESCO-listed landscape of stone, water and public life. Paris’s parks range from formal gardens to the wilder edges of the Bois de Vincennes and Boulogne. Summer heat is now a public health issue, and the city’s tree cover is unevenly distributed; the coolest places are often churches, museums and shaded squares.',
        note: 'Do not swim in the Seine outside supervised areas. In a heatwave, use the city’s cooling rooms and carry water.',
      },
      {
        theme: 'local',
        title: 'The neighbourhood is the city',
        body: 'Paris is a collection of villages with arrondissement identities. The useful visit picks one or two and stays: the 11th for food and nightlife, the 10th for canals and stations, the 5th for books and students, the 20th for a more mixed, less polished city. The centre is increasingly given over to tourism; the edges are where daily life is most legible.',
        note: 'Do not block pavements with luggage or tripods. Keep your phone secure on the metro; pickpocketing is common.',
      },
    ],
    etiquette: [
      'Say “bonjour” on entering a shop, café or lift; “merci” on leaving.',
      'Do not assume English; try a few words of French first.',
      'Keep your voice low in restaurants and on public transport.',
      'Tip modestly; service is included, but rounding up is appreciated.',
    ],
    stayArea: 'The 11th or 10th for neighbourhood life and good transport; the 5th for a quieter, bookish base',
    arrival:
      'RER B from Charles de Gaulle takes about 35 minutes to the centre; Orly is on the Orlyval and RER C. Contactless Navigo Easy is the simplest fare option.',
    gettingAround:
      'Metro for distance, walking for texture. The city is compact but spread out; allow time for stairs and transfers. Avoid driving.',
    sources: [
      { label: 'Paris official tourism', url: 'https://www.paris.fr/' },
      { label: 'Fête de la Musique', url: 'https://fetedelamusique.culture.gouv.fr/' },
    ],
  },
  {
    destinationSlug: 'seoul',
    standfirst:
      'Seoul compresses a long Confucian memory, a fast modern economy and a global pop culture into a city of mountains, markets and late-night rooms.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Confucian ethics, Buddhist practice, Christian growth',
        body: 'Korean social life is shaped by Confucian ideas about family, hierarchy, education and respect for elders, even among people who are not religious. Buddhism has a long institutional presence; Christianity is unusually strong in South Korea, with large Protestant churches and a significant Catholic community. Shamanic practices survive in specific rituals, often at the edges of formal religion.',
        note: 'Age and seniority affect language and behaviour. Use two hands when giving or receiving something from an elder.',
      },
      {
        theme: 'myth',
        title: 'Dangun and the founding of Korea',
        body: 'The Dangun story tells of a bear transformed into a woman and a heavenly prince who founded Gojoseon. It is a foundation myth, not a historical record, though it is treated as a national origin story and is commemorated in a holiday. The story encodes ideas about patience, ancestry and the sacredness of the mountain landscape.',
        note: 'Myth, not history. It is still politically and emotionally meaningful to many people.',
      },
      {
        theme: 'traditions',
        title: 'Seollal, Chuseok and the ancestral table',
        body: 'Seollal, the lunar new year, and Chuseok, the harvest festival, are the two great family holidays. Both involve ancestral rites (jesa), food, and travel back to the family home; Chuseok is the bigger migration. Bowing to elders, shared meals and the giving of gifts are central. The hanbok is worn for celebrations and increasingly for everyday outings in tourist areas.',
        note: 'During Seollal and Chuseok, many businesses close and transport is fully booked. Plan around the holiday, not through it.',
      },
      {
        theme: 'food',
        title: 'A table with a centre',
        body: 'Korean meals are shared: rice and soup for each person, banchan and a main dish in the middle. Kimchi is served at most meals, but it is not a single recipe; regional and family versions differ. Jang (fermented soy), gochujang and sesame oil are the flavour foundations. Seoul’s market food — bindaetteok, tteokbokki, knife-cut noodles — is cheap and excellent.',
        note: 'Wait for the eldest to start eating. Pour drinks for others, not yourself. Do not tip; it is not expected.',
      },
      {
        theme: 'arts',
        title: 'Craft, cinema and the pop machine',
        body: 'Seoul’s traditional arts include celadon, hanji paper, woodwork, embroidery and minhwa painting; many survive in small studios and government-supported craft centres. The city is also a global cultural producer: film, television, music and fashion are industries with enormous reach. The challenge is to see both: the quiet craft workshop and the slick production machine are part of the same city.',
        note: 'Buy crafts from the maker or a reputable gallery; mass-produced souvenirs are often imported.',
      },
      {
        theme: 'festival',
        title: 'Lanterns, drums and the lunar calendar',
        body: 'The Lotus Lantern Festival in spring marks Buddha’s birthday with a parade of illuminated lanterns. Seollal and Chuseok are family holidays rather than street festivals, though palaces and parks host events. The Seoul Drum Festival and various neighbourhood festivals fill the summer. Dates for lunar events move each year.',
        note: 'Lantern parades are crowded; arrive early and keep children close. Respect the religious context of temple events.',
      },
      {
        theme: 'nature',
        title: 'Mountains inside the city',
        body: 'Seoul is ringed by mountains, and several ridges run into the city itself. Namsan, Bukhansan and Inwangsan are accessible by public transport; hiking is a genuine civic pastime, with proper gear and early starts. The Han River is the city’s other landscape: parks, bike paths, and a wide, sometimes muddy, waterway. Seasonal fine dust can make outdoor exercise unpleasant.',
        note: 'Check air quality before a long hike. Do not hike in flip-flops; the granite can be steep and slippery.',
      },
      {
        theme: 'local',
        title: 'Speed, courtesy and the late city',
        body: 'Seoul moves fast: delivery, work, subway, notifications. But the social surface is polite and hierarchical, with a strong emphasis on not causing inconvenience. Late-night food and cafés are part of the economy, and the city is safe by most standards. The useful visitor learns the subway, keeps their voice low, and does not treat the city as a K-drama set.',
        note: 'Do not photograph people without consent, especially in markets or at memorial sites. Stand to the right on escalators and let passengers off first.',
      },
    ],
    etiquette: [
      'Use two hands when giving or receiving, especially to elders.',
      'Wait for the eldest to begin eating; pour drinks for others.',
      'Do not tip; service is included.',
      'Keep your voice low on the subway and in cafés.',
    ],
    stayArea: 'Jongno or Insadong for palaces and walkability; Seongsu for a younger, design-led scene',
    arrival:
      'AREX express or all-stop train from Incheon International to Seoul Station (43–60 minutes). A T-money card covers subway, bus and taxi payments.',
    gettingAround:
      'The subway is fast, clean and extensive; walking is best in Jongno, Bukchon and Seongsu. Taxis are affordable but traffic can be heavy.',
    sources: [
      { label: 'Visit Korea', url: 'https://english.visitkorea.or.kr/' },
      { label: 'Seoul tourism', url: 'https://english.visitseoul.net/' },
    ],
  },
];
