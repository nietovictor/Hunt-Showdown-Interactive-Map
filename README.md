# Hunt: Showdown 1896 - Interactive Map

Track your progress during matches with this interactive map tool.

## Features

- **Multiple maps**: Switch between different <i>Hunt: Showdown 1896</i> maps
- **Click to mark POIs**: Click any marker to grey it out when you've cleared it
- **Spawn selection**: Click your spawn point to:
  - Highlight your spawn location 
  - Show only the 4 closest spawn points
- **Match reset**: Clear all progress when starting a new match
- **Compound Names**: Toggle location names on/off
- **POI filters**: Show/hide different marker types (workbenches, towers, spawns, etc.)
- **Language**: Switch between Spanish and English
- **Auto-Fit**: Map automatically fits your screen resolution
- **Fit button**: Manually re-adjust map to screen with one click
- **Persistent settings**: Your preferences are saved automatically

## How to Use

### Running the Map
**Run localy**
1. Open terminal in the project folder
2. Run: `python -m http.server 8080`
3. Open browser: `http://localhost:8080`

**Deployed in GitHub pages**<br>
[Hunt Showdown map in GitHub pages](https://nietovictor.github.io/Hunt-Showdown-Interactive-Map/)

### During a Match

1. **Select your map** using the buttons at the top
2. **Click your spawn point** - it will turn white and show nearby spawns
3. **Click markers** as you clear areas - they turn grey
4. **Start new match**: Click "Reset markers" button to clear everything

### Controls

- **Zoom**: Use +/- buttons (bottom-left) or mouse wheel
- **Fit map**: Click the square icon to fit map to your screen
- **Legend**: Toggle sidebar to filter marker types
- **Language**: Switch between EN/ES in top-right corner

## Customization

- **Add maps**: Edit `data/poiData.json`
- **Change marker colors**: Edit `data/poiIcons.json`
- **Adjust styling**: Edit `css/styles.css`
- **Translations**: Edit `js/translations.js`
