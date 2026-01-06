import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { REAL_TIME_EVENTS } from '../../data/realTimeEvents';
import { SoundManager } from '../../utils/SoundManager';
import { Bell } from 'lucide-react';

const TIMER_INTERVAL = 60000; // Check every 60s
const TRIGGER_CHANCE = 0.4; // 40% chance

export const GameClock: React.FC = () => {
    const { addLog } = useGameStore();

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() < TRIGGER_CHANCE) {
                triggerEvent();
            }
        }, TIMER_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const triggerEvent = () => {
        const event = REAL_TIME_EVENTS[Math.floor(Math.random() * REAL_TIME_EVENTS.length)];
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add to log
        addLog(`[${timestamp}] ${event}`);

        // Play sound
        SoundManager.playSuccess(); // Or specific notification sound

        // Optional: Show Toast (Currently just using Log)
    };

    return null; // Invisible component
};
