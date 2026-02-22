# Hunt: Showdown 1896 - Interactive Map

Track your progress during matches with this interactive map tool.

## Features

- **Multiple maps**: Switch between different <i>Hunt: Showdown 1896</i> maps
- **Click to mark POIs**: Click any marker to grey it out when you've cleared it
- **Spawn selection**: Click your spawn point to:
  - Highlight your spawn location 
  - Show only the 6 closest spawn points
- **Match reset**: Clear all progress when starting a new match
- **Compound Names**: Toggle location names on/off
- **POI filters**: Show/hide different marker types (workbenches, towers, spawns, etc.)
- **Language**: Switch between Spanish and English
- **Auto-Fit**: Map automatically fits your screen resolution
- **Fit button**: Manually re-adjust map to screen with one click
- **Drawing tools**:
  - Freehand drawing
  - Measure line with distance label 
  - Place 150m radius circumference to show Darksight range
  - Eraser tool
  - Undo last drawing and clear all drawings

## How to Use

### Running the Map
**Run locally**
1. Open terminal in the project folder
2. Run: `python -m http.server 8080`
3. Open browser: `http://localhost:8080`

**Deployed in GitHub pages**<br>
[Hunt Showdown map in GitHub pages](https://nietovictor.github.io/Hunt-Showdown-Interactive-Map/)

### During a Match

1. **Select your map** using the buttons at the left
2. **Click your spawn point** - it will turn white and show the 6 nearest spawns
3. **Click the same spawn again** to restore all spawn markers
4. **Click markers** as you clear areas - they turn grey
5. **Use drawing tools** for planning routes, ranges, and rotations
6. **Start new match**: Click "Reset match" button to clear markers and active spawn selection

### Controls

- **Zoom**: Use +/- buttons (bottom-left) or mouse wheel
- **Fit map**: Click the square icon to fit map to your screen
- **Legend**: Toggle sidebar to filter marker types
- **Language**: Switch between EN/ES in top-right corner
- **Drawing**:
  - **Freehand**: Draw custom paths in red
  - **Line**: Draw straight line and see distance in meters
  - **Circle 150m**: Place a 150m radius circle
  - **Eraser**: Click near a drawing to remove it
  - **Undo/Clear**: Remove the last drawing or clean all drawings on current map

## Customization

- **Add maps**: Edit `data/poiData.json`
- **Change marker colors**: Edit `data/poiIcons.json`
- **Adjust styling**: Edit `css/styles.css`
- **Translations**: Edit `js/translations.js`
