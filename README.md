# TScreen

An interactive smart home control panel, built from the original Sketch design. React + TypeScript + Vite.

![Control Panel](docs/screenshots/02-control-panel.png)

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## What works

- **Home:** tap "Tap for Control Panel" or swipe up. The clock and date follow the time slider.
- **Lights:** all 10 rooms toggle on and off.
- **Thermostats:** each tile opens its room. Up and down change the temperature by 1° (50–90°), and Cool, Warm, Auto and Off are selectable. The Control Panel tiles always show the current temperature and mode.
- **Security:** Disarmed, Stay and Away. The Control Panel card shows the current mode in its color. Cameras and Smart Locks open their screens. Emergency shows a demo confirmation and never calls anyone.
- **Appliances and locks:** every switch works, and the Control Panel shows On/Off to match.
- **Goodnight Mode:** turns every light off, sets security to Stay, and switches to the night look. Turning it off restores the normal look and leaves lights and security as they are.
- **Sky:** the "Morning — Night" slider starts at the visitor's local time and drives the sky, the clock and the night look. At night, lights that are on give the device a warm glow.
- **Home button:** the "Tscreen" label on the bezel returns to the Home screen.
- **Keyboard and screen readers:** everything works with Tab, Enter, Space and Escape, with visible focus rings and labels for screen readers.

## Sky images

Put four images in `public/sky/`, named exactly `morning.jpg`, `afternoon.jpg`, `sunset.jpg` and `night.jpg`. They replace the gradient placeholders automatically, with no code changes. Around 2560×1600 and under 600 KB each works well.

## Deep links

You can open the app on a specific screen and time. This is useful for embedding one view in a case study.

| URL | Opens |
|---|---|
| `?screen=panel` | Control Panel |
| `?screen=security&time=10:30` | Security at 10:30 AM |
| `?screen=panel&time=22:30&goodnight=1` | Goodnight Mode at night |

Valid screens: `home`, `panel`, `thermo-downstairs`, `thermo-upstairs`, `thermo-basement`, `security`, `appliances`, `cameras`, `locks`.

## Design fixes

See [FIXES.md](FIXES.md).

## Project layout

```
src/
  App.tsx              scaling, sky, time slider, night filters
  state/store.tsx      all app state (reducer) and deep links
  lib/time.ts          scene clock, dates, sky stages
  lib/design.ts        shared design values (mode colors, zones)
  components/          device frame, transitions, icons, shared UI
  screens/             Home, Control Panel and the detail screens
  assets/              images exported from the Sketch file
public/sky/            drop the four sky images here
```
