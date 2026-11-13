import type { Trip } from '@/data/types';

/**
 * Two sample journeys. They are ordinary editable trips, seeded once on a
 * first visit so the planner is useful before the visitor has built anything.
 */
export const sampleTrips: Trip[] = [
  {
    id: 'sample-tuscany',
    title: 'Seven days through Tuscany',
    description:
      'A slow week based in Florence, with long lunches, one museum a day and the hills at the end of the line.',
    startDate: '2027-04-12',
    endDate: '2027-04-18',
    destinationSlugs: ['florence'],
    sample: true,
    days: [
      {
        id: 'tuscany-d1',
        title: 'Arrive and take the long way',
        activities: [
          {
            id: 'tuscany-a1',
            title: 'Arrive in Florence',
            note: 'Drop bags in Oltrarno, then walk without a plan until dinner.',
            time: '14:00',
            kind: 'travel',
          },
          {
            id: 'tuscany-a2',
            title: 'Evening in Santo Spirito',
            note: 'Aperitivo in the square, then something simple and local.',
            time: '19:30',
            kind: 'food',
            cost: 35,
          },
        ],
      },
      {
        id: 'tuscany-d2',
        title: 'One collection, properly',
        activities: [
          {
            id: 'tuscany-a3',
            title: 'Uffizi Gallery',
            note: 'Booked for the opening slot; choose a handful of rooms.',
            time: '09:00',
            kind: 'place',
            cost: 25,
            link: 'https://www.uffizi.it/en',
          },
          {
            id: 'tuscany-a4',
            title: 'Lunch near Santa Croce',
            time: '13:30',
            kind: 'food',
            cost: 20,
          },
          {
            id: 'tuscany-a5',
            title: 'Walk the Oltrarno workshops',
            note: 'Cross the river and follow the side streets south of the bridge.',
            time: '16:30',
            kind: 'walk',
          },
        ],
      },
      {
        id: 'tuscany-d3',
        title: 'The dome and the market',
        activities: [
          {
            id: 'tuscany-a6',
            title: 'Climb the Duomo',
            note: 'Early slot; the stairs are narrow and worth it.',
            time: '08:30',
            kind: 'place',
            cost: 30,
          },
          {
            id: 'tuscany-a7',
            title: 'Mercato Centrale',
            note: 'Produce upstairs, lunch downstairs.',
            time: '12:00',
            kind: 'food',
            cost: 15,
          },
        ],
      },
      {
        id: 'tuscany-d4',
        title: 'Above the city',
        activities: [
          {
            id: 'tuscany-a8',
            title: 'San Miniato al Monte',
            note: 'Walk up through the gardens; stay for the view back across the Arno.',
            time: '10:00',
            kind: 'place',
          },
          {
            id: 'tuscany-a9',
            title: 'Ponte Vecchio at dusk',
            time: '19:00',
            kind: 'walk',
          },
        ],
      },
      {
        id: 'tuscany-d5',
        title: 'A day in the hills',
        activities: [
          {
            id: 'tuscany-a10',
            title: 'Train to Fiesole',
            note: 'A short ride, then a slow walk back down towards the city.',
            time: '09:30',
            kind: 'travel',
            cost: 6,
          },
          {
            id: 'tuscany-a11',
            title: 'Long lunch with a view',
            time: '13:00',
            kind: 'food',
            cost: 40,
          },
        ],
      },
      {
        id: 'tuscany-d6',
        title: 'Nothing in particular',
        activities: [
          {
            id: 'tuscany-a12',
            title: 'A market morning',
            note: 'Buy bread, cheese and fruit for a picnic.',
            time: '09:00',
            kind: 'food',
            cost: 15,
          },
          {
            id: 'tuscany-a13',
            title: 'Read in the Boboli Gardens',
            time: '14:00',
            kind: 'walk',
            cost: 10,
          },
        ],
      },
      {
        id: 'tuscany-d7',
        title: 'Depart',
        activities: [
          {
            id: 'tuscany-a14',
            title: 'Slow breakfast, then the train',
            time: '09:00',
            kind: 'travel',
          },
        ],
      },
    ],
  },
  {
    id: 'sample-lisbon',
    title: 'A long weekend in Lisbon',
    description: 'Three full days of tiles, hills, trams and the long light at the end of the river.',
    startDate: '2027-05-07',
    endDate: '2027-05-10',
    destinationSlugs: ['lisbon'],
    sample: true,
    days: [
      {
        id: 'lisbon-d1',
        title: 'Arrive and find a viewpoint',
        activities: [
          {
            id: 'lisbon-a1',
            title: 'Check in around Alfama',
            time: '15:00',
            kind: 'travel',
          },
          {
            id: 'lisbon-a2',
            title: 'Sunset at Miradouro da Graça',
            note: 'Bring something to drink and stay until the light goes.',
            time: '19:00',
            kind: 'walk',
          },
        ],
      },
      {
        id: 'lisbon-d2',
        title: 'Tiles and the old city',
        activities: [
          {
            id: 'lisbon-a3',
            title: 'National Tile Museum',
            time: '10:00',
            kind: 'place',
            cost: 8,
          },
          {
            id: 'lisbon-a4',
            title: 'Lunch in Alfama',
            time: '13:00',
            kind: 'food',
            cost: 20,
          },
          {
            id: 'lisbon-a5',
            title: 'Walk down to the river',
            note: 'Take the stairs rather than the tram; the streets are the point.',
            time: '16:00',
            kind: 'walk',
          },
        ],
      },
      {
        id: 'lisbon-d3',
        title: 'West along the water',
        activities: [
          {
            id: 'lisbon-a6',
            title: 'LX Factory',
            note: 'Bookshops, coffee and lunch under the bridge.',
            time: '11:00',
            kind: 'food',
            cost: 20,
          },
          {
            id: 'lisbon-a7',
            title: 'Gulbenkian Museum',
            time: '15:00',
            kind: 'place',
            cost: 10,
          },
        ],
      },
      {
        id: 'lisbon-d4',
        title: 'One last coffee',
        activities: [
          {
            id: 'lisbon-a8',
            title: 'Praça do Comércio at sunrise',
            note: 'The city is quiet and the river is silver.',
            time: '07:30',
            kind: 'walk',
          },
        ],
      },
    ],
  },
];
