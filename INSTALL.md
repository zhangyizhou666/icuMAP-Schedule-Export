# Installation Guide

## Quick Start

### 1. Load the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the `download_button` folder
6. The Timetable Exporter extension will appear in your extensions list

### 2. Pin the Extension (Optional)

1. Click the puzzle piece icon 🧩 in Chrome's toolbar
2. Find "Timetable Exporter" in the list
3. Click the pin icon 📌 to keep it visible in your toolbar

### 3. Using the Extension

1. Go to your university timetable page (the page with `ctl00_ContentPlaceHolder1_uc_registration_result_grv_reg` table)
2. Click the Timetable Exporter extension icon
3. The extension will automatically:
   - Extract your courses
   - Detect the semester (e.g., "2025 AUTUMN")
   - Set appropriate start and end dates
4. Review the extracted courses and dates in the popup
5. Manually adjust dates if needed (overrides auto-detection)
6. Click **Export to Calendar (.ics)**
7. Choose where to save the `.ics` file
8. Import the file into Google Calendar or Apple Calendar

## Importing to Calendar Apps

### Google Calendar

1. Open [Google Calendar](https://calendar.google.com)
2. Click the **⚙️ Settings** gear icon → **Settings**
3. In the left sidebar, click **Import & Export**
4. Click **Select file from your computer**
5. Choose the downloaded `.ics` file
6. Select which calendar to add the events to
7. Click **Import**

### Apple Calendar (macOS)

1. Open the **Calendar** app
2. Go to **File** → **Import**
3. Select the downloaded `.ics` file
4. Choose which calendar to add the events to
5. Click **OK**

### Apple Calendar (iOS)

1. Open the **Files** app
2. Navigate to the `.ics` file
3. Tap the file
4. Tap **Add All** to import to your default calendar

## Customization

### Adding Custom Semesters

The extension auto-detects these semesters with **automatic break handling**:

- **2025 AUTUMN**: Sept 5 - Nov 19 (no breaks)
- **2025 WINTER**: Dec 5-19, 2025 & Jan 6 - Mar 3, 2026 (excludes winter break)
- **2026 SPRING**: Apr 11 - May 1 & May 7 - Jun 25, 2026 (excludes golden week)

To add or modify semesters:

1. Open `popup.js`
2. Find the `SEMESTER_DATES` object at the top
3. Add your semester following this format:
   ```javascript
   const SEMESTER_DATES = {
     '2025 AUTUMN': {
       periods: [
         { start: '2025-09-05', end: '2025-11-19' }
       ]
     },
     '2026 SUMMER': {
       periods: [
         { start: '2026-07-01', end: '2026-07-20' },
         { start: '2026-08-01', end: '2026-08-31' }
       ]
     }
   };
   ```
4. Reload the extension in Chrome

**Note:** Semesters with breaks use multiple periods. The extension will skip dates between periods automatically.

### Modifying Time Slots

To adjust class times, edit the `normalTimes` and `superTimes` objects in `popup.js`:

```javascript
const normalTimes = {
  '1': { start: '08:45', end: '10:00' },
  // ... modify as needed
};
```

## Troubleshooting

### "Timetable table not found on this page"

- Ensure you're on the correct timetable page
- Check that the page has loaded completely
- The table must have the ID: `ctl00_ContentPlaceHolder1_uc_registration_result_grv_reg`

### No courses appear in the popup

- Refresh the timetable page
- Reload the extension: go to `chrome://extensions/` and click the refresh icon
- Check the browser console for errors (F12 → Console tab)

### Wrong dates or times

- Verify the semester start date in the extension popup
- Check that your schedule format matches: `period/day` (e.g., `5/W`)
- Ensure day abbreviations are correct (M, T, W, TH, F)

### Import errors in calendar apps

- Try opening the `.ics` file in a text editor to verify it's not corrupted
- Ensure your calendar app is up to date
- Try importing to a different calendar to isolate the issue

## Files

- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `popup.js` - Main logic and ICS generation
- `content.js` - Data extraction from webpage
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons

## Development

To modify the extension:

1. Make your changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon ⟳ on the Timetable Exporter card
4. Test your changes

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify your timetable page structure matches the expected format
3. Ensure all required files are present in the extension folder

## Privacy

This extension:
- ✅ Only runs on the current tab when you click the icon
- ✅ Processes all data locally in your browser
- ✅ Does NOT send any data to external servers
- ✅ Does NOT track or store your information

