// Validation functions
function isValidTime24(time) {
    const pattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return pattern.test(time);
}

function isValidTime12(time) {
    const pattern = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM|am|pm)$/;
    return pattern.test(time);
}

function normalizeMinutes(minutes) {
    minutes = parseInt(minutes);
    if (minutes > 59) {
        const extraHours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        return { minutes, extraHours };
    }
    return { minutes, extraHours: 0 };
}

// Conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    
    // Clear previous errors
    document.getElementById('error12').classList.add('hidden');
    
    if (!isValidTime12(time12h)) {
        const error = document.getElementById('error12');
        error.textContent = 'Invalid format. Use "HH:MM AM/PM" (e.g., 2:45 PM)';
        error.classList.remove('hidden');
        return '';
    }
    
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    // Normalize minutes
    const { minutes: normalizedMinutes, extraHours } = normalizeMinutes(minutes);
    hours = parseInt(hours) + extraHours;
    
    if (period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${normalizedMinutes.toString().padStart(2, '0')}`;
}

function convert24to12(time24h) {
    if (!time24h) return '';
    
    // Clear previous errors
    document.getElementById('error24').classList.add('hidden');
    
    if (!isValidTime24(time24h)) {
        const error = document.getElementById('error24');
        error.textContent = 'Invalid format. Use "HH:MM" (e.g., 14:45)';
        error.classList.remove('hidden');
        return '';
    }
    
    let [hours, minutes] = time24h.split(':');
    hours = parseInt(hours);
    
    // Normalize minutes
    const { minutes: normalizedMinutes, extraHours } = normalizeMinutes(minutes);
    hours = (hours + extraHours) % 24;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${normalizedMinutes.toString().padStart(2, '0')} ${period}`;
}

function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const errorStart = document.getElementById('errorStart');
    const errorEnd = document.getElementById('errorEnd');
    
    // Clear previous errors
    errorStart.classList.add('hidden');
    errorEnd.classList.add('hidden');
    
    // Validate inputs
    if (!isValidTime24(startTime)) {
        errorStart.textContent = 'Invalid start time format. Use 24-hour format (e.g., 14:45)';
        errorStart.classList.remove('hidden');
        return;
    }
    
    if (!isValidTime24(endTime)) {
        errorEnd.textContent = 'Invalid end time format. Use 24-hour format (e.g., 17:30)';
        errorEnd.classList.remove('hidden');
        return;
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    // Handle overnight shifts
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    const durationDiv = document.getElementById('duration');
    const durationResult = document.getElementById('durationResult');
    durationDiv.classList.remove('hidden');
    
    // Format the output
    let durationText = '';
    if (hours > 0) {
        durationText += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        if (hours > 0) durationText += ' and ';
        durationText += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    if (hours === 0 && minutes === 0) {
        durationText = '0 minutes';
    }
    
    durationResult.textContent = durationText;
}

// Event listeners
document.getElementById('time12').addEventListener('input', function(e) {
    const time24 = convert12to24(e.target.value);
    if (time24) {
        document.getElementById('time24').value = time24;
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    const time12 = convert24to12(e.target.value);
    if (time12) {
        document.getElementById('time12').value = time12;
    }
});
