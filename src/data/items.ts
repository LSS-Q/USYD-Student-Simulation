import { InventoryItem } from '../types/game';

export const CONSUMABLES: Record<string, InventoryItem> = {
    'coffee': {
        id: 'coffee',
        name: 'Flat White',
        price: 6,
        description: 'A smooth Australian classic. (+1 AP, -5 Sanity)',
        category: 'consumable',
        effect: { ap: 1, sanity: -5 }
    },
    'energy_drink': {
        id: 'energy_drink',
        name: 'V Energy Drink',
        price: 12,
        description: 'Instant caffeine hit. (+3 AP, -10 Health, -5 Sanity)',
        category: 'consumable',
        effect: { ap: 3, health: -10, sanity: -5 }
    }
};

export const GIFT_ITEMS: Record<string, InventoryItem> = {
    'textbook': {
        id: 'textbook',
        name: 'Academic Textbook',
        price: 80,
        description: 'A heavy tome on advanced algorithms.',
        category: 'gift',
        tags: ['academic']
    },
    'flowers': {
        id: 'flowers',
        name: 'Fresh Flowers',
        price: 50,
        description: 'A beautiful bouquet from the market.',
        category: 'gift',
        tags: ['romance', 'nature']
    },
    'coffee_beans': {
        id: 'coffee_beans',
        name: 'Single Origin Beans',
        price: 40,
        description: 'Premium beans from a local roaster.',
        category: 'gift',
        tags: ['lifestyle', 'coffee']
    },
    'tech_gadget': {
        id: 'tech_gadget',
        name: 'USB-C Hub',
        price: 60,
        description: 'Essential for any tech lover.',
        category: 'gift',
        tags: ['tech', 'utility']
    },
    'luxury_watch': {
        id: 'luxury_watch',
        name: 'Designer Watch',
        price: 500,
        description: 'A status symbol.',
        category: 'gift',
        tags: ['luxury']
    }
};

export const ALL_ITEMS = { ...CONSUMABLES, ...GIFT_ITEMS };
