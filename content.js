// Content script to extract timetable data from the page

// Semester date mapping (same as popup.js)
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

function getSemesterDates(seasonText) {
  if (!seasonText) return null;
  const normalized = seasonText.trim().toUpperCase();
  if (SEMESTER_DATES[normalized]) return SEMESTER_DATES[normalized];
  for (const key in SEMESTER_DATES) {
    if (normalized.includes(key)) return SEMESTER_DATES[key];
  }
  return null;
}

function isDateInSemester(date, semesterData) {
  if (!semesterData || !semesterData.periods) return false;
  const checkDate = new Date(date);
  for (const period of semesterData.periods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    if (checkDate >= start && checkDate <= end) return true;
  }
  return false;
}

function getSemesterRange(semesterData) {
  if (!semesterData || !semesterData.periods || semesterData.periods.length === 0) return null;
  const firstPeriod = semesterData.periods[0];
  const lastPeriod = semesterData.periods[semesterData.periods.length - 1];
  return { start: firstPeriod.start, end: lastPeriod.end };
}

function parseSchedule(scheduleText) {
  if (!scheduleText) return [];
  scheduleText = scheduleText.replace(/\(/g, '').replace(/\)/g, '');
  const slots = scheduleText.split(',').map(s => s.trim());
  const timeSlots = [];
  
  const normalTimes = {
    '1': { start: '08:45', end: '10:00' }, '2': { start: '10:10', end: '11:25' },
    '3': { start: '11:35', end: '12:50' }, '4': { start: '14:00', end: '15:15' },
    '5': { start: '15:25', end: '16:40' }, '6': { start: '16:50', end: '18:05' },
    '7': { start: '18:15', end: '19:30' }
  };
  
  const superTimes = {
    '4': { start: '13:20', end: '15:15' }, '5': { start: '15:25', end: '17:20' },
    '7': { start: '18:15', end: '20:10' }
  };
  
  const daysMap = {
    'M': 'Monday', 'T': 'Tuesday', 'TU': 'Tuesday', 'W': 'Wednesday',
    'TH': 'Thursday', 'F': 'Friday', 'MON': 'Monday', 'TUE': 'Tuesday',
    'WED': 'Wednesday', 'THU': 'Thursday', 'FRI': 'Friday'
  };
  
  for (const slot of slots) {
    const isSuper = slot.includes('*');
    let period, day;
    if (slot.includes('/')) {
      [period, day] = slot.split('/');
      period = period.replace('*', '');
    } else {
      const periodMatch = slot.match(/(\d+)/);
      const dayMatch = slot.match(/([A-Z]+)/i);
      period = periodMatch ? periodMatch[0] : null;
      day = dayMatch ? dayMatch[0] : null;
    }
    if (day) day = day.toUpperCase();
    if (!period || !day || !daysMap[day]) continue;
    const timeRange = isSuper && superTimes[period] ? superTimes[period] : normalTimes[period];
    if (timeRange) {
      timeSlots.push({
        day: daysMap[day], period, start: timeRange.start,
        end: timeRange.end, isSuper
      });
    }
  }
  return timeSlots;
}

function getDateForDay(semesterStart, weekOffset, dayName) {
  const start = new Date(semesterStart);
  const dayMapping = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4,
    'Friday': 5, 'Saturday': 6, 'Sunday': 0
  };
  const startDay = start.getDay();
  const targetDay = dayMapping[dayName];
  let daysToAdd = targetDay - startDay;
  if (daysToAdd < 0) daysToAdd += 7;
  const targetDate = new Date(start);
  targetDate.setDate(start.getDate() + daysToAdd + (weekOffset * 7));
  return targetDate;
}

function formatICSDate(date, time) {
  const [hours, minutes] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}00`;
}

function generateICS(courses, semesterStart, semesterEnd, semesterData = null) {
  let icsContent = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Timetable Exporter//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'
  ];
  
  courses.forEach(course => {
    const timeSlots = parseSchedule(course.schedule);
    timeSlots.forEach(slot => {
      const start = new Date(semesterStart);
      const end = new Date(semesterEnd);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.ceil(diffDays / 7) + 1;
      
      for (let week = 0; week < totalWeeks; week++) {
        const eventDate = getDateForDay(semesterStart, week, slot.day);
        if (semesterData && !isDateInSemester(eventDate, semesterData)) continue;
        if (eventDate < new Date(semesterStart) || eventDate > new Date(semesterEnd)) continue;
        
        const startDateTime = formatICSDate(eventDate, slot.start);
        const endDateTime = formatICSDate(eventDate, slot.end);
        const uid = `${course.code}-${slot.day}-${slot.period}-week${week}@timetable-exporter`;
        
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:${uid}`);
        icsContent.push(`DTSTART:${startDateTime}`);
        icsContent.push(`DTEND:${endDateTime}`);
        icsContent.push(`SUMMARY:${course.code} - ${course.name}`);
        icsContent.push(`LOCATION:${course.room || 'TBA'}`);
        icsContent.push(`DESCRIPTION:Course: ${course.code}\\nInstructor: ${course.instructor}\\nPeriod: ${slot.period}`);
        icsContent.push('END:VEVENT');
      }
    });
  });
  
  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

function extractTimetableData() {
  const courses = [];
  const table = document.getElementById('ctl00_ContentPlaceHolder1_uc_registration_result_grv_reg');
  
  if (!table) {
    console.log('Timetable table not found');
    return { error: 'Timetable table not found on this page' };
  }

  const seasonElement = document.getElementById('ctl00_ContentPlaceHolder1_uc_registration_result_lbl_season');
  const season = seasonElement ? seasonElement.textContent.trim() : '2025 AUTUMN';
  
  const rows = table.querySelectorAll('tr');
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');
    if (cells.length < 8) continue;
    
    const courseCode = cells[2]?.querySelector('span')?.textContent.trim();
    const courseName = cells[3]?.querySelector('span')?.textContent.trim();
    const instructor = cells[4]?.querySelector('span')?.textContent.trim();
    const schedule = cells[6]?.querySelector('span')?.textContent.trim();
    const room = cells[7]?.querySelector('a')?.textContent.trim() || cells[7]?.textContent.trim();
    
    if (courseCode && courseName) {
      courses.push({
        code: courseCode, name: courseName, instructor: instructor || '',
        schedule: schedule || '', room: room || '', season: season
      });
    }
  }
  
  console.log('Extracted courses:', courses);
  return { courses, season };
}

// Download ICS file directly from the page
function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Handle download button click
function handleDownloadClick() {
  const data = extractTimetableData();
  
  if (data.error) {
    alert(data.error);
    return;
  }
  
  if (data.courses.length === 0) {
    alert('No courses found to export');
    return;
  }
  
  // Get semester data for break handling
  const semesterData = data.season ? getSemesterDates(data.season) : null;
  const dateRange = semesterData ? getSemesterRange(semesterData) : null;
  
  let semesterStart, semesterEnd;
  
  if (dateRange) {
    semesterStart = dateRange.start;
    semesterEnd = dateRange.end;
  } else {
    // Fallback to default dates
    semesterStart = '2025-09-15';
    semesterEnd = '2025-11-19';
  }
  
  // Generate ICS file
  const icsContent = generateICS(data.courses, semesterStart, semesterEnd, semesterData);
  const filename = `timetable_${data.season.replace(/\s+/g, '_')}.ics`;
  
  downloadICS(icsContent, filename);
  
  // Show success message
  const button = document.getElementById('timetable-export-btn');
  if (button) {
    const originalText = button.textContent;
    button.textContent = '✓ Downloaded!';
    button.style.background = '#28a745';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#0066cc';
    }, 2000);
  }
}

// Inject download button next to semester label
function injectDownloadButton() {
  const seasonElement = document.getElementById('ctl00_ContentPlaceHolder1_uc_registration_result_lbl_season');
  
  if (!seasonElement) {
    console.log('Season element not found');
    return;
  }
  
  // Check if button already exists
  if (document.getElementById('timetable-export-btn')) {
    return;
  }
  
  // Create download button
  const button = document.createElement('button');
  button.id = 'timetable-export-btn';
  button.textContent = '📅 Download';
  button.style.cssText = `
    margin-left: 15px;
    padding: 8px 16px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    vertical-align: middle;
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.background = '#0052a3';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.background = '#0066cc';
  });
  
  button.addEventListener('click', handleDownloadClick);
  
  // Insert button after the season element
  seasonElement.parentNode.insertBefore(button, seasonElement.nextSibling);
  
  console.log('Download button injected successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectDownloadButton);
} else {
  injectDownloadButton();
}

// Also try to inject after a short delay (in case DOM loads after script)
setTimeout(injectDownloadButton, 1000);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractTimetable') {
    const data = extractTimetableData();
    sendResponse(data);
  }
  return true; // Keep the message channel open for async response
});

