import type { Story } from '@/data/types';

export const stories: Story[] = [
  {
    slug: 'the-quiet-architecture-of-kyoto',
    title: 'The quiet architecture of Kyoto',
    standfirst:
      'The city’s most important buildings are not the ones on the postcards. They are the ones that teach you how to enter a room, and when to stop talking.',
    categories: ['Architecture', 'Culture'],
    destinationSlug: 'kyoto',
    image: {
      src: 'story-kyoto',
      alt: 'A dark wooden verandah opening onto a green garden',
    },
    issue: 'Issue 01',
    readingMinutes: 7,
    blocks: [
      {
        type: 'paragraph',
        text: 'Kyoto is often visited as a sequence of famous addresses. The Golden Pavilion, the bamboo grove, the shrine with its thousand gates. They are worth seeing, but they are not where the city’s architectural intelligence lives. That is in the smaller moves: the change of level at a doorway, the way a roof is allowed to droop, the single stone placed where a garden would otherwise look finished.',
      },
      { type: 'heading', text: 'The threshold' },
      {
        type: 'paragraph',
        text: 'A machiya is a long, narrow townhouse with a shop or entrance at the street and a garden at the back. Its rooms are not arranged as a corridor of spaces but as a series of thresholds, each one slightly darker than the last. You do not simply walk in; you are gradually admitted. The architecture is doing the work of a host.',
      },
      {
        type: 'image',
        image: {
          src: 'story-kyoto-b',
          alt: 'A tatami room opening onto a small garden',
        },
      },
      {
        type: 'paragraph',
        text: 'This is why the city is best experienced slowly, and why a temple garden can feel more like an argument than a view. The gardener has decided what you will see first, and what will remain hidden until you move. The pleasure is in the composition, but also in the confidence of the editing.',
      },
      {
        type: 'pull',
        text: 'The room does not end at the window. It continues into the garden, and the garden continues into the city.',
      },
      { type: 'heading', text: 'The room and the garden' },
      {
        type: 'paragraph',
        text: 'In a Kyoto house, the boundary between inside and outside is deliberately soft. Sliding screens can be opened to make a single continuous space; a verandah can be a place to sit, a place to sleep, or a place to watch the rain. The architecture is not designed to hold the weather out but to let you live with it at a slight remove.',
      },
      {
        type: 'paragraph',
        text: 'By the end of a few days, the city’s lesson becomes clear. Quiet architecture is not the absence of detail. It is the result of deciding, very carefully, which details are allowed to speak.',
      },
      {
        type: 'facts',
        title: 'In the story',
        items: [
          { label: 'Where', value: 'Kyoto, Japan' },
          { label: 'Useful time', value: 'Three to four days' },
          { label: 'Season', value: 'Late autumn' },
        ],
      },
    ],
    related: ['lisbon-read-in-tiles', 'new-york-in-layers'],
  },
  {
    slug: 'beyond-the-palaces-of-rajasthan',
    title: 'Beyond the palaces of Rajasthan',
    standfirst:
      'The famous forts are only the first layer. In Jaipur, the more interesting architecture is the city’s working fabric: courtyards, screens, stepwells and the buildings that keep the heat at a distance.',
    categories: ['Places', 'Architecture', 'Culture'],
    destinationSlug: 'jaipur',
    image: {
      src: 'story-rajasthan',
      alt: 'The pink sandstone facade of Hawa Mahal with its lattice of small windows',
    },
    issue: 'Issue 02',
    readingMinutes: 6,
    blocks: [
      {
        type: 'paragraph',
        text: 'The route most visitors take through Jaipur is a line of palaces. Amber Fort, the City Palace, Hawa Mahal. Each is extraordinary, and each has been photographed so often that it can be hard to see. The alternative is to look at how the city solves ordinary problems: shade, airflow, privacy, water.',
      },
      {
        type: 'paragraph',
        text: 'Hawa Mahal is the clearest example. From the street it reads as a screen, five storeys of small openings in pink sandstone. Its beauty is a by-product of its usefulness: the facade lets air through while allowing the women of the court to watch the street without being seen.',
      },
      { type: 'heading', text: 'The courtyard as a room' },
      {
        type: 'paragraph',
        text: 'Jaipur is a city of inward-looking buildings. The courtyard is where the house becomes a climate: cool at midday, social in the evening, private from the street. A palace courtyard and a modest haveli courtyard use the same logic at different scales.',
      },
      {
        type: 'image',
        image: {
          src: 'story-rajasthan-b',
          alt: 'A formal courtyard garden with water channels and pale arcades',
        },
      },
      {
        type: 'paragraph',
        text: 'The stepwells are the other great architectural idea. Panna Meena ka Kund is a geometry of stairs descending to water, a public space that is simultaneously a machine. Standing at the top, you can read the whole structure in a single glance; the pleasure is in the descent.',
      },
      {
        type: 'paragraph',
        text: 'The point is not that the palaces are unimportant. It is that Rajasthan’s architecture is a continuum, and the everyday buildings explain the monuments better than the monuments explain themselves.',
      },
      {
        type: 'facts',
        title: 'In the story',
        items: [
          { label: 'Where', value: 'Jaipur, India' },
          { label: 'Useful time', value: 'Three days' },
          { label: 'Season', value: 'October to March' },
        ],
      },
    ],
    related: ['a-slower-journey-through-the-italian-countryside', 'new-york-in-layers'],
  },
  {
    slug: 'a-slower-journey-through-the-italian-countryside',
    title: 'A slower journey through the Italian countryside',
    standfirst:
      'Between Florence and the southern hills, Italy rewards the traveller who stops trying to see everything. A guide to the small roads, long lunches and unplanned afternoons.',
    categories: ['Places', 'Guides', 'Experiences'],
    destinationSlug: 'florence',
    image: {
      src: 'story-italy',
      alt: 'Fog lying across Tuscan hills with a hilltop town in the distance',
    },
    issue: 'Issue 03',
    readingMinutes: 8,
    blocks: [
      {
        type: 'paragraph',
        text: 'The classic Italian itinerary is a list of cities. It is easy to understand why: each one is dense with art, food and architecture, and the train will take you from one to the next in an hour or two. But the country’s real texture is between the cities, on the roads that connect them.',
      },
      { type: 'heading', text: 'Leave the city late' },
      {
        type: 'paragraph',
        text: 'The useful habit is to leave in the late morning, after the market, and arrive before dinner. That gives you a day with a shape but no schedule. A hill town in the afternoon is a different place from a hill town at noon: the light softens, the buses leave, and the streets return to the people who live there.',
      },
      {
        type: 'image',
        image: {
          src: 'story-italy-b',
          alt: 'A low farmhouse on a green ridge in the Italian countryside',
        },
      },
      {
        type: 'paragraph',
        text: 'In Tuscany, the pleasure is in the sequence of ridges and cypress lines. In Basilicata, it is the sudden appearance of Matera, a city that looks like the hillside it was cut from. Both reward the same approach: fewer stops, longer stays, and a willingness to take the slower road.',
      },
      {
        type: 'pull',
        text: 'The best afternoon is the one you did not plan, in a town whose name you have already forgotten.',
      },
      { type: 'heading', text: 'Eat where the road ends' },
      {
        type: 'paragraph',
        text: 'The Italian countryside is not a restaurant. The best meals are often found in a village with one trattoria, a short menu and a cook who is not performing. Order the local pasta, the house wine, and whatever is in season. Then stay for coffee. The journey can wait.',
      },
      {
        type: 'facts',
        title: 'A route to borrow',
        items: [
          { label: 'Start', value: 'Florence' },
          { label: 'Suggested', value: 'Six to eight days' },
          { label: 'Move by', value: 'Train, then car' },
        ],
      },
    ],
    related: ['the-quiet-architecture-of-kyoto', 'lisbon-read-in-tiles'],
  },
  {
    slug: 'what-the-icelandic-light-does-to-a-landscape',
    title: 'What the Icelandic light does to a landscape',
    standfirst:
      'In Iceland, the weather is not a backdrop. It is the subject — and the reason the same valley can look like three different places in a single day.',
    categories: ['Nature', 'Places'],
    destinationSlug: 'reykjavik',
    image: {
      src: 'story-iceland',
      alt: 'A braided river running through rust-coloured volcanic highlands',
    },
    issue: 'Issue 04',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'The first thing to understand about Iceland is that the landscape is not stable. Cloud moves across a mountain and changes its colour; rain arrives from a direction you did not expect; the horizon disappears and comes back. Photographers talk about the light, but the more accurate word is weather.',
      },
      {
        type: 'paragraph',
        text: 'This is why the country resists the checklist. A waterfall at noon and the same waterfall at midnight are not the same sight. The useful approach is to choose a small area and return to it, rather than trying to cover the ring road in a week.',
      },
      { type: 'heading', text: 'Scale without reference' },
      {
        type: 'paragraph',
        text: 'Iceland’s highlands are almost empty of the things that usually give a landscape scale. There are no trees to measure a mountain against, no villages on the horizon. A river can look close and turn out to be a kilometre away. The effect is disorienting in a way that is difficult to photograph and impossible to forget.',
      },
      {
        type: 'image',
        image: {
          src: 'story-iceland-b',
          alt: 'A green canyon with a river winding through it',
        },
      },
      {
        type: 'paragraph',
        text: 'Reykjavík is the counterweight: warm rooms, good coffee, public pools. The city makes the landscape usable. You go out into the weather, and then you come back to a place that feels deliberately human.',
      },
      {
        type: 'facts',
        title: 'In the story',
        items: [
          { label: 'Base', value: 'Reykjavík' },
          { label: 'Useful time', value: 'Four to five days' },
          { label: 'Bring', value: 'Weather, not a schedule' },
        ],
      },
    ],
    related: ['the-quiet-architecture-of-kyoto', 'a-slower-journey-through-the-italian-countryside'],
  },
  {
    slug: 'lisbon-read-in-tiles',
    title: 'Lisbon, read in tiles',
    standfirst:
      'Azulejos are usually treated as decoration. In Lisbon, they are a way of understanding the city — its light, its climate and its long conversation with the sea.',
    categories: ['Architecture', 'Culture'],
    destinationSlug: 'lisbon',
    image: {
      src: 'story-lisbon',
      alt: 'A man walking past a facade covered in blue and white azulejos',
    },
    issue: 'Issue 05',
    readingMinutes: 6,
    blocks: [
      {
        type: 'paragraph',
        text: 'A tiled facade is not simply a pretty surface. In a city of strong sun and sudden rain, tiles protect the wall, reflect light and keep the interior cool. Lisbon’s architecture is full of these practical decisions, and the tiles are the most visible example.',
      },
      {
        type: 'paragraph',
        text: 'The patterns range from repeating geometry to full pictorial panels, from blue and white to saturated green and yellow. They are a record of trade, taste and craft, but they are also a record of maintenance: a tiled building that has been repaired over decades looks different from one that has not.',
      },
      { type: 'heading', text: 'Look up, then look again' },
      {
        type: 'paragraph',
        text: 'The best way to read the city is to walk a single neighbourhood slowly and look at the upper storeys. The ground floor is shops and signage; the floors above are where the tiles do their work. Notice how a pattern changes at a corner, or how a plain facade makes the next one feel louder.',
      },
      {
        type: 'image',
        image: {
          src: 'story-lisbon-b',
          alt: 'Ornate azulejo tiles and wrought-iron balconies on a Lisbon building',
        },
      },
      {
        type: 'paragraph',
        text: 'The National Tile Museum is the scholarly version of the same experience, housed in a former convent. It is quiet, unhurried and genuinely instructive. Go there first, then walk Alfama with better eyes.',
      },
      {
        type: 'facts',
        title: 'In the story',
        items: [
          { label: 'Where', value: 'Lisbon, Portugal' },
          { label: 'Useful time', value: 'Three days' },
          { label: 'Look for', value: 'Upper storeys' },
        ],
      },
    ],
    related: ['the-quiet-architecture-of-kyoto', 'beyond-the-palaces-of-rajasthan'],
  },
  {
    slug: 'new-york-in-layers',
    title: 'New York in layers',
    standfirst:
      'The skyline is the least interesting thing about New York. At street level, the city is a stack of decisions — and every block tells you which era made it.',
    categories: ['Places', 'Experiences'],
    destinationSlug: 'new-york',
    image: {
      src: 'story-new-york',
      alt: 'A sunlit row of brownstone houses with iron stoops',
    },
    issue: 'Issue 06',
    readingMinutes: 7,
    blocks: [
      {
        type: 'paragraph',
        text: 'New York is usually approached as a skyline, which is a bit like approaching a library by looking at its roof. The city’s real character is in the street wall: the height of the buildings, the rhythm of the doors, the material of the pavement, the way one block gives way to another.',
      },
      {
        type: 'paragraph',
        text: 'The grid promised uniformity, but the city has spent two centuries interrupting it. A diagonal avenue, a former railway, a patch of low-rise houses, a harbour edge — each exception creates a neighbourhood with its own logic.',
      },
      { type: 'heading', text: 'Read the block' },
      {
        type: 'paragraph',
        text: 'Start with the buildings themselves. A brownstone stoop is a social architecture: a few steps that lift the front door above the street and create a place to sit. Cast iron imitates stone; glass ignores both. The skyline changes, but the street wall accumulates.',
      },
      {
        type: 'image',
        image: {
          src: 'story-new-york-b',
          alt: 'Brownstone facades and fire escapes in afternoon light',
        },
      },
      {
        type: 'paragraph',
        text: 'The useful itinerary is short: one bridge, one museum, one neighbourhood, one long walk. Leave room for the city to interrupt. The best New York moments are usually the ones that were not on the list — a conversation on a stoop, a shop that has been there for forty years, a view at the end of a street you did not plan to take.',
      },
      {
        type: 'pull',
        text: 'The skyline is the headline. The street wall is the story.',
      },
      {
        type: 'facts',
        title: 'In the story',
        items: [
          { label: 'Where', value: 'New York City' },
          { label: 'Useful time', value: 'Four days' },
          { label: 'Strategy', value: 'One neighbourhood a day' },
        ],
      },
    ],
    related: ['lisbon-read-in-tiles', 'the-quiet-architecture-of-kyoto'],
  },
];

export const storyBySlug = Object.fromEntries(stories.map((story) => [story.slug, story])) as Record<
  string,
  Story | undefined
>;
