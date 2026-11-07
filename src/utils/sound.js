// SFX без ассетов: короткие звуки синтезируются WebAudio-осцилляторами на лету —
// никакого base64 и ссылок на mp3 (0 КБ в бандле, 0 скачиваний).
// Тихие: громкости 0.04–0.12, ненавязчиво.

export const sound = {
  _muted: false,
  _ctx: null,
  _noise: null,

  enabled() {
    return !this._muted
  },
  setEnabled(on) {
    this._muted = !on
    try { localStorage.setItem('studstorm_sfx', on ? '1' : '0') } catch { /* shortcut: приватный режим — просто не сохраняем */ }
  },
  restore() {
    try { this._muted = localStorage.getItem('studstorm_sfx') === '0' } catch { /* noop */ }
    return !this._muted
  },

  ctx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    if (this._ctx.state === 'suspended') this._ctx.resume()
    return this._ctx
  },

  // одиночный тон с огибающей
  tone({ freq = 440, to = null, type = 'sine', dur = 0.12, vol = 0.08, delay = 0 }) {
    if (this._muted) return
    try {
      const ctx = this.ctx()
      const t = ctx.currentTime + delay
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t)
      if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(vol, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + dur + 0.05)
    } catch { /* shortcut: без звука не падаем (нет AudioContext и т.п.) */ }
  },

  // шумовой «щелчок/шуршание» — буфер белого шума через bandpass
  click(vol = 0.06, dur = 0.06) {
    if (this._muted) return
    try {
      const ctx = this.ctx()
      if (!this._noise) {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate)
        const d = buf.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
        this._noise = buf
      }
      const t = ctx.currentTime
      const src = ctx.createBufferSource()
      src.buffer = this._noise
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 2400
      bp.Q.value = 1.2
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(vol, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      src.connect(bp).connect(gain).connect(ctx.destination)
      src.start(t)
      src.stop(t + dur + 0.02)
    } catch { /* noop */ }
  },

  /* ── четыре события UX ── */

  // переворот: тихое шуршание + мягкий «щёлк»
  flip() {
    this.click(0.05, 0.05)
    this.tone({ freq: 520, to: 720, type: 'sine', dur: 0.07, vol: 0.04 })
  },

  // «Знаю»: короткий приятный pop-свист вверх
  know() {
    this.tone({ freq: 420, to: 880, type: 'sine', dur: 0.16, vol: 0.09 })
    this.tone({ freq: 880, to: 1280, type: 'sine', dur: 0.12, vol: 0.05, delay: 0.08 })
  },

  // «Не знаю»: низкий мягкий спуск
  nah() {
    this.tone({ freq: 220, to: 130, type: 'triangle', dur: 0.22, vol: 0.08 })
  },

  // фанфары + сыпь «монет»: арпеджио и стеклянные искры
  fanfare() {
    const n = (f, d, v = 0.09) => this.tone({ freq: f, type: 'triangle', dur: d, vol: v })
    n(523) // C5
    n(659, 0.14, 0.09) // E5
    n(784, 0.16, 0.1) // G5
    n(1047, 0.3, 0.11) // C6 — финальная
    // сыпь монет:asti короткие высокие искры
    for (let i = 0; i < 7; i++) {
      this.tone({ freq: 1568 + Math.random() * 800, to: 2100, type: 'sine', dur: 0.09, vol: 0.045, delay: 0.35 + i * 0.09 })
    }
  },
}
