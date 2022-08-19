# PC SIMULATION

...or more accurately just a logic circut simulator which simulates a drawn logic circut. In theory it can also simulate a bad pc.



For now you have to start it through an ide or terminal to get component names in console (no UI yet). You also need SDL2 installed, i have no idea how it works on different computers but it works if you have SDL2.dll and SDL2.lib in the same dir as the executable

## Controls:
###  Edit mode:
 - Left arrow/right arrow keys: Cycle through components
 - Middle click: Pick component from canvas
 - Left click: Draw component
 - Right click: Erase component
 - Shift + left click: Select and copy when left click is released
 - Ctrl + v: Pase selection
 - Shift: See selected area
 - Del: Erase selected area
###  Simulation mode:
 - Left click: Toggle latches
 - S: Change simulation speeds (includes pause)
###  Both modes
 - Space: Toggle simulation mode/Edit mode
 - Up arrow/down arrow keys: Zoom
 - Hold middle mouse button and drag: Move canvas

### Logic gates behaviour is normal, with a few specialties:
- Wire reader and wire writerr are for flow control. Readers read from wires into logic gates, while writers do the opposite
- All components that share a side are grouped, meaning 2 wires going into adjacent wire readers will count as 1 input to the logic gate.
- Latches switch their state when powered and have a manual ooverride (click)
- Everything that isn't a wire, wire reader or wire writer counts as a gate so technically you could even output a signal from a light

The program saves your progress in the same dir as the executable
