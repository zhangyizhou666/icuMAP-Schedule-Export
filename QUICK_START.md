# Quick Start Guide - v1.1.0

## 🚀 What's New in This Version

### Automatic Semester Date Detection!

The extension now **automatically reads and sets semester dates** from your timetable page.

```
┌─────────────────────────────────────────┐
│  Timetable Page                         │
│  "2025 AUTUMN"                          │
└─────────────────────────────────────────┘
              ↓ (auto-detects)
┌─────────────────────────────────────────┐
│  Extension Popup                        │
│  Start: 2025-09-05 ✓                    │
│  End:   2025-11-19 ✓                    │
└─────────────────────────────────────────┘
```

## 📅 Supported Semesters

The extension recognizes these semesters automatically:

| Semester | Start Date | End Date | Weeks |
|----------|-----------|----------|-------|
| 2025 AUTUMN | Sept 5, 2025 | Nov 19, 2025 | ~11 weeks |
| 2025 WINTER | Dec 1, 2025 | Feb 15, 2026 | ~11 weeks |
| 2026 SPRING | Apr 1, 2026 | Jul 15, 2026 | ~15 weeks |

## 🎯 How to Use (Step by Step)

### Step 1: Load the Extension
```
1. Open Chrome
2. Go to: chrome://extensions/
3. Click "Load unpacked"
4. Select: /Users/zhangyizhou/Library/Developer/download_button
```

### Step 2: Open Your Timetable
```
1. Navigate to your university timetable page
2. Make sure the page shows "2025 AUTUMN" (or other semester)
3. Verify the timetable table is visible
```

### Step 3: Click the Extension
```
1. Click the Timetable Exporter icon in Chrome toolbar
2. Watch as it automatically:
   ✓ Extracts your courses
   ✓ Detects semester (e.g., "2025 AUTUMN")  
   ✓ Sets start date (2025-09-05)
   ✓ Sets end date (2025-11-19)
```

### Step 4: Review & Adjust (Optional)
```
• Check that courses are listed correctly
• Dates should be auto-populated
• Manually adjust dates if needed
```

### Step 5: Export
```
1. Click "Export to Calendar (.ics)"
2. Save the file
3. Import to Google Calendar or Apple Calendar
```

## 🔄 User Interface

### Before Update (v1.0.0):
```
┌─────────────────────────────────────────┐
│  📅 Timetable Exporter                  │
├─────────────────────────────────────────┤
│  [Course List]                          │
│                                         │
│  Semester Start Date:                   │
│  [2025-09-15]  ← Manual input only      │
│                                         │
│  [Export to Calendar (.ics)]            │
└─────────────────────────────────────────┘
```

### After Update (v1.1.0):
```
┌─────────────────────────────────────────┐
│  📅 Timetable Exporter                  │
├─────────────────────────────────────────┤
│  ℹ️ Auto-detected: 2025 AUTUMN          │
│     (2025-09-05 to 2025-11-19)          │
│                                         │
│  [Course List]                          │
│                                         │
│  Semester Start Date:                   │
│  [2025-09-05]  ← Auto-filled! ✨        │
│                                         │
│  Semester End Date:                     │
│  [2025-11-19]  ← New field! ✨          │
│                                         │
│  [Export to Calendar (.ics)]            │
└─────────────────────────────────────────┘
```

## 🛠️ Customization Options

### Option 1: Manual Override (Easy)
Just change the dates in the popup - they'll override auto-detection.

### Option 2: Add Custom Semesters (Advanced)

Edit `popup.js` (lines 2-6):

```javascript
const SEMESTER_DATES = {
  '2025 AUTUMN': { start: '2025-09-05', end: '2025-11-19' },
  '2025 WINTER': { start: '2025-12-01', end: '2026-02-15' },
  '2026 SPRING': { start: '2026-04-01', end: '2026-07-15' },
  
  // Add your semesters here:
  '2026 SUMMER SESSION': { start: '2026-07-01', end: '2026-08-15' },
  '2027 AUTUMN': { start: '2027-09-07', end: '2027-11-21' }
};
```

Then reload the extension!

## 📊 Data Flow (Technical)

```
┌─────────────┐
│ Timetable   │
│ HTML Page   │
└──────┬──────┘
       │ 1. Extract
       ↓
┌─────────────────────────────────────────┐
│ content.js                              │
│ • Find table by ID                      │
│ • Extract courses + season              │
│ • Return: { courses, season }           │
└──────┬──────────────────────────────────┘
       │ 2. Send to popup
       ↓
┌─────────────────────────────────────────┐
│ popup.js                                │
│ • Receive data                          │
│ • Auto-detect dates from season ✨      │
│ • Display courses                       │
│ • Populate date fields ✨               │
└──────┬──────────────────────────────────┘
       │ 3. User clicks export
       ↓
┌─────────────────────────────────────────┐
│ ICS Generator                           │
│ • Parse schedules                       │
│ • Calculate weeks from date range ✨    │
│ • Generate events                       │
│ • Download .ics file                    │
└─────────────────────────────────────────┘
```

## 🎓 Example Scenario

### Your Timetable Shows:
```
2025 AUTUMN
─────────────────────────────────
ISC221 | Algorithms | SUGINOUCHI
       | 5/W, 6/W, 7/W | I-104
```

### Extension Automatically Does:
```
1. Detects: "2025 AUTUMN"
2. Sets dates: Sept 5 → Nov 19 (11 weeks)
3. Parses: "5/W, 6/W, 7/W"
   → Wednesday 15:25-16:40
   → Wednesday 16:50-18:05
   → Wednesday 18:15-19:30
4. Creates: 33 events (3 slots × 11 weeks)
```

### You Get:
```
timetable_2025_AUTUMN.ics
• 33 calendar events
• All Wednesdays from Sept 5 to Nov 19
• Correct times and room info
• Ready to import!
```

## ✅ Checklist

Before using:
- [ ] Extension loaded in Chrome
- [ ] On correct timetable page
- [ ] Page shows semester name (e.g., "2025 AUTUMN")

When popup opens:
- [ ] Courses displayed
- [ ] Dates auto-populated
- [ ] Message shows detected semester

After export:
- [ ] .ics file downloaded
- [ ] Filename includes semester name
- [ ] Import to calendar works

## 💡 Tips & Tricks

1. **Not detecting your semester?**
   - Add it to `SEMESTER_DATES` in popup.js
   - Or manually enter dates in the popup

2. **Need different date ranges?**
   - Just change the dates manually
   - They'll stay for the current session

3. **Want to see debug info?**
   - Open Chrome DevTools (F12)
   - Check Console tab for logs

4. **Need to update the extension?**
   - Edit the files
   - Go to chrome://extensions/
   - Click refresh icon ⟳

## 🆘 Troubleshooting

### "No courses found"
→ Check that you're on the timetable page with the correct table ID

### "Dates not auto-populating"
→ Semester name might not be in the mapping - add it or use manual input

### "Wrong number of events"
→ Verify start/end dates are correct for your semester

### "Import fails"
→ Check that calendar app is up to date, try different calendar

## 📚 Additional Resources

- **README.md** - Full documentation
- **INSTALL.md** - Detailed installation guide
- **HOW_IT_WORKS.md** - Technical deep-dive
- **CHANGELOG.md** - Version history
- **UPDATE_SUMMARY.md** - What changed in v1.1.0

## 🎉 You're Ready!

Your extension now automatically detects semester dates and generates accurate calendar events. No more manual date lookups!

**Happy scheduling! 📅✨**

---

**Version:** 1.1.0  
**Last Updated:** October 13, 2025  
**Author:** Built for university timetable export

