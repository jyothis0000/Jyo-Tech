// Bunny AI Assistant 1.0.0 as a desk diorama. Pure truth: commands, replies, timings, readout text.
// Sources (read-only): AI Launcher/ROADMAP.md, PRIVACY.md, src/features/assistant/actions.ts,
// src-tauri/src/actions.rs (reply wording), src/features/settings/theme.ts (Lavender & Mint glow).
//
// Parts (real parts, grouped):
// desk      top slab, 4 feet, groove, 4 corner screws, desk mat, label plate engraved "Bunny 1.0.0"
// monitor   stand foot, neck plate + 2 screws, neck, cable clip, case, top vents, bezel recess, glass,
//           side port with the video plug
// taskbar   ledge floor, front lip, 2 end caps, 2 cheek brackets, start tile, search, 5 pinned icons,
//           3 tray icons, clock
// screen    3 desktop icons, an app window (title bar, 3 caption buttons, sidebar, picture, text) whose
//           theme follows dark mode and whose desktop dims with brightness, chat panel, header (avatar,
//           title), divider, user bubble, reply bubble + tick, input field, cursor, send button,
//           reminder bubble with Join and Snooze buttons
// mouse     pad with stitched edge, shell, button seams, wheel slot, wheel
// Bunny     torso, 2 long ears (the right tip bent over) with inner panels, status light (a glass bead
//           and glow at each inner-ear tip), head, front rim, 2 eyes + iris shine + 4 sparkles, nose,
//           philtrum, mouth, 2 blush, 4 whiskers + pores, 2 front paws with toe grooves
// PC        4 feet, case, front bezel, side panel, 2 thumb screws, power button + ring, activity LED,
//           cartridge slot, model cartridge (body, label plate, grip ribs), eject button, front vents,
//           top vents, side vents, network port, dust cap, pull tab, tether, rivet, front port
// keyboard  4 feet, base, key well, 2 screws, 59 keys (Alt and Space press)
// deck      plinth, body, panel groove, 4 screws, 3 toggles (nut, collar, lever, ball, state dot,
//           label plate), 2 sliders (slot, knob, ruler strip with ticks), lock key, side port
// cables    monitor-to-PC video cable with plug, deck-to-PC cable with two plugs

export type Control = 'bluetooth' | 'volume' | 'dark' | 'brightness' | 'wifi'

export interface Settings {
  bluetooth: boolean
  wifi: boolean
  dark: boolean
  volume: number
  brightness: number
}

export interface Ask {
  control: Control
  said: string
  reply: string
  readout: string
  spoken: string
  next: Settings
}

export const MODEL = 'Qwen2.5 1.5B'
export const DOWNLOAD = '1.1 GB'
export const VERSION = '1.0.0'
export const MEETING_LEAD = 30
export const SNOOZE = 5

// The order the tour and the arrow keys walk. Index SLOTS.length is the meeting reminder.
export const SLOTS: Control[] = ['bluetooth', 'volume', 'dark', 'brightness', 'wifi']
export const REMINDER = SLOTS.length
export const STOPS = SLOTS.length + 1

export const START: Settings = { bluetooth: false, wifi: true, dark: false, volume: 70, brightness: 40 }
export const TOGGLES = ['bluetooth', 'wifi', 'dark'] as const
export const SLIDERS = ['volume', 'brightness'] as const

// One command per message, matched by fixed rules: each slot asks for whatever changes its setting.
export function askFor(control: Control, now: Settings): Ask {
  const next = { ...now }
  if (control === 'bluetooth') {
    next.bluetooth = !now.bluetooth
    const state = next.bluetooth ? 'on' : 'off'
    return { control, said: `turn ${state} bluetooth`, reply: `Bluetooth is ${state}.`, readout: `bluetooth ${state} · ran on this PC`, spoken: `Bluetooth turned ${state}`, next }
  }
  if (control === 'wifi') {
    next.wifi = !now.wifi
    const state = next.wifi ? 'on' : 'off'
    return { control, said: `turn ${state} wi-fi`, reply: `Wi-Fi is ${state}.`, readout: `wi-fi ${state} · ran on this PC`, spoken: `Wi-Fi turned ${state}`, next }
  }
  if (control === 'dark') {
    next.dark = !now.dark
    const mode = next.dark ? 'dark' : 'light'
    return { control, said: `${mode} mode`, reply: `Switched to ${mode} mode.`, readout: `${mode} mode · ran on this PC`, spoken: `Switched to ${mode} mode`, next }
  }
  const pair = control === 'volume' ? [40, 70] : [70, 40]
  const value = now[control] === pair[0] ? pair[1]! : pair[0]!
  next[control] = value
  const name = control === 'volume' ? 'Volume' : 'Brightness'
  return { control, said: `${control} ${value}%`, reply: `${name} set to ${value}%.`, readout: `${control} ${value}% · nothing sent`, spoken: `${name} set to ${value} percent`, next }
}

export const READY = `ready · ${MODEL} on this PC`
export const REMIND_READOUT = `reminder · meeting in ${MEETING_LEAD} min`
export const REMIND_SPOKEN = `Reminder: a meeting starts in ${MEETING_LEAD} minutes`

// One ask, in seconds from the moment it starts. Alt+Space dips, the chat opens and types,
// Enter sends it, the rule runs on the PC, the setting moves, the reply lands, the chat closes.
export const TYPE_AT = 0.55
export const PER_CHAR = 0.068
export const SEND_PAUSE = 0.3
export const MOVE_FOR = 0.75
export const HOLD = 3.2
export const CLOSE_FOR = 0.32
export const REMIND_FOR = 4.6

export interface Beat {
  keys: number
  open: number
  typed: number
  sent: number
  running: number
  move: number
  reply: number
  done: boolean
}

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value))
export const smooth = (t: number) => {
  const u = clamp(t)
  return u * u * (3 - 2 * u)
}

export const sendAt = (said: string) => TYPE_AT + said.length * PER_CHAR + SEND_PAUSE
export const askLength = (said: string) => sendAt(said) + 0.15 + MOVE_FOR + HOLD + CLOSE_FOR
// The stretch Escape skips: from a moment after the reply lands to the start of the close.
export const holdOf = (said: string) => [sendAt(said) + 0.15 + MOVE_FOR + 0.6, sendAt(said) + 0.15 + MOVE_FOR + HOLD] as const

export function beatOf(said: string, t: number, keep = false): Beat {
  const send = sendAt(said)
  const end = send + 0.15 + MOVE_FOR + HOLD
  const keys = smooth(t / 0.09) * (1 - smooth((t - 0.22) / 0.14))
  const opened = smooth((t - 0.12) / 0.3)
  const closing = keep ? 0 : smooth((t - end) / CLOSE_FOR)
  return {
    keys,
    open: opened * (1 - closing),
    typed: t < send ? clamp(Math.floor((t - TYPE_AT) / PER_CHAR) + 1, 0, said.length) : 0,
    sent: smooth((t - send) / 0.16),
    running: t >= send && t < send + 0.15 + MOVE_FOR + 0.1 ? 1 : 0,
    move: smooth((t - send - 0.15) / MOVE_FOR),
    reply: smooth((t - send - 0.15 - MOVE_FOR) / 0.18),
    done: t >= end + CLOSE_FOR,
  }
}

export function reminderOf(t: number, keep = false) {
  const show = smooth(t / 0.35) * (keep ? 1 : 1 - smooth((t - REMIND_FOR + 0.35) / 0.35))
  return { show, done: !keep && t >= REMIND_FOR }
}
