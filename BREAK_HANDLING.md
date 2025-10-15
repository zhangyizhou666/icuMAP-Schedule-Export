# Break Handling - Smart Calendar Export

## 🎯 Overview

Version 1.2.0 introduces **intelligent break handling** that automatically excludes holiday and vacation periods from your calendar exports.

## 📅 Current Semester Rules

### 2025 AUTUMN (No Breaks)
```
September 5 ─────────────────── November 19, 2025
├─ Classes every week
└─ Total: ~11 weeks
```

### 2025 WINTER (Has Winter Break)
```
December 5 ──── December 19, 2025
                 [WINTER BREAK]
January 6 ─────────── March 3, 2026
├─ Period 1: Dec 5-19 (2 weeks)
├─ BREAK: Dec 20 - Jan 5 (excluded)
└─ Period 2: Jan 6 - Mar 3 (~8 weeks)
```

### 2026 SPRING (Has Golden Week Break)
```
April 11 ──────── May 1, 2026
                   [GOLDEN WEEK]
May 7 ────────────── June 25, 2026
├─ Period 1: Apr 11 - May 1 (3 weeks)
├─ BREAK: May 2-6 (excluded)
└─ Period 2: May 7 - Jun 25 (~7 weeks)
```

## 🔧 How It Works

### Automatic Detection
When you open the extension on your timetable page:

1. **Reads semester name** from page (e.g., "2025 WINTER")
2. **Looks up period data** from the rule-based mapping
3. **Sets date range** to cover all periods
4. **Notifies you** about detected breaks

### Event Generation
When exporting to ICS:

1. **Calculates all potential weeks** from start to end date
2. **Checks each event date** against valid periods
3. **Skips dates during breaks** automatically
4. **Creates events only** for class dates

### Example: Winter 2025

**Input:**
- Course: ISC221 on Wednesday 15:25-16:40
- Semester: 2025 WINTER

**Process:**
```
Dec 5 (Wed)  ✓ Create event
Dec 12 (Wed) ✓ Create event
Dec 19 (Wed) ✓ Create event
Dec 26 (Wed) ✗ Skip (winter break)
Jan 2 (Wed)  ✗ Skip (winter break)
Jan 9 (Wed)  ✓ Create event
Jan 16 (Wed) ✓ Create event
... continues through Mar 3
```

**Result:**
Only creates events for actual class dates, skipping Dec 26 and Jan 2.

## 🎨 User Interface

### Auto-Detection Message

**For semesters with breaks:**
```
ℹ️ Auto-detected: 2025 WINTER (2025-12-05 to 2026-03-03) 
   (includes 2 periods, breaks excluded)
```

**For semesters without breaks:**
```
ℹ️ Auto-detected: 2025 AUTUMN (2025-09-05 to 2025-11-19)
```

### Date Fields
- **Start Date:** First day of first period
- **End Date:** Last day of last period
- **Events:** Only created for dates within valid periods

## 📊 Technical Implementation

### Data Structure

```javascript
const SEMESTER_DATES = {
  '2025 AUTUMN': {
    periods: [
      { start: '2025-09-05', end: '2025-11-19' }
    ]
  },
  '2025 WINTER': {
    periods: [
      { start: '2025-12-05', end: '2025-12-19' },
      { start: '2026-01-06', end: '2026-03-03' }
    ]
  },
  '2026 SPRING': {
    periods: [
      { start: '2026-04-11', end: '2026-05-01' },
      { start: '2026-05-07', end: '2026-06-25' }
    ]
  }
};
```

### Key Functions

#### `isDateInSemester(date, semesterData)`
Checks if a specific date falls within any active period.

```javascript
// Returns true if date is in any period, false if in break
isDateInSemester('2025-12-26', winterData) // false (winter break)
isDateInSemester('2026-01-09', winterData) // true (class period)
```

#### `getSemesterRange(semesterData)`
Gets overall start/end dates for UI display.

```javascript
// Returns { start: '2025-12-05', end: '2026-03-03' }
getSemesterRange(winterData)
```

#### `generateICS(courses, start, end, semesterData)`
Generates ICS with break exclusion.

```javascript
// Automatically skips events during breaks
generateICS(courses, '2025-12-05', '2026-03-03', winterData)
```

## ✅ Benefits

### For Students
- **No manual editing** - Breaks are excluded automatically
- **Clean calendar** - No events during vacation periods
- **Accurate schedule** - Only real class dates appear

### For Developers
- **Easy to update** - Just edit the periods array
- **Flexible** - Supports any number of breaks
- **Maintainable** - Clear data structure

## 🔄 Adding Custom Breaks

### Example: Adding Summer Semester with Multiple Breaks

```javascript
'2026 SUMMER': {
  periods: [
    { start: '2026-07-01', end: '2026-07-15' },
    { start: '2026-07-20', end: '2026-08-05' },
    { start: '2026-08-10', end: '2026-08-31' }
  ]
}
```

This creates a summer semester with two breaks:
- Break 1: July 16-19
- Break 2: August 6-9

## 📝 Manual Override

### If Auto-Detection Doesn't Work
1. Extension will show the detected range
2. You can manually adjust start/end dates
3. Events will still be limited to manual range
4. Break handling applies if semester is recognized

### For Custom Date Ranges
1. Change dates in the popup
2. If semester is not in the mapping, all dates in range will have events
3. To add break handling, add the semester to `SEMESTER_DATES`

## 🎓 Real-World Example

### Scenario: Winter Semester Course

**Your Schedule:**
- Introduction to Programming
- Monday & Wednesday, 10:10-11:25
- Semester: 2025 WINTER

**What Happens:**

1. **Open Extension:**
   - Detects "2025 WINTER"
   - Sets dates: Dec 5, 2025 - Mar 3, 2026
   - Shows message about 2 periods

2. **Export:**
   - Creates Mon/Wed events for Dec 5-19
   - **Skips** Dec 23, 25, 30, Jan 1
   - Creates Mon/Wed events from Jan 6 onwards
   - Total: ~20 events (not 26)

3. **Your Calendar:**
   - ✓ Classes before winter break
   - ✗ No events Dec 20 - Jan 5
   - ✓ Classes after winter break
   - Clean and accurate!

## 🔍 Troubleshooting

### "I see events during breaks"
→ Check that the semester is correctly detected  
→ Verify `SEMESTER_DATES` has the right periods  
→ Reload the extension after changes

### "Missing some classes"
→ Ensure period dates are correct  
→ Check that you didn't accidentally exclude valid dates  
→ Verify semester name matches exactly

### "Breaks not working for my semester"
→ Add your semester to `SEMESTER_DATES`  
→ Define periods with breaks excluded  
→ Reload extension

## 📈 Future Enhancements

Potential additions:
- Holiday calendar integration
- Custom break periods per course
- Academic calendar import
- Multi-university support

## 🎉 Summary

The break handling feature makes your calendar export more accurate and saves you from manually deleting events during vacation periods. It's automatic, smart, and easy to customize!

**Key Points:**
- ✅ Automatic break detection for known semesters
- ✅ Rule-based system, easy to update
- ✅ No events during vacation periods
- ✅ Clean, accurate calendar exports
- ✅ Manual override still available

---

**Version:** 1.2.0  
**Feature:** Rule-based break handling  
**Status:** Active for 2025 Autumn, Winter, and 2026 Spring

