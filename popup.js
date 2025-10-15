// Semester date mapping with support for breaks (multiple periods)
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

// Auto-detect semester dates from season text (rule-based)
function getSemesterDates(seasonText) {
  if (!seasonText) return null;
  
  const normalized = seasonText.trim().toUpperCase();
  
  // Direct match
  if (SEMESTER_DATES[normalized]) {
    return SEMESTER_DATES[normalized];
  }
  
  // Try partial match (e.g., "2025 AUTUMN" in "2025 AUTUMN SEMESTER")
  for (const key in SEMESTER_DATES) {
    if (normalized.includes(key)) {
      return SEMESTER_DATES[key];
    }
  }
  
  return null;
}

// Check if a date falls within any active semester period
function isDateInSemester(date, semesterData) {
  if (!semesterData || !semesterData.periods) return false;
  
  const checkDate = new Date(date);
  for (const period of semesterData.periods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    if (checkDate >= start && checkDate <= end) {
      return true;
    }
  }
  return false;
}

// Get the overall start and end dates for display
function getSemesterRange(semesterData) {
  if (!semesterData || !semesterData.periods || semesterData.periods.length === 0) {
    return null;
  }
  
  const firstPeriod = semesterData.periods[0];
  const lastPeriod = semesterData.periods[semesterData.periods.length - 1];
  
  return {
    start: firstPeriod.start,
    end: lastPeriod.end
  };
}

function parseSchedule(scheduleText) {
  console.log('Parsing schedule:', scheduleText);
  if (!scheduleText) return [];
  
  // Remove parentheses
  scheduleText = scheduleText.replace(/\(/g, '').replace(/\)/g, '');
  const slots = scheduleText.split(',').map(s => s.trim());
  const timeSlots = [];
  
  const normalTimes = {
    '1': { start: '08:45', end: '10:00' },
    '2': { start: '10:10', end: '11:25' },
    '3': { start: '11:35', end: '12:50' },
    '4': { start: '14:00', end: '15:15' },
    '5': { start: '15:25', end: '16:40' },
    '6': { start: '16:50', end: '18:05' },
    '7': { start: '18:15', end: '19:30' }
  };
  
  const superTimes = {
    '4': { start: '13:20', end: '15:15' },
    '5': { start: '15:25', end: '17:20' },
    '7': { start: '18:15', end: '20:10' }
  };
  
  const daysMap = {
    'M': 'Monday',
    'T': 'Tuesday',
    'TU': 'Tuesday',
    'W': 'Wednesday',
    'TH': 'Thursday',
    'F': 'Friday',
    'MON': 'Monday',
    'TUE': 'Tuesday',
    'WED': 'Wednesday',
    'THU': 'Thursday',
    'FRI': 'Friday'
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
    
    if (!period || !day || !daysMap[day]) {
      console.log('Invalid format, skipping slot:', slot);
      continue;
    }
    
    const timeRange = isSuper && superTimes[period] ? superTimes[period] : normalTimes[period];
    
    if (timeRange) {
      timeSlots.push({
        day: daysMap[day],
        period,
        start: timeRange.start,
        end: timeRange.end,
        isSuper
      });
    }
  }
  
  console.log('Final time slots:', timeSlots);
  return timeSlots;
}

// Get the date for a specific day of the week in a given week
function getDateForDay(semesterStart, weekOffset, dayName) {
  const start = new Date(semesterStart);
  const dayMapping = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 0
  };
  
  // Calculate the target date
  const startDay = start.getDay();
  const targetDay = dayMapping[dayName];
  let daysToAdd = targetDay - startDay;
  
  if (daysToAdd < 0) daysToAdd += 7;
  
  const targetDate = new Date(start);
  targetDate.setDate(start.getDate() + daysToAdd + (weekOffset * 7));
  
  return targetDate;
}

// Format date for ICS file
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

// Generate ICS file content (handles breaks automatically)
function generateICS(courses, semesterStart, semesterEnd, semesterData = null) {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timetable Exporter//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  
  courses.forEach(course => {
    const timeSlots = parseSchedule(course.schedule);
    
    timeSlots.forEach(slot => {
      // Calculate total weeks from start to end
      const start = new Date(semesterStart);
      const end = new Date(semesterEnd);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.ceil(diffDays / 7) + 1; // +1 to ensure we cover the end date
      
      // Create events for each week, but skip dates outside semester periods
      for (let week = 0; week < totalWeeks; week++) {
        const eventDate = getDateForDay(semesterStart, week, slot.day);
        
        // If semester data is provided, check if this date is within valid periods
        if (semesterData && !isDateInSemester(eventDate, semesterData)) {
          continue; // Skip dates during breaks
        }
        
        // Also check manual date range
        if (eventDate < new Date(semesterStart) || eventDate > new Date(semesterEnd)) {
          continue; // Skip dates outside the range
        }
        
        const startDateTime = formatICSDate(eventDate, slot.start);
        const endDateTime = formatICSDate(eventDate, slot.end);
        
        // Create unique ID for each event
        const uid = `${course.code}-${slot.day}-${slot.period}-week${week}@timetable-exporter`;
        
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:${uid}`);
        icsContent.push(`DTSTART:${startDateTime}`);
        icsContent.push(`DTEND:${endDateTime}`);
        icsContent.push(`SUMMARY:${course.code} - ${course.name}`);
        
        const location = course.room ? course.room : 'TBA';
        icsContent.push(`LOCATION:${location}`);
        
        const description = `Course: ${course.code}\\nInstructor: ${course.instructor}\\nPeriod: ${slot.period}`;
        icsContent.push(`DESCRIPTION:${description}`);
        
        icsContent.push('END:VEVENT');
      }
    });
  });
  
  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

// Download ICS file
function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      showMessage('Error downloading file: ' + chrome.runtime.lastError.message, 'error');
    } else {
      showMessage('Successfully exported timetable!', 'success');
    }
    URL.revokeObjectURL(url);
  });
}

// Show message to user
function showMessage(text, type = 'info') {
  const messageDiv = document.getElementById('message');
  messageDiv.className = type;
  messageDiv.textContent = text;
  messageDiv.style.display = 'block';
}

// Display courses
function displayCourses(courses) {
  const courseList = document.getElementById('courseList');
  courseList.innerHTML = '';
  
  if (courses.length === 0) {
    showMessage('No courses found on this page', 'error');
    return;
  }
  
  courseList.style.display = 'block';
  
  courses.forEach(course => {
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';
    courseItem.innerHTML = `
      <div class="course-code">${course.code}</div>
      <div class="course-details">
        ${course.name}<br>
        Instructor: ${course.instructor}<br>
        Time: ${course.schedule} | Room: ${course.room}
      </div>
    `;
    courseList.appendChild(courseItem);
  });
  
  showMessage(`Found ${courses.length} course(s)`, 'info');
}

// Main export function
async function exportTimetable() {
  const exportBtn = document.getElementById('exportBtn');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Extracting data...';
  
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to extract data
    chrome.tabs.sendMessage(tab.id, { action: 'extractTimetable' }, (response) => {
      if (chrome.runtime.lastError) {
        showMessage('Error: ' + chrome.runtime.lastError.message, 'error');
        exportBtn.disabled = false;
        exportBtn.textContent = 'Export to Calendar (.ics)';
        return;
      }
      
      if (response.error) {
        showMessage(response.error, 'error');
        exportBtn.disabled = false;
        exportBtn.textContent = 'Export to Calendar (.ics)';
        return;
      }
      
      const courses = response.courses;
      displayCourses(courses);
      
      if (courses.length > 0) {
        const semesterStart = document.getElementById('semesterStart').value;
        const semesterEnd = document.getElementById('semesterEnd').value;
        
        // Get semester data for break handling
        const semesterData = response.season ? getSemesterDates(response.season) : null;
        
        const icsContent = generateICS(courses, semesterStart, semesterEnd, semesterData);
        const filename = `timetable_${response.season.replace(/\s+/g, '_')}.ics`;
        
        downloadICS(icsContent, filename);
      }
      
      exportBtn.disabled = false;
      exportBtn.textContent = 'Export to Calendar (.ics)';
    });
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export to Calendar (.ics)';
  }
}

// Initialize
document.getElementById('exportBtn').addEventListener('click', exportTimetable);

// Auto-load courses on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'extractTimetable' }, (response) => {
    if (response && !response.error && response.courses) {
      displayCourses(response.courses);
      
      // Auto-detect and set semester dates if available
      if (response.season) {
        const semesterData = getSemesterDates(response.season);
        if (semesterData) {
          const dateRange = getSemesterRange(semesterData);
          if (dateRange) {
            document.getElementById('semesterStart').value = dateRange.start;
            document.getElementById('semesterEnd').value = dateRange.end;
            
            // Show info about breaks if applicable
            if (semesterData.periods.length > 1) {
              const breakInfo = ` (includes ${semesterData.periods.length} periods, breaks excluded)`;
              showMessage(`Auto-detected: ${response.season} (${dateRange.start} to ${dateRange.end})${breakInfo}`, 'info');
            } else {
              showMessage(`Auto-detected: ${response.season} (${dateRange.start} to ${dateRange.end})`, 'info');
            }
          }
        }
      }
    }
  });
});

