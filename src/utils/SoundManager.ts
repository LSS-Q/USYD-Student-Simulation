export class SoundManager {
    private static audioContext: AudioContext | null = null;
    private static isMuted: boolean = false;
    private static bgmOscillators: AudioNode[] = [];
    private static isBgmPlaying: boolean = false;

    private static getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    // Short high-pitched beep for UI clicks
    static playClick() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.error('Audio Play Error:', e);
        }
    }

    // Fail / Error sound (Low descending tone)
    static playFail() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(now + 0.3);
        } catch (e) {
            console.error('Audio Play Error', e);
        }
    }

    // Success / Task Complete sound (Ascending major triad)
    static playSuccess() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            [440, 554.37, 659.25].forEach((freq, i) => { // A4, C#5, E5
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth'; // Using sawtooth for retro feel
                osc.frequency.setValueAtTime(freq, now + i * 0.1);

                gain.gain.setValueAtTime(0.05, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.2);
            });
        } catch (e) { }
    }

    // Money sound (Coin high pitch)
    static playMoney() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    }

    // Error / Disabled sound (Low buzzy sound)
    static playError() {
        if (this.isMuted) return;
        try {
            const ctx = this.getContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch (e) { }
    }

    static playBGM() {
        if (this.isBgmPlaying || this.isMuted) return;
        try {
            const ctx = this.getContext();
            if (ctx.state === 'suspended') ctx.resume();

            this.bgmOscillators = [];

            // Drone 1: Low fundamental
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.frequency.value = 55; // A1
            osc1.type = 'sine';
            gain1.gain.value = 0.05;
            osc1.connect(gain1).connect(ctx.destination);
            osc1.start();
            this.bgmOscillators.push(osc1, gain1);

            // Drone 2: Fifth
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.frequency.value = 82.41; // E2
            osc2.type = 'sine';
            gain2.gain.value = 0.03;
            osc2.connect(gain2).connect(ctx.destination);
            osc2.start();
            this.bgmOscillators.push(osc2, gain2);

            // Noise (Simulate Rain/Ambience)
            const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            const noiseGain = ctx.createGain();
            noiseGain.gain.value = 0.02; // Very quiet

            // Lowpass filter to make it sound like rain/wind
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;

            noise.connect(filter).connect(noiseGain).connect(ctx.destination);
            noise.start();

            this.bgmOscillators.push(noise, noiseGain, filter);

            this.isBgmPlaying = true;
        } catch (e) {
            console.error("BGM Error:", e);
        }
    }

    static stopBGM() {
        this.bgmOscillators.forEach(node => {
            try {
                if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
                    node.stop();
                }
                node.disconnect();
            } catch (e) { }
        });
        this.bgmOscillators = [];
        this.isBgmPlaying = false;
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        }
        return this.isMuted;
    }

    static toggleBGM() {
        if (this.isBgmPlaying) {
            this.stopBGM();
        } else {
            this.playBGM();
        }
        return this.isBgmPlaying;
    }

    static getBgmState() {
        return this.isBgmPlaying;
    }
}
