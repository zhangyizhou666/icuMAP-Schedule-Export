# Timetable Exporter Chrome Extension

A Chrome extension that exports your university timetable to an ICS file compatible with Google Calendar and Apple Calendar.

## Features

- 🚀 **In-Page Download Button**: Export directly from the timetable page - no need to open the extension popup!
- 📅 **One-Click Export**: Extract course information from your timetable page with a single click
- 🕒 **Smart Time Conversion**: Automatically converts period numbers to actual time slots
- 🤖 **Auto-Detection**: Automatically detects semester dates from the page (2025 AUTUMN, 2025 WINTER, 2026 SPRING)
- 📥 **ICS Format**: Export to standard ICS calendar format
- 🎓 **Course Details**: Captures course code, name, instructor, schedule, and room information
- ⚙️ **Customizable**: Manually adjust semester start and end dates if needed (via popup)

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension folder
4. The extension icon will appear in your browser toolbar

## Usage

### Method 1: In-Page Button (Quick & Easy!) ⚡

1. Navigate to your university timetable page
2. Look for the **"📅 Export to Calendar"** button next to the semester name (e.g., "2025 AUTUMN")
3. Click the button
4. The ICS file will download automatically with correct dates and break handling!
5. Import the file to Google Calendar or Apple Calendar

### Method 2: Extension Popup (With Manual Override)

1. Navigate to your university timetable page
2. Click the extension icon in your browser toolbar
3. Review the extracted courses in the popup
4. The extension will auto-detect semester dates (if recognized)
5. Adjust start/end dates manually if needed
6. Click "Export to Calendar (.ics)" button
7. Save the ICS file
8. Import the file to Google Calendar or Apple Calendar

## Semester Date Auto-Detection

The extension automatically recognizes these semesters and sets the appropriate dates:

| Semester | Date Ranges | Notes |
|----------|-------------|-------|
| 2025 AUTUMN | Sept 5 - Nov 19, 2025 | Single period |
| 2025 WINTER | Dec 5-19, 2025 & Jan 6 - Mar 3, 2026 | **Has winter break** |
| 2026 SPRING | Apr 11 - May 1 & May 7 - Jun 25, 2026 | **Has golden week break** |

**Break Handling:** The extension automatically excludes break periods! Events are only created for valid class dates.

**Note:** You can customize these dates in `popup.js` by editing the `SEMESTER_DATES` object, or manually override them in the extension popup.

## Time Slots

The extension supports the following time slots:

**Normal Periods:**
- Period 1: 08:45 - 10:00
- Period 2: 10:10 - 11:25
- Period 3: 11:35 - 12:50
- Period 4: 14:00 - 15:15
- Period 5: 15:25 - 16:40
- Period 6: 16:50 - 18:05
- Period 7: 18:15 - 19:30

**Super Periods (marked with *):**
- Period 4*: 13:20 - 15:15
- Period 5*: 15:25 - 17:20
- Period 7*: 18:15 - 20:10

## Schedule Format

The extension recognizes various schedule formats:
- `5/W` - Period 5 on Wednesday
- `1/M, 2/M` - Period 1 and 2 on Monday
- `(3/T, 4/T)` - Period 3 and 4 on Tuesday (parentheses are ignored)
- `5*/W` - Super period 5 on Wednesday

## Day Abbreviations

- M, MON - Monday
- T, TU, TUE - Tuesday
- W, WED - Wednesday
- TH, THU - Thursday
- F, FRI - Friday

## How to Import ICS File

### Google Calendar
1. Open Google Calendar
2. Click the "+" next to "Other calendars"
3. Select "Import"
4. Choose the downloaded ICS file
5. Select the calendar to add events to
6. Click "Import"

### Apple Calendar
1. Open Calendar app
2. Go to File → Import
3. Select the downloaded ICS file
4. Choose the calendar to add events to
5. Click "Import"

## Files Structure

```
download_button/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.js           # Main logic and ICS generator
├── content.js         # Data extraction script
├── icon16.png         # Extension icon (16x16)
├── icon48.png         # Extension icon (48x48)
├── icon128.png        # Extension icon (128x128)
└── README.md          # This file
```

## Notes

- The extension automatically excludes break periods (Winter break, Golden Week, etc.)
- Events are only created for dates within valid class periods
- Each course session is created as a separate event (not a recurring event) for maximum compatibility
- Semester dates are auto-detected from the page, but can be manually adjusted in the extension popup
- Custom semesters can be added by editing the `SEMESTER_DATES` mapping in `popup.js`

## Troubleshooting

**No courses found:**
- Make sure you're on the correct timetable page
- The table should have the ID `ctl00_ContentPlaceHolder1_uc_registration_result_grv_reg`

**Wrong times:**
- Verify your semester start date is set correctly
- Check if the period format matches the supported formats

**Import issues:**
- Ensure you're using a compatible calendar application
- Try opening the ICS file in a text editor to verify the format

## Technical Details

The extension:
1. Extracts data from the HTML table using the content script
2. Parses the schedule format to identify days and periods
3. Converts periods to actual time slots
4. Generates ICS format events for each course session
5. Downloads the file through the Chrome downloads API

## License

This is a utility tool for educational purposes.

