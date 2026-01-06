import { DialogueNode } from '../types/game';

// Generic trees based on category or relation
export const DIALOGUE_TREES: Record<string, DialogueNode> = {
    // --- INTRO / LOW REL ---
    'root_low_rel': {
        id: 'root_low_rel',
        text: "Hey, what's up?",
        options: [
            { text: "Just busy with studies.", nextId: 'study_talk', effect: { rel: 2 } },
            { text: "Nothing much, just chilling.", nextId: 'chill_talk', effect: { rel: 1 } },
            { text: "Actually, I needed help.", nextId: 'help_request', req: { minRel: 10 } }
        ]
    },
    'study_talk': {
        id: 'study_talk',
        text: "Tell me about it. This semester is brutal.",
        options: [
            { text: "Yeah, assignments piling up.", nextId: null, effect: { rel: 3 } },
            { text: "I'm sure we'll survive.", nextId: null, effect: { rel: 2 } }
        ]
    },
    'chill_talk': {
        id: 'chill_talk',
        text: "Nice. Sometimes you just need a break.",
        options: [
            { text: "Exactly.", nextId: null, effect: { rel: 1 } }
        ]
    },

    // --- HIGH REL / ROMANCE ---
    'root_high_rel': {
        id: 'root_high_rel',
        text: "Hey! I was just thinking about you. Want to hang out?",
        options: [
            { text: "I'd love to! (Flirt)", nextId: 'flirt_response', effect: { rel: 5 } },
            { text: "Maybe later.", nextId: null },
            { text: "Actually, I have a question.", nextId: 'deep_talk' }
        ]
    },
    'flirt_response': {
        id: 'flirt_response',
        text: "*Blushes* Oh, really? That makes my day.",
        options: [
            { text: "You're cute when you blush.", nextId: 'romance_outcome', effect: { rel: 10, sanity: 5 } },
            { text: "See you around.", nextId: null }
        ]
    },
    'romance_outcome': {
        id: 'romance_outcome',
        text: "Stop it... (Smiles) Message me later?",
        options: [
            { text: "Definitely.", nextId: null }
        ]
    },

    // --- LGBT Specific / Deep Talk ---
    'deep_talk': {
        id: 'deep_talk',
        text: "Go ahead, I'm listening.",
        options: [
            { text: "It's hard finding the right person here.", nextId: 'lgbt_support', effect: { rel: 5 } },
            { text: "Do you think I should pursue my passion?", nextId: 'passion_talk', effect: { rel: 5 } }
        ]
    },
    'lgbt_support': {
        id: 'lgbt_support',
        text: "I get that. Love is complicated, no matter who you are. (Smiles warmly) You deserve someone who appreciates you properly.",
        options: [
            { text: "Thanks for understanding.", nextId: null, effect: { rel: 10, sanity: 5 } }
        ]
    }
};
