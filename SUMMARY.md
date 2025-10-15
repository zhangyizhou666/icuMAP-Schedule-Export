# Timetable Exporter - Project Summary

## ✅ What's Been Created

Your Chrome extension is complete and ready to use! Here's what was built:

### Core Files

1. **manifest.json** - Extension configuration
   - Configured for Manifest V3
   - Permissions: activeTab, downloads
   - Popup interface enabled

2. **content.js** - Data extraction script
   - Extracts course code, name, instructor, schedule, and room
   - Finds data from table ID: `ctl00_ContentPlaceHolder1_uc_registration_result_grv_reg`
   - Handles the specific HTML structure from your timetable page

3. **popup.html** - User interface
   - Clean, modern design
   - Shows extracted courses
   - Semester start date selector
   - Export button

4. **popup.js** - Core logic
   - **parseSchedule()** - Converts period formats to actual times
   - **generateICS()** - Creates ICS calendar file
   - **Download functionality** - Saves the file locally
   - Supports all your time periods (1-7, including super periods with *)

5. **Icons** - Professional extension icons
   - icon16.png, icon48.png, icon128.png
   - Calendar design with download arrow

### Documentation

- **README.md** - Comprehensive project documentation
- **INSTALL.md** - Step-by-step installation and usage guide

## 📋 Extracted Data

The extension captures:

- ✅ **Course Code** - e.g., ISC221
- ✅ **Course Name** - e.g., Algorithms and Data Structures (J)
- ✅ **Instructor** - e.g., SUGINOUCHI, Shota
- ✅ **Schedule** - e.g., 5/W, (6/W, 7/W)
- ✅ **Room** - e.g., I-104
- ✅ **Semester/Season** - e.g., 2025 AUTUMN

## ⏰ Time Conversion

Your schedule format is automatically converted:

### Normal Periods
- Period 1: 08:45 - 10:00
- Period 2: 10:10 - 11:25
- Period 3: 11:35 - 12:50
- Period 4: 14:00 - 15:15
- Period 5: 15:25 - 16:40
- Period 6: 16:50 - 18:05
- Period 7: 18:15 - 19:30

### Super Periods (marked with *)
- Period 4*: 13:20 - 15:15
- Period 5*: 15:25 - 17:20
- Period 7*: 18:15 - 20:10

### Day Format Support
- M, MON → Monday
- T, TU, TUE → Tuesday
- W, WED → Wednesday
- TH, THU → Thursday
- F, FRI → Friday

## 🚀 Quick Start

1. **Install:**
   ```
   1. Open chrome://extensions/
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select the download_button folder
   ```

2. **Use:**
   ```
   1. Go to your timetable page
   2. Click the extension icon
   3. Adjust semester start date if needed
   4. Click "Export to Calendar (.ics)"
   5. Import the .ics file to Google/Apple Calendar
   ```

## 📁 File Structure

```
download_button/
├── manifest.json       # Extension config
├── popup.html         # UI
├── popup.js           # Main logic + ICS generator
├── content.js         # Page data extraction
├── icon16.png         # Icons
├── icon48.png
├── icon128.png
├── README.md          # Full documentation
├── INSTALL.md         # Installation guide
└── SUMMARY.md         # This file
```

## 🎯 Key Features

✅ **One-Click Export** - Extract and export with a single click  
✅ **Auto-Detection** - Automatically detects semester dates from the page  
✅ **Smart Parsing** - Handles various schedule formats  
✅ **Time Conversion** - Automatically converts periods to times  
✅ **Calendar Compatible** - Works with Google Calendar & Apple Calendar  
✅ **Privacy First** - All processing done locally  
✅ **Easy Customization** - Manual override for dates or add custom semesters  

## 📝 Example Data Flow

**Input (from HTML):**
```
Course: ISC221
Name: Algorithms and Data Structures (J)
Instructor: SUGINOUCHI, Shota
Schedule: 5/W, (6/W, 7/W)
Room: I-104
```

**Processing:**
```
5/W → Wednesday, Period 5 → 15:25-16:40
6/W → Wednesday, Period 6 → 16:50-18:05
7/W → Wednesday, Period 7 → 18:15-19:30
```

**Output (ICS file):**
```
15 weeks of recurring events:
- ISC221 every Wednesday 15:25-16:40
- ISC221 every Wednesday 16:50-18:05
- ISC221 every Wednesday 18:15-19:30
Location: I-104
```

## 🔧 Customization

**Add custom semesters:**
- Edit the `SEMESTER_DATES` object at the top of `popup.js`
- Add entries like: `'2026 SUMMER': { start: '2026-07-01', end: '2026-08-31' }`

**Modify time slots:**
- Edit `normalTimes` and `superTimes` objects in `popup.js`

**Update table selector:**
- Edit `content.js` if your table ID is different

**Manual date override:**
- Simply change the dates in the extension popup UI

## 🎉 Ready to Use!

Your extension is complete and ready for installation. See `INSTALL.md` for detailed setup instructions.

Happy scheduling! 📅

