# Design fixes

Changes made to the original Sketch design while building TScreen. Everything else matches the file.

## Requested fixes

1. **Thermostat titles name the right room.** The Upstairs and Basement screens said "Downstairs". Each screen now shows its own room, centered on the card. The original title sat 14px left of center.
2. **One "on" green for every switch: `#28FF00`.** It was `#00FF21` on Goodnight Mode and `#3DFF00` on appliances.
3. **One Stay orange: `#FF6300`.** The Security screen used `#FF5700` for the Stay tile and shields. The Stay shield on the Disarmed frame also had two conflicting color settings.
4. **One off-moon gray: `#7B7B7B`.** Off-light moons ranged from `#909090` to `#B0B0B0` across frames, and one was white. The Goodnight frame's Living Room also used its own dimmer off style; it now uses the standard one.
5. **1–2px offsets removed:**
   - Home photo moved from x 175 to 174. It was leaving a 1px strip of gray placeholder on the left edge.
   - Coffee switch "off" knob: 5px inset in one frame, now 3px like the rest.
   - Vacuum switch: y 693 to 695, level with the Coffee switch.
   - Back Door "on" knob: 22px to 23px, matching Front Door.
   - Cameras / Emergency / Smart Locks row: y 703 to 704 on the Disarmed frame.
   - Garage camera: x 304.86 to 303, aligned with Front Door.
   - Smart Locks title: y 225 to 227, level with the other screen titles.
6. **Duplicate sun icon removed** from the Bedroom 1 light. Two copies were stacked on top of each other.
7. **"Appliances" card title is 28pt** like the other card titles (was 22pt). It stays centered at the same point.

## Left as designed

- The Control Panel gaps between cards stay at 16, 17 and 18px.
- The Cameras title stays at its original height, 9px above the other titles, which gives the camera grid more room.
- The Front Door and Garage camera labels stay about 7px left of their photos' centers.
- The two appliance tiles keep their different title heights (4px apart) and circle sizes (254px and 243px).

## States the design didn't draw

These were needed for a working app and follow the existing style:

- **Thermostat modes:**
  - The Auto tile is a blue-to-orange blend with a thermometer icon.
  - The Off tile is the neutral dark fill with a power icon.
  - A selected Off button is a light neutral, so you can see it's selected.
- **Away** on the Control Panel card uses `#FF0000` for the shield and label.
- **Appliance status** reads "On" when a device is on.
- **New components** in the same glass style:
  - The Emergency confirmation dialog
  - The "Coming soon" tooltip
  - Keyboard focus rings (`#6FD3FF`)
- **Night Home screen:** a moonlit grade on the house photo. The Control Panel's night look (a hue flip) would turn the trees purple.
- **Weather icon** shows a moon instead of the sun at night.
- **The "Tscreen" label** on the bezel works as a Home button.
- **Date and time** use the visitor's real date. The time in the status bar is right-aligned to the design's right edge so it fits any time of day.
