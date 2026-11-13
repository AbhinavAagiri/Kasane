import type { CultureProfile } from '@/data/culture.types';

export const cultureProfilesOne: CultureProfile[] = [
  {
    destinationSlug: 'kyoto',
    standfirst:
      'Kyoto’s culture is a set of obligations more than a style: to the seasons, to the neighbour, to the material in your hand. The city is not preserved; it is maintained.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Two paths, one city',
        body: 'Shinto and Buddhism have shared Kyoto for more than a millennium. Shrines mark the presence of kami — spirits or sacred forces in a place, a tree, a mountain — while temples hold Buddhist teaching and practice. Many households use both without contradiction: a shrine visit for a new beginning, a temple for a funeral. Neither is a performance for visitors.',
        note: 'A shrine is usually distinguished by a torii gate; a temple by a main hall and Buddhist statuary. Both are places of worship first.',
      },
      {
        theme: 'myth',
        title: 'The waterfall and the wish',
        body: 'At Kiyomizu-dera, visitors drink from the Otowa waterfall and are told that one stream brings longevity, another success, another love. Drinking from all three is popularly said to be greedy. The custom is a living folk belief, not a guarantee, and the temple asks visitors to treat the water as sacred rather than as a wish machine.',
        note: 'Folklore, not verified outcome: a window into how people make meaning, not a fact.',
      },
      {
        theme: 'traditions',
        title: 'The etiquette of small things',
        body: 'Ojigi — bowing — carries degrees of respect; a shallow nod between equals is not the same as a deep bow to a teacher. Shoes come off inside many homes, ryokan and temple halls. Gifts are given and received with both hands, and seasonal greetings are folded into letters and shop displays. These are not decorative customs; they are the grammar of consideration.',
        note: 'In a tea room, wait to be shown where to sit and how to hold the bowl. The host will guide you.',
      },
      {
        theme: 'food',
        title: 'Dashi, and the discipline of less',
        body: 'Kyoto cooking is built on dashi — stock from kombu and dried bonito — with restrained salt, soy and sweetness. Shojin ryori, Buddhist temple cuisine, avoids meat and strong aromatics; obanzai is everyday home cooking of vegetables and small preserved fish. Nishiki Market is the pantry, but the better meal is often a set lunch in a quiet neighbourhood.',
        note: 'Do not tip; service is included. Slurping noodles is acceptable. Ask before photographing a counter or a chef.',
      },
      {
        theme: 'arts',
        title: 'Materials understood over time',
        body: 'Kyoto’s crafts survive because they are still used: lacquerware for soup, bamboo for baskets, indigo for cloth, washi for screens. The machiya townhouse is itself a craft object — a long timber frame with a shop at the front, a courtyard garden, and deep eaves that protect the interior. Kintsugi, repairing ceramics with gold, is a philosophy of use made visible.',
        note: 'A workshop visit is more respectful than a photo stop. Ask whether photography is allowed before raising a camera.',
      },
      {
        theme: 'festival',
        title: 'A calendar written in processions',
        body: 'Aoi Matsuri in May is a stately procession of court dress and mounted archers; Gion Matsuri in July fills the month with street music, portable shrines and the great Yamaboko floats; Jidai Matsuri in October reviews the city’s historical eras in costume. These are religious and civic events, not themed entertainment. Neighbourhood festivals are often more intimate and less advertised.',
        note: 'Processions close streets for hours. Stand to the side, keep children close and never step into the procession to photograph.',
      },
      {
        theme: 'nature',
        title: 'A garden is an argument',
        body: 'Kyoto’s gardens edit nature rather than reproduce it: borrowed mountains, a single stone, raked gravel whose pattern lasts until rain rewrites it. The gardener’s art is in what is left out. Autumn maples and spring cherries draw crowds, but the city’s real seasonal culture is quieter — the first cold morning, the smell of pine after rain, moss that survives because someone tends it.',
        note: 'Do not pick plants or step into moss gardens. Many temple gardens are viewed from a verandah, not walked through.',
      },
      {
        theme: 'local',
        title: 'How to be a good guest',
        body: 'Kyoto’s centre is dense with residents who live alongside its heritage. Gion’s lanes are not a photo set: private doorways, teahouses and homes line them. Photography of geiko and maiko without consent is explicitly discouraged, and some lanes are closed to through traffic. The useful local rhythm is early: markets before nine, temples at opening, a long lunch, an evening walk without a destination.',
        note: 'Keep voices low in residential lanes. Do not block a doorway for a portrait. Support small shops rather than only chains.',
      },
    ],
    etiquette: [
      'Bow slightly when greeting; follow the lead of the person you are meeting.',
      'Remove shoes where indicated, including some restaurants and temple buildings.',
      'Do not eat or drink while walking through residential lanes or shrines.',
      'Ask before photographing people, interiors or a craftsperson at work.',
    ],
    stayArea: 'Central Nakagyo or the edge of Gion, within a short walk of a subway line',
    arrival:
      'Haruka express from Kansai International to Kyoto Station (about 75 minutes). An IC card covers subways, buses and most trains.',
    gettingAround:
      'Bus and subway for the main sites; walk the Philosopher’s Path, Gion and market lanes early. Bicycles are useful but not in crowded temple districts.',
    sources: [
      { label: 'Kyoto City Official Travel Guide', url: 'https://kyoto.travel/en/' },
      { label: 'Kyoto Convention & Visitors Bureau', url: 'https://www.kyokanko.or.jp/' },
    ],
  },
  {
    destinationSlug: 'jaipur',
    standfirst:
      'Jaipur is a working city with a royal past, not a stage set. Its culture lives in the bazaar, the courtyard and the kitchen long before it reaches the palace.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Many faiths, one street',
        body: 'Rajasthan is majority Hindu, with substantial Jain and Muslim communities and a long history of Rajput rule. Temples sit beside mosques and havelis; the everyday greeting may be “Ram Ram” or “Khuda Hafiz”, depending on who is speaking. The cow is sacred to many Hindus, which shapes food and street life. Jain practice places strong emphasis on non-violence and vegetarianism.',
        note: 'Ask before entering a temple. Shoes come off; leather items may need to be left outside. Photography of deities is often restricted.',
      },
      {
        theme: 'myth',
        title: 'Palace stories and the pink city',
        body: 'Jaipur’s foundation is often told as a royal dream and a city drawn in nine blocks, with pink chosen to welcome a prince. The city was planned in 1727 under Sawai Jai Singh II, but the romance around its colour and founding is partly later storytelling. Treat palace legends as cultural memory, not archival fact.',
        note: 'Legend and civic history overlap here. The grid, gates and waterworks are documented; the dream is not.',
      },
      {
        theme: 'traditions',
        title: 'Hospitality as a system',
        body: 'Atithi devo bhava — the guest as god — is a familiar Sanskrit phrase, but in Jaipur hospitality is also practical: shade, water, a chair, a cool room. Weddings can involve hundreds of guests and days of events; festivals are organised by neighbourhood committees. Caste and class still structure many social arrangements, and a visitor’s ease should not be mistaken for an absence of those hierarchies.',
        note: 'Accept tea or water when offered if you can; refusing outright can read as rejection. Use your right hand for food and gifts.',
      },
      {
        theme: 'food',
        title: 'Ghee, grain and the shared thali',
        body: 'Rajasthani food developed in a dry landscape: millet, gram flour, dried beans, ghee, pickles and dairy. Dal baati churma, pyaaz kachori and ghewar are well known, but the everyday meal is a thali assembled from small bowls. Many kitchens are vegetarian; Jain food avoids root vegetables and sometimes onion and garlic. Street food is best where the queue is local and turnover high.',
        note: 'Tap water is not for visitors; drink filtered or bottled water. Eat with your right hand, and ask before photographing a stall.',
      },
      {
        theme: 'arts',
        title: 'A supply chain of skill',
        body: 'Jaipur’s block printing, blue pottery, gem cutting, miniature painting and textiles are not folk survivals but a living export economy. Families apprentice their children; workshops take commissions from Europe and the Gulf. The bazaars are showrooms, but the more interesting encounters are in workshops on the edge of the old city, where the day’s orders matter more than the display.',
        note: 'Bargaining is normal in bazaars, but not in fixed-price cooperatives. Ask permission before filming a craftsperson.',
      },
      {
        theme: 'festival',
        title: 'Teej, Gangaur and the monsoon',
        body: 'Gangaur in spring honours the goddess Gauri with processions and decorated images; Teej welcomes the monsoon with swings, songs and green bangles; Diwali lights the old city in autumn. The Jaipur Literature Festival in January has become a global event, but it is a recent addition to a much older ritual calendar. Dates follow the lunar calendar.',
        note: 'Festival crowds are intense. Keep valuables close and plan transport well in advance.',
      },
      {
        theme: 'nature',
        title: 'A city that remembers water',
        body: 'The Aravalli hills frame Jaipur and feed its old water systems. Stepwells, reservoirs and channels were engineered to hold the monsoon; many are now dry or neglected, and the city draws water from far beyond its boundaries. The dry season is not empty — it is the condition that shaped the architecture, the food and the daily timing of the city.',
        note: 'Do not enter stepwells or climb heritage walls. Heat exhaustion is a real risk from April to June.',
      },
      {
        theme: 'local',
        title: 'Beyond the elephant ride',
        body: 'The old city is best at ground level: a morning walk through the bazaars before the heat, a rooftop lunch, a courtyard concert, a cooking class that starts in the market. Elephant rides at Amber Fort raise welfare concerns; walking up or taking a jeep is a more considered choice. Tipping is expected in tourism but should reflect service, not pressure.',
        note: 'Avoid giving money or sweets to children; it can keep them out of school. Support organisations that employ local guides.',
      },
    ],
    etiquette: [
      'Dress modestly at temples; cover shoulders and knees, and remove shoes.',
      'Use your right hand to eat, give and receive.',
      'Ask before photographing people, especially women and religious ceremonies.',
      'Do not touch offerings, statues or temple bells without guidance.',
    ],
    stayArea: 'C-Scheme for calm, or a haveli inside the old city walls for atmosphere',
    arrival:
      'Jaipur International Airport is 20–30 minutes from the centre by prepaid taxi or app cab. Trains arrive at Jaipur Junction.',
    gettingAround:
      'App cabs and auto-rickshaws are practical; agree the fare first. Walk the old city early, when the bazaars are still cool.',
    sources: [
      { label: 'Rajasthan Tourism', url: 'https://www.tourism.rajasthan.gov.in/' },
      { label: 'Jaipur Literature Festival', url: 'https://jaipurliteraturefestival.org/' },
    ],
  },
  {
    destinationSlug: 'barcelona',
    standfirst:
      'Barcelona is Catalan before it is Spanish, modern before it is Gothic, and a city whose self-image is constantly being argued over in the street.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'A secular city with Catholic bones',
        body: 'Catalonia is now largely secular, but its calendar is still shaped by Catholic feast days and its neighbourhoods by parish life. The Sagrada Família is a working basilica, not a theme park; Mass is held amid the visitors. Catalan identity is not a religion, though it can function like one: language, history and the memory of the Civil War are part of how many people understand belonging.',
        note: 'Do not assume Barcelona represents all of Spain. Catalan is the first language for many residents; a greeting in Catalan is appreciated.',
      },
      {
        theme: 'myth',
        title: 'Sant Jordi and the dragon',
        body: 'The legend of Sant Jordi — George — slaying a dragon and saving a princess is a medieval hagiography, not a local historical event. Barcelona adopted the story enthusiastically, and on 23 April the city fills with book and rose stalls. The day is real; the dragon is not. The pleasure is in watching a civic ritual turn a myth into a streetscape.',
        note: 'Myth, not history. The rose and the book are the point.',
      },
      {
        theme: 'traditions',
        title: 'Human towers and fire runs',
        body: 'Castells are exactly what they sound like: teams building human towers, with a child climbing to the top to place a hand. Correfoc — fire runs — send devils and drummers through the streets with sparklers. Both are community practices with strict internal rules, not spectator stunts. Sardana, the circular folk dance, is slower and more civic; anyone can join the circle.',
        note: 'Castells are dangerous. Keep a clear distance and follow stewards. Do not grab or touch participants.',
      },
      {
        theme: 'food',
        title: 'Market first, restaurant second',
        body: 'Catalan cooking is built on sofregit — onion, tomato and olive oil cooked down — plus fish, beans, pork and wild greens. Pa amb tomàquet, tomato-rubbed bread, is the daily staple. Vermouth at midday is a genuine ritual. The best food is often in markets and bars with a short menu, not on the Rambla.',
        note: 'Lunch is the main meal; dinner starts late. Tipping is modest — rounding up or 5–10% is enough.',
      },
      {
        theme: 'arts',
        title: 'Modernisme and its arguments',
        body: 'Gaudí is the famous name, but Barcelona’s architecture is a debate between modernisme, rationalism and the everyday city. The Eixample’s chamfered corners and light wells were a social plan as much as an aesthetic one. The Barcelona Pavilion, MACBA and the long experiment with superblocks show that the city still treats urban design as a public argument.',
        note: 'Book major sites in advance. The best architecture is often the street itself: look up, and at how buildings meet the pavement.',
      },
      {
        theme: 'festival',
        title: 'La Mercè and the neighbourhood',
        body: 'La Mercè in September is the city’s biggest festival: gegants, castells, correfoc and free concerts. Sant Jordi in April turns the centre into a book market. Gràcia’s festa major in August decorates streets with handmade sets, and Santa Eulàlia in February brings smaller, colder processions. Neighbourhood festivals are often more distinctive than the central programme.',
        note: 'Pickpocketing rises at crowded festivals. Carry a small bag in front and avoid keeping a phone in a back pocket.',
      },
      {
        theme: 'nature',
        title: 'Sea, ridge and drought',
        body: 'Barcelona is squeezed between the Collserola ridge and the Mediterranean. The beaches are engineered and popular; the hills are a real wilderness of pine and scrub. Drought is now a political reality, with restrictions on water use and a long debate about tourism’s pressure on the city. The landscape is not a backdrop — it sets the limits.',
        note: 'Respect beach flags and local rules. Do not hike Collserola alone in extreme heat; carry water.',
      },
      {
        theme: 'local',
        title: 'The city that lives on the street',
        body: 'Barcelona’s public realm is its living room: squares, benches, playgrounds and market halls. That sociability is real, and so is the tension around short-term rentals, noise and the displacement of long-term residents. The most respectful visitor learns a few words of Catalan, shops in the neighbourhood rather than the port, and treats the square as someone’s home.',
        note: 'Avoid apartments in residential buildings where neighbours are being priced out. Stay in licensed accommodation.',
      },
    ],
    etiquette: [
      'Greet with “bon dia” in Catalan; two cheek kisses are common among friends.',
      'Do not assume everyone speaks Spanish as a first language.',
      'Keep noise down in residential squares late at night.',
      'At a castell, never enter the safety circle around the base.',
    ],
    stayArea: 'Eixample near a metro stop, or Gràcia for a neighbourhood rhythm',
    arrival:
      'Aerobús or the R2 train from El Prat airport; both reach the centre in about 35 minutes. The T-casual card covers ten metro journeys.',
    gettingAround:
      'Metro for distance, walking for the centre, and the beach on foot or by tram. Avoid driving; parking is scarce and the city is dense.',
    sources: [
      { label: 'Barcelona City Council', url: 'https://www.barcelona.cat/en/' },
      { label: 'Catalan Tourism', url: 'https://www.catalunya.com/' },
    ],
  },
  {
    destinationSlug: 'florence',
    standfirst:
      'Florence is a city of workshops and factions as much as frescoes. Its Renaissance was funded by trade, argued over in the street and carried home in the grain of the furniture.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'Faith, patronage and the guilds',
        body: 'Medieval Florence was a Catholic city organised around guilds, confraternities and powerful families. The Duomo was a civic project as much as a religious one; its dome was an engineering argument about the city’s ambition. Today the churches remain active places of worship, and the religious calendar still shapes the streets. The Renaissance did not replace faith with art; it put faith to work through art.',
        note: 'Churches require covered shoulders and knees. Do not talk loudly or use flash during services.',
      },
      {
        theme: 'myth',
        title: 'The Medici myth and the “dark ages”',
        body: 'Florence’s popular story is one of a sudden golden age led by the Medici, with the Middle Ages as a detour. Historians describe a longer, messier continuity: guild wealth, banking, plague, political violence and a constant negotiation between civic republic and family power. The Medici were central, but not the only authors of the city.',
        note: 'Myth of a clean break. The Renaissance grew out of medieval institutions, not in opposition to them.',
      },
      {
        theme: 'traditions',
        title: 'The neighbourhood as a team',
        body: 'Florence still divides into historic quarters with their own colours and loyalties. Calcio storico, a violent hybrid of football and rugby played in Santa Croce, is the most visible expression of that identity. Everyday traditions are quieter: morning coffee taken standing, the passeggiata, Sunday lunch that runs into evening.',
        note: 'Calcio storico is genuinely rough. Buy tickets through official channels and expect a partisan crowd.',
      },
      {
        theme: 'food',
        title: 'Plain food, strong opinions',
        body: 'Florentine cooking is direct: ribollita, pappa al pomodoro, bistecca, beans, olive oil and unsalted bread. The bread is unsalted because of a historic tax dispute, and locals still argue about whether it is better that way. A trattoria with a short menu is usually a better bet than a restaurant with photographs outside.',
        note: 'Do not order a cappuccino after lunch if you want to blend in. Ask for the house wine; it is often the point.',
      },
      {
        theme: 'arts',
        title: 'The workshop as a way of thinking',
        body: 'Florence’s artistic culture was built in botteghe — workshops where apprentices ground pigments, prepared panels and learned by copying. The museums are full of masterpieces, but the deeper story is a system of craft transmission. That system survives in bookbinders, leatherworkers, gilders and restorers, often in the Oltrarno.',
        note: 'A visit to a working workshop should be arranged, not improvised. Buy something small rather than photographing the process.',
      },
      {
        theme: 'festival',
        title: 'Easter and the exploding cart',
        body: 'On Easter Sunday, a mechanical dove leaves the altar of the Duomo and ignites a cart of fireworks in the square — the Scoppio del Carro. It is a civic and religious ritual with medieval roots; a good explosion is read as a good omen for the year. The city also marks its patron saint, John the Baptist, in June with processions and a regatta on the Arno.',
        note: 'Dates follow the liturgical calendar. Arrive early and keep well back from the cart.',
      },
      {
        theme: 'nature',
        title: 'The hills are the city’s edge',
        body: 'Florence sits in a bowl of hills; the Arno runs through it, and the Tuscan landscape begins just beyond the last busy street. Olive groves and cypress lines are a cultural landscape shaped by centuries of farming. Summer heat is intense and the stone holds it. The view from San Miniato is not just a postcard — it shows how tightly the city is held by its geography.',
        note: 'Do not walk in the hills in the midday heat without water. The view is best at opening time or late afternoon.',
      },
      {
        theme: 'local',
        title: 'Cross the river',
        body: 'Oltrarno is the living counterweight to the museum circuit: workshops, schools, families and a slower evening. The centre is increasingly given over to short stays; the neighbourhood is where the city still has to function. The most useful thing a visitor can do is spend time — and money — away from the obvious streets, and learn to pause at the same café twice.',
        note: 'Avoid blocking narrow pavements with luggage or tripods. Support independent shops and eat away from the main squares.',
      },
    ],
    etiquette: [
      'Cover shoulders and knees in churches; remain quiet during services.',
      'Do not sit on church steps to eat lunch; find a bench or a square.',
      'Order at the counter in a café if you do not want a table charge.',
      'Book major museums in advance; choose a few rooms rather than rushing all of them.',
    ],
    stayArea: 'Oltrarno or Santa Croce, within a 20-minute walk of the centre',
    arrival:
      'Tram T2 from Florence airport to Santa Maria Novella in about 20 minutes. High-speed trains arrive at the same station.',
    gettingAround:
      'The historic centre is best on foot; it is compact and mostly flat. Buses cover the hills and outer neighbourhoods. Do not drive into the ZTL.',
    sources: [
      { label: 'Florence tourism', url: 'https://www.feelflorence.it/en' },
      { label: 'Opera di Santa Maria del Fiore', url: 'https://duomo.firenze.it/en' },
    ],
  },
  {
    destinationSlug: 'new-york',
    standfirst:
      'New York is not one culture but a negotiation between hundreds of them, conducted on a grid, at speed, in public.',
    chapters: [
      {
        theme: 'beliefs',
        title: 'A city of many faiths',
        body: 'New York is one of the most religiously diverse cities in the world: Christian, Jewish, Muslim, Hindu, Buddhist, Sikh and secular communities share blocks and sometimes buildings. The public culture is broadly secular, but faith is visible in storefront churches, mosques, synagogues and street festivals. Lenape people are the original inhabitants of the land the city stands on; that history is not a footnote.',
        note: 'Respect posted photography and dress rules in houses of worship. Do not treat services as tourist attractions.',
      },
      {
        theme: 'myth',
        title: 'The melting pot',
        body: 'The “melting pot” is a useful slogan and a misleading description. Immigrant communities in New York have often kept their languages, foods and institutions while adapting to the city; the result is more like a mosaic than a soup. The idea that the city is a pure meritocracy is also a myth: housing, policing and education have never been equal.',
        note: 'Civic myth, not sociological fact. The city’s identity is plurality, not uniformity.',
      },
      {
        theme: 'traditions',
        title: 'The block and the stoop',
        body: 'New York’s everyday culture is neighbourhood-scale: the stoop, the bodega, the block party, the deli counter, the fire escape. Thanksgiving brings a parade and a shared meal; Halloween turns certain blocks into open-air theatre. The subway is a social institution in its own right, with an unwritten etiquette: let people off first, keep your bag off the seat, do not perform for the car.',
        note: 'Walk with purpose; standing in the middle of a pavement is the city’s cardinal sin. Hold the door if someone is close behind.',
      },
      {
        theme: 'food',
        title: 'An immigrant city at the table',
        body: 'The city’s food is its immigration history made edible: Jewish delis, Italian-American red sauce, Chinese hand-pulled noodles, Dominican rice and beans, halal carts, Korean fried chicken, West African stalls. The best value is often a counter or a truck, not a dining room. Tipping is not optional for sit-down service; 18–20% is standard.',
        note: 'Do not confuse “New York pizza” with all pizza. Ask a local for their block’s spot, not the famous queue.',
      },
      {
        theme: 'arts',
        title: 'Institutions and the street',
        body: 'New York’s art world runs from the Met and MoMA to tiny non-profit galleries, jazz basements and public murals. Broadway is a commercial industry; off-Broadway and community theatre are where much of the work is made. The city’s cultural density is its real luxury: on any night, something small and excellent is happening within a subway ride.',
        note: 'Many museums have pay-what-you-wish hours; check current policy. Book Broadway only through official sellers.',
      },
      {
        theme: 'festival',
        title: 'The calendar of the street',
        body: 'The Macy’s Thanksgiving Day Parade, the Fourth of July fireworks, Pride in June and the Tribeca Festival are the headline events. Smaller parades and street fairs — Lunar New Year, Dominican Day, the West Indian Day Parade — are often more rooted in neighbourhood life. The city’s festival calendar is dense and political; it is also a reminder that public space is always being claimed.',
        note: 'Large events bring road closures and crowding. Use public transport and expect security checks.',
      },
      {
        theme: 'nature',
        title: 'The edge of the grid',
        body: 'Central Park is the obvious lung, but the city’s ecology extends to Jamaica Bay, the Rockaways, Staten Island’s greenbelt and the rivers that surround it. Heat waves are increasingly dangerous, especially in neighbourhoods with less tree cover. The waterfront is being redeveloped at speed; access to it is not equal. Look for the working edge: ferries, fishing piers and salt marsh.',
        note: 'Swim only at lifeguarded beaches. In summer, carry water and use the shade; subway platforms can be dangerously hot.',
      },
      {
        theme: 'local',
        title: 'How to be a New Yorker for a day',
        body: 'Learn the rhythm: walk on the right, stand to the side to look at your phone, let the train empty before boarding. Say “good morning” to the person at the bodega. The city is expensive and unequal, and its homelessness crisis is visible; treat people on the street as people, not scenery. The most meaningful visit is often the least iconic: a local library, a park bench, a neighbourhood restaurant.',
        note: 'Do not photograph people in distress. Support local businesses and community organisations.',
      },
    ],
    etiquette: [
      'Tip 18–20% at sit-down restaurants and $1–2 per drink at bars.',
      'Stand to the right on escalators; let passengers off the train first.',
      'Do not block the pavement or the subway door with luggage.',
      'Ask before photographing people, especially in vulnerable situations.',
    ],
    stayArea: 'Lower East Side or Brooklyn for neighbourhood life; Midtown for transit convenience',
    arrival:
      'AirTrain plus the subway or LIRR from JFK; NJ Transit or Amtrak from Newark. Contactless OMNY works on subways and buses.',
    gettingAround:
      'The subway runs all night and is the fastest way around. Walk for the texture. Avoid driving in Manhattan; parking and traffic are punishing.',
    sources: [
      { label: 'NYC official guide', url: 'https://www.nyc.gov/html/visitor/' },
      { label: 'Metropolitan Museum of Art', url: 'https://www.metmuseum.org/' },
    ],
  },
];
