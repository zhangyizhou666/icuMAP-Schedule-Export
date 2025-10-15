# How the Extension Works

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    University Timetable Page                │
│                                                               │
│  <table id="ctl00_ContentPlaceHolder1_                      │
│          uc_registration_result_grv_reg">                    │
│    <tr>                                                      │
│      <td><span>ISC221</span></td>                           │
│      <td><span>Algorithms and Data Structures</span></td>   │
│      <td><span>SUGINOUCHI, Shota</span></td>                │
│      <td><span>5/W, (6/W, 7/W)</span></td>                  │
│      <td><a>I-104</a></td>                                  │
│    </tr>                                                     │
│  </table>                                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       content.js                             │
│                  (Content Script)                            │
│                                                              │
│  • Finds table by ID                                        │
│  • Extracts data from <span> and <a> elements              │
│  • Returns JSON object with courses                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        popup.js                              │
│                   (Main Logic)                               │
│                                                              │
│  Step 1: Receive Data                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ {                                                   │    │
│  │   code: "ISC221",                                  │    │
│  │   name: "Algorithms and Data Structures (J)",      │    │
│  │   instructor: "SUGINOUCHI, Shota",                 │    │
│  │   schedule: "5/W, (6/W, 7/W)",                     │    │
│  │   room: "I-104"                                    │    │
│  │ }                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Step 2: Parse Schedule                                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ parseSchedule("5/W, (6/W, 7/W)")                   │    │
│  │                                                     │    │
│  │ Returns:                                            │    │
│  │ [                                                   │    │
│  │   {                                                 │    │
│  │     day: "Wednesday",                              │    │
│  │     period: "5",                                   │    │
│  │     start: "15:25",                                │    │
│  │     end: "16:40"                                   │    │
│  │   },                                                │    │
│  │   {                                                 │    │
│  │     day: "Wednesday",                              │    │
│  │     period: "6",                                   │    │
│  │     start: "16:50",                                │    │
│  │     end: "18:05"                                   │    │
│  │   },                                                │    │
│  │   {                                                 │    │
│  │     day: "Wednesday",                              │    │
│  │     period: "7",                                   │    │
│  │     start: "18:15",                                │    │
│  │     end: "19:30"                                   │    │
│  │   }                                                 │    │
│  │ ]                                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Step 3: Generate ICS Events                                │
│  ┌────────────────────────────────────────────────────┐    │
│  │ For each time slot × 15 weeks:                     │    │
│  │                                                     │    │
│  │ BEGIN:VEVENT                                       │    │
│  │ DTSTART:20250917T152500                            │    │
│  │ DTEND:20250917T164000                              │    │
│  │ SUMMARY:ISC221 - Algorithms and Data Structures   │    │
│  │ LOCATION:I-104                                     │    │
│  │ DESCRIPTION:Course: ISC221\nInstructor: ...        │    │
│  │ END:VEVENT                                         │    │
│  │                                                     │    │
│  │ [Repeat for all weeks and time slots...]          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Downloads API                      │
│                                                              │
│  • Creates .ics file                                        │
│  • Triggers download                                        │
│  • Saves as: timetable_2025_AUTUMN.ics                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  User imports to Calendar                    │
│                                                              │
│  Google Calendar  OR  Apple Calendar                        │
│                                                              │
│  ✅ All classes scheduled for the semester                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Key Components

### 1. Content Script (`content.js`)
**Purpose:** Extract data from the webpage

**How it works:**
- Runs when the page loads
- Waits for message from popup
- Finds the timetable table by ID
- Loops through table rows
- Extracts text from specific cells using querySelector
- Returns structured data

**Example extraction:**
```javascript
const courseCode = cells[2]?.querySelector('span')?.textContent.trim();
// Gets "ISC221" from <td><span>ISC221</span></td>
```

### 2. Popup Interface (`popup.html` + `popup.js`)
**Purpose:** User interaction and data processing

**Components:**
- **UI Display:** Shows extracted courses
- **Date Selector:** Semester start date input
- **Export Button:** Triggers the export process

**Key Function - parseSchedule():**
```javascript
Input:  "5/W, (6/W, 7/W)"
        ↓
Step 1: Remove parentheses → "5/W, 6/W, 7/W"
        ↓
Step 2: Split by comma → ["5/W", "6/W", "7/W"]
        ↓
Step 3: For each slot:
        - Split by "/" → period="5", day="W"
        - Map day to full name → "Wednesday"
        - Look up time in normalTimes → "15:25" to "16:40"
        ↓
Output: Array of time slots with day, period, start, end
```

### 3. ICS Generator (`popup.js`)
**Purpose:** Create calendar file

**Process:**
1. For each course and time slot
2. Calculate dates for each week of semester
3. Format dates in ICS format (YYYYMMDDTHHMMSS)
4. Build ICS event structure
5. Combine all events into one file

**ICS Format:**
```
BEGIN:VCALENDAR
VERSION:2.0
  BEGIN:VEVENT
  UID:unique-id
  DTSTART:20250917T152500
  DTEND:20250917T164000
  SUMMARY:Course Name
  LOCATION:Room
  DESCRIPTION:Details
  END:VEVENT
END:VCALENDAR
```

## 📊 Schedule Format Parsing

### Supported Formats

| Input Format | Parsed As | Time |
|-------------|-----------|------|
| `5/W` | Period 5, Wednesday | 15:25-16:40 |
| `1/M, 2/M` | Period 1 & 2, Monday | 08:45-10:00, 10:10-11:25 |
| `(3/T)` | Period 3, Tuesday | 11:35-12:50 |
| `4*/TH` | Super Period 4, Thursday | 13:20-15:15 |

### Day Mapping

```javascript
const daysMap = {
  'M': 'Monday',
  'T': 'Tuesday',
  'TU': 'Tuesday',
  'W': 'Wednesday',
  'TH': 'Thursday',
  'F': 'Friday'
};
```

### Time Slots

**Regular Classes:**
```
Period 1: 08:45-10:00  (1 hour 15 min)
Period 2: 10:10-11:25  (1 hour 15 min)
Period 3: 11:35-12:50  (1 hour 15 min)
Period 4: 14:00-15:15  (1 hour 15 min)
Period 5: 15:25-16:40  (1 hour 15 min)
Period 6: 16:50-18:05  (1 hour 15 min)
Period 7: 18:15-19:30  (1 hour 15 min)
```

**Extended Classes (marked with *):**
```
Period 4*: 13:20-15:15  (1 hour 55 min)
Period 5*: 15:25-17:20  (1 hour 55 min)
Period 7*: 18:15-20:10  (1 hour 55 min)
```

## 🔐 Security & Privacy

✅ **No external servers** - All processing happens locally  
✅ **No data collection** - Nothing is stored or transmitted  
✅ **Minimal permissions** - Only activeTab and downloads  
✅ **Open source** - You can inspect all the code  

## 🎯 Error Handling

### Table Not Found
```javascript
if (!table) {
  return { error: 'Timetable table not found on this page' };
}
```

### Invalid Schedule Format
```javascript
if (!period || !day || !daysMap[day]) {
  console.log('Invalid format, skipping slot:', slot);
  continue;
}
```

### Download Errors
```javascript
if (chrome.runtime.lastError) {
  showMessage('Error downloading file: ' + chrome.runtime.lastError.message, 'error');
}
```

## 🚀 Performance

- **Fast extraction:** Direct DOM queries with querySelector
- **Efficient parsing:** Simple string operations
- **Small file size:** ICS files are plain text, ~1KB per course
- **No network calls:** Everything runs locally

## 🔄 Update Flow

When modifying the extension:

1. **Edit files** → Make your changes
2. **Reload extension** → chrome://extensions/ → Click refresh
3. **Test** → Visit timetable page, click extension
4. **Debug** → Check console (F12) for errors

That's it! The extension is designed to be simple, fast, and reliable. 🎉

