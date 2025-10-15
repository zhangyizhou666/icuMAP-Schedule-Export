# Changelog

## Version 1.3.0 - In-Page Download Button

### 🎉 New Features

#### Direct Download Button on Page
- **In-page button**: A "📅 Export to Calendar" button now appears next to the semester name on your timetable page
- **One-click export**: Download your calendar without opening the extension popup
- **Auto-configured**: Uses the same smart semester detection and break handling
- **Visual feedback**: Button shows success confirmation when download completes

#### Benefits
- ⚡ **Faster workflow**: No need to click extension icon
- 🎯 **More convenient**: Export right from the page you're on
- ✨ **Automatic setup**: All dates and breaks configured automatically
- 🔄 **Two methods**: Use in-page button OR extension popup (both work!)

### 🔧 Technical Changes

**content.js:**
- Added full ICS generation capability to content script
- Injected styled download button next to semester element
- Implemented direct file download from page (no Chrome downloads API needed)
- Added visual feedback (button turns green on success)
- Includes all semester date mapping and break handling logic

**Features:**
- Button appears automatically when page loads
- Same functionality as popup export button
- Handles all semester types with break exclusion
- Clean UI integration with hover effects

### 📊 User Experience

**Before v1.3:**
1. Open timetable page
2. Click extension icon
3. Click export button
4. Download file

**After v1.3:**
1. Open timetable page
2. Click "📅 Export to Calendar" button (next to semester name)
3. Done! ✓

### 🎨 Button Design
- Styled to match modern UI standards
- Blue (#0066cc) with hover effect
- Success state (green) with auto-reset
- Positioned right next to semester label

---

## Version 1.2.0 - Rule-Based Break Handling

### 🎉 New Features

#### Intelligent Break Exclusion
- **Automatic break detection**: Events are NOT created during vacation periods
- **Multi-period semesters**: Support for semesters with breaks (Winter, Spring)
- **Rule-based system**: Easy to update when new semester dates are announced

#### Updated Semester Rules
- **2025 AUTUMN**: Sept 5 - Nov 19 (no breaks)
- **2025 WINTER**: Dec 5-19, 2025 & Jan 6 - Mar 3, 2026 (excludes winter break)
- **2026 SPRING**: Apr 11 - May 1 & May 7 - Jun 25, 2026 (excludes golden week)

### 🔧 Technical Changes

**popup.js:**
- Restructured `SEMESTER_DATES` to support multiple periods per semester
- Added `isDateInSemester()` - checks if date is within valid periods
- Added `getSemesterRange()` - gets overall date range for display
- Updated `generateICS()` - skips dates during breaks automatically
- Enhanced UI messages to show break information

### 📚 Documentation Updates

**New files:**
- BREAK_HANDLING.md - Comprehensive guide to break handling feature

**Updated files:**
- README.md - Updated semester dates and break info
- INSTALL.md - Updated customization guide with period structure
- manifest.json - Version 1.2.0

### 🎯 How It Works

1. Extension reads semester from page (e.g., "2025 WINTER")
2. Looks up period data from rule-based mapping
3. Generates events only for dates within active periods
4. Automatically skips winter break (Dec 20 - Jan 5)
5. Automatically skips golden week (May 2-6)

### 📊 Example

**Winter 2025 Course (Wed 15:25-16:40):**
- ✅ Creates events: Dec 5, 12, 19
- ❌ Skips: Dec 26, Jan 2 (winter break)
- ✅ Creates events: Jan 9, 16, 23... (continues)

Result: Clean calendar without vacation events!

### 🔮 Benefits

1. **More accurate calendars** - No events during breaks
2. **Less manual work** - No need to delete vacation events
3. **Easy to maintain** - Update periods when new dates announced
4. **Flexible** - Supports any number of breaks per semester

---

## Version 1.1.0 - Auto-Detection Update

### 🎉 New Features

#### Semester Date Auto-Detection
- **Automatic semester recognition**: Extension now reads the season/semester information from the page (e.g., "2025 AUTUMN") and automatically sets the correct start and end dates
- **Pre-configured semesters**:
  - 2025 AUTUMN: September 5 - November 19, 2025
  - 2025 WINTER: December 1, 2025 - February 15, 2026
  - 2026 SPRING: April 1 - July 15, 2026
- **Smart matching**: Recognizes semester names even with variations in format

#### End Date Support
- Added **Semester End Date** input field
- Calendar events are now generated based on the actual date range
- More accurate event scheduling (no more hardcoded 15 weeks)

#### Manual Override
- Both start and end dates can be manually adjusted in the popup
- Manual input overrides auto-detection
- Dates persist during the session

### 🔧 Technical Changes

**popup.js:**
- Added `SEMESTER_DATES` constant for semester mapping
- Added `getSemesterDates()` function for auto-detection
- Added `calculateWeeks()` function to compute weeks from date range
- Updated `generateICS()` to use date range instead of fixed week count
- Enhanced auto-load to set dates when courses are detected

**popup.html:**
- Added semester end date input field
- Updated UI to show both start and end dates

**content.js:**
- No changes (already extracting season information)

### 📚 Documentation Updates

**Updated files:**
- README.md - Added auto-detection feature description
- INSTALL.md - Updated usage instructions and customization guide
- SUMMARY.md - Reflected new features in overview
- All docs now explain the semester date mapping

### 🎯 Benefits

1. **Less manual work**: Dates are set automatically when you open the extension
2. **More accurate**: Events are created for the exact semester duration
3. **Flexible**: Easy to add custom semesters by editing the mapping
4. **User-friendly**: Still allows manual override for special cases

### 📝 Migration Notes

If you were using version 1.0.0:
- No action needed - the extension will work automatically
- Your manual date selections will still work as before
- The new auto-detection will populate dates when you open the popup

### 🔮 Future Enhancements

Potential additions for future versions:
- More semester mappings
- Support for reading semester dates from different HTML structures
- Option to save custom semester mappings locally
- Holiday/break exclusion

---

## Version 1.0.0 - Initial Release

### Features

- Course extraction from university timetable page
- Schedule parsing (period/day format to actual times)
- ICS file generation
- Support for normal and super periods
- Manual semester start date selection
- Chrome extension with popup interface
- Icon set and branding

