// Web Audio API, Haptic Feedback & Sweet Venezuelan Female Voice Synthesis Engine
class SoundEngine {
  private ctx: AudioContext | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private pendingSpeakTimer: ReturnType<typeof setTimeout> | null = null;
  private unlocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.initVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }

      // Auto-unlock audio & speechSynthesis on first user interaction
      const unlockOnce = () => {
        this.unlock();
      };
      window.addEventListener('pointerdown', unlockOnce, { passive: true, once: true });
      window.addEventListener('touchstart', unlockOnce, { passive: true, once: true });
      window.addEventListener('keydown', unlockOnce, { passive: true, once: true });
    }
  }

  private initVoices(): SpeechSynthesisVoice[] {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const list = window.speechSynthesis.getVoices() || [];
        if (list.length > 0) {
          this.cachedVoices = list;
        }
        return this.cachedVoices;
      }
    } catch {
      // ignore
    }
    return this.cachedVoices;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pre-unlock audio & TTS voices on user gesture
  unlock() {
    try {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.initVoices();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        // Prime speechSynthesis engine silently once on first gesture (fixes Android WebView & Chrome silent TTS)
        if (!this.unlocked) {
          this.unlocked = true;
          try {
            const silentPrimer = new SpeechSynthesisUtterance(' ');
            silentPrimer.volume = 0;
            silentPrimer.rate = 10;
            silentPrimer.lang = 'es-VE';
            window.speechSynthesis.speak(silentPrimer);
          } catch {
            // ignore primer errors
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Trigger gentle haptic vibration
  vibrate(pattern: number | number[] = 50) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored if unsupported
      }
    }
  }

  // Positive state advancement chime (e.g. Llegado, Paquete recibido)
  playAdvanceChime() {
    this.vibrate([40, 50, 40]);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio may be blocked until user interaction
    }
  }

  // Triumphant delivery completion sound
  playCompleteDelivery() {
    this.vibrate([80, 50, 120]);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.42);
      });
    } catch {
      // Handled
    }
  }

  // Incoming order alert chime with vibration
  playNewOrderAlert() {
    try {
      this.vibrate([100, 50, 100, 50, 150]);
      const ctx = this.getContext();
      if (!ctx || ctx.state === 'closed') return;

      const now = ctx.currentTime;
      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6
      freqs.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = Math.max(now, 0.01) + idx * 0.12;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.18, start);
          gain.gain.linearRampToValueAtTime(0.0001, start + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + 0.32);
        } catch {
          // Ignore individual oscillator error
        }
      });
    } catch (e) {
      console.warn('Silent audio fallback for alert chime:', e);
    }
  }

  // Soft notification / click sound
  playNotification() {
    this.vibrate(35);
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Handled
    }
  }

  private selectVenezuelanFemaleVoice(): SpeechSynthesisVoice | undefined {
    const voices = this.initVoices();
    if (!voices || voices.length === 0) return undefined;

    const isMaleVoiceName = (name: string) =>
      /\b(jorge|diego|carlos|miguel|pablo|raul|raúl|enrique|alvaro|álvaro|tomas|tomás|mateo|juan|pedro|male|hombre|enrico)\b/i.test(
        name
      );

    const isFemaleHint = (name: string) =>
      /\b(female|mujer|paola|salome|salomé|camila|sofia|sofía|paulina|sabina|monica|mónica|helena|laura|lucia|lucía|mia|rosa|paloma|penelope|penélope|elena|valeria|isabela|andrea|mariana|carolina|google español de estados unidos|natural)\b/i.test(
        name
      );

    // 1. Prioridad absoluta: Español de Venezuela (es-VE) femenino
    const veFemale = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return (
        (lang === 'es-ve' || lang.startsWith('es-ve') || name.includes('venezuela')) &&
        !isMaleVoiceName(name)
      );
    });
    if (veFemale) return veFemale;

    // 2. Prioridad: Voces femeninas caribeñas / latinoamericanas cercanas al acento venezolano
    const latinFemale = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const isSpanish = lang.startsWith('es');
      const isWarmLatam =
        lang.includes('co') ||
        lang.includes('pa') ||
        lang.includes('pr') ||
        lang.includes('do') ||
        lang.includes('419') ||
        lang.includes('us') ||
        lang.includes('mx');
      return isSpanish && isWarmLatam && !isMaleVoiceName(name) && (isFemaleHint(name) || !name.includes('male'));
    });
    if (latinFemale) return latinFemale;

    // 3. Cualquier voz femenina en español
    const anySpanishFemale = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang.startsWith('es') && !isMaleVoiceName(name);
    });
    if (anySpanishFemale) return anySpanishFemale;

    // 4. Fallback a cualquier voz en español
    return voices.find((v) => (v.lang || '').toLowerCase().startsWith('es'));
  }

  /**
   * Voz Femenina Dulce en Español Venezolano / Latino
   * Evita el race condition de `cancel()` síncrono en Chrome/Android WebView y mantiene referencia activa al utterance.
   */
  speakVenezuelanSweetVoice(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const now = Date.now();
    if (this.lastSpokenText === text && now - this.lastSpokenTime < 900) {
      if (onEnd) onEnd();
      return;
    }
    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    if (this.pendingSpeakTimer) {
      clearTimeout(this.pendingSpeakTimer);
      this.pendingSpeakTimer = null;
    }

    const runSpeak = () => {
      try {
        const synth = window.speechSynthesis;
        if (synth.paused) {
          synth.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.96; // Pausado, cálido y natural
        utterance.pitch = 1.18; // Tono femenino dulce venezolano
        utterance.volume = 1.0;

        const selectedVoice = this.selectVenezuelanFemaleVoice();
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'es-VE';
        } else {
          utterance.lang = 'es-VE';
        }

        utterance.onend = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };

        // Keep strong reference to prevent Chrome GC mid-speech
        this.currentUtterance = utterance;
        synth.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
        if (onEnd) onEnd();
      }
    };

    try {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // Wait 60ms after cancel so Chromium/Android doesn't drop the new utterance
        this.pendingSpeakTimer = setTimeout(runSpeak, 60);
      } else {
        runSpeak();
      }
    } catch {
      runSpeak();
    }
  }

  // Alias compatible
  speakFemaleVoice(text: string, onEnd?: () => void) {
    this.speakVenezuelanSweetVoice(text, onEnd);
  }

  // Prueba directa de la voz femenina venezolana
  speakVoiceSample() {
    this.lastSpokenText = '';
    this.speakVenezuelanSweetVoice(
      '¡Hola mi amor! Soy tu asistente de Go Delivery desde Ciudad Guayana. Qué alegría escucharte, ¡estamos listos para rodar!'
    );
  }

  // Bienvenida al abrir o completar registro
  speakWelcomeGreeting(name?: string) {
    const firstName = name?.trim().split(' ')[0];
    const msg = firstName
      ? `¡Bienvenido a Go Delivery, ${firstName}! Qué chévere tenerte con nosotros en Ciudad Guayana.`
      : '¡Hola corazón! Bienvenido a Go Delivery. Todo está listo para comenzar.';
    this.speakVenezuelanSweetVoice(msg);
  }

  // Aviso cuando se envía el código SMS
  speakSmsCodeSent() {
    this.speakVenezuelanSweetVoice(
      '¡Listo mi pana! Te enviamos tu código de confirmación por mensaje de texto. Revísalo e ingrésalo para entrar.'
    );
  }

  // Indicaciones dulces por fase
  speakPhase1() {
    this.speakVenezuelanSweetVoice(
      '¡Hola corazón! Dirígete al comercio para retirar el paquete. ¡Maneja con mucha precaución!'
    );
  }

  speakPhase2() {
    this.speakVenezuelanSweetVoice(
      '¡Listo mi amor! Chequea los datos del cliente y confirma el paquete para iniciar la ruta.'
    );
  }

  speakPhase3() {
    this.speakVenezuelanSweetVoice(
      '¡Vamos en ruta mi pana! Vas directo al destino del cliente. Puedes usar Google Maps o Waze para guiarte en tiempo real.'
    );
  }

  speakPhase4() {
    this.speakVenezuelanSweetVoice(
      '¡Llegaste a la ubicación! Pídele el código PIN de cuatro dígitos al cliente para completar la entrega.'
    );
  }

  speakOrderSuccess() {
    this.speakVenezuelanSweetVoice(
      '¡Buenísimo mi pana! Entrega completada con éxito. ¡Tremendo trabajo!'
    );
  }

  speakOnlineStatus(isOnline: boolean) {
    if (isOnline) {
      this.speakVenezuelanSweetVoice('¡Conectado mi pana! Lista para recibir nuevos pedidos.');
    } else {
      this.speakVenezuelanSweetVoice('Turno pausado por ahora. Tómate un descanso, corazón.');
    }
  }
}

export const soundEngine = new SoundEngine();
