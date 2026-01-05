import { RegionConfig, RegionType } from '../types/game';

export const REGIONS: Record<RegionType, RegionConfig> = {
    city: {
        id: 'city',
        label: 'City CBD',
        rentModifier: 1.5,
        sanityModifier: 2,
        security: 'medium',
        desc: 'Everything is close. High rent, high energy, constant noise.'
    },
    eastern_suburbs: {
        id: 'eastern_suburbs',
        label: 'Eastern Suburbs (Kingsford)',
        rentModifier: 1.2,
        sanityModifier: 1,
        security: 'high',
        desc: 'Student central. Walk to uni, safe streets, bubble tea everywhere.'
    },
    inner_west: {
        id: 'inner_west',
        label: 'Inner West (Burwood)',
        rentModifier: 1.0,
        sanityModifier: 2,
        security: 'medium',
        desc: 'Foodie paradise. 15 min train to city. Great balance.'
    },
    western_suburbs: {
        id: 'western_suburbs',
        label: 'Western Suburbs (Auburn)',
        rentModifier: 0.7,
        sanityModifier: -3,
        security: 'low',
        desc: 'Cheap rent is the only perk. Long commute, feeling unsafe at night.'
    }
};
