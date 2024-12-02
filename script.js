// Utility functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.textContent = message;
        // Auto-hide error after 3 seconds
        setTimeout(() => element.classList.add('hidden'), 3000);
    }
}

function clearAll() {
    // Clear all input fields
    document.querySelectorAll('input').forEach(input => input.value = '');
    
    // Reset all selects to first option
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    
    // Hide all result divs
    document.querySelectorAll('[id$="Result"]').forEach(div => div.classList.add('hidden'));
}

// Validation functions
function isValidTime24(time) {
    const pattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return pattern.test(time);
}

function isValidTime12(time) {
    const pattern = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM|am|pm)$/;
    return pattern.test(time);
}

function isValidDecimal(time) {
    const pattern = /^([01]?[0-9]|2[0-3])\.([0-9]{1,2})$/;
    if (!pattern.test(time)) return false;
    const [hours, decimal] = time.split('.');
    return parseFloat(hours) >= 0 && parseFloat(hours) < 24 && parseFloat(decimal) <= 99;
}

// Time conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    
    if (!isValidTime12(time12h)) {
        showError('time12Error', 'Invalid 12-hour format (e.g., 2:30 PM)');
        return '';
    }
    
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function convert24to12(time24h) {
    if (!time24h) return '';
    
    if (!isValidTime24(time24h)) {
        showError('time24Error', 'Invalid 24-hour format (e.g., 14:30)');
        return '';
    }
    
    let [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function convertToDecimal(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':').map(Number);
    const decimalMinutes = (minutes / 60) * 100;
    return `${hours}.${Math.round(decimalMinutes).toString().padStart(2, '0')}`;
}

function convertFromDecimal(decimal) {
    if (!decimal) return '';
    
    const [hours, minutes] = decimal.split('.');
    const standardMinutes = Math.round((Number(`0.${minutes}`) * 60));
    return `${hours.padStart(2, '0')}:${standardMinutes.toString().padStart(2, '0')}`;
}

// Time calculation functions
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!isValidTime24(startTime) || !isValidTime24(endTime)) {
        showError('durationError', 'Invalid time format');
        return;
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    const durationDiv = document.getElementById('duration');
    const resultDiv = document.getElementById('durationResult');
    durationDiv.classList.remove('hidden');
    
    // Show results in all formats
    const decimal = (diffMinutes / 60).toFixed(2);
    resultDiv.innerHTML = `
        Standard: ${hours}h ${minutes}m<br>
        Decimal: ${decimal}h
    `;
}

function calculateTimeOperation() {
    const baseTime = document.getElementById('baseTime').value;
    const amount = document.getElementById('timeAmount').value;
    const unit = document.getElementById('timeUnit').value;
    const operation = document.getElementById('operation').value;
    
    if (!isValidTime24(baseTime)) {
        showError('timeOpError', 'Invalid time format');
        return;
    }
    
    if (!amount || isNaN(amount)) {
        showError('timeOpError', 'Invalid amount');
        return;
    }
    
    let [hours, minutes] = baseTime.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;
    
    // Calculate new time
    const modifier = operation === 'add' ? 1 : -1;
    if (unit === 'minutes') {
        totalMinutes += modifier * Number(amount);
    } else {
        totalMinutes += modifier * Number(amount) * 60;
    }
    
    // Handle day wrapping
    while (totalMinutes >= 1440) totalMinutes -= 1440;
    while (totalMinutes < 0) totalMinutes += 1440;
    
    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;
    const time24 = `${resultHours.toString().padStart(2, '0')}:${resultMinutes.toString().padStart(2, '0')}`;
    
    const resultDiv = document.getElementById('timeOpResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
        24-hour: ${time24}<br>
        12-hour: ${convert24to12(time24)}<br>
        Decimal: ${convertToDecimal(time24)}
    `;
}

// Timezone conversion
function initializeTimezones() {
    const timezones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Paris', label: 'Paris (CET)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
    ];
    
    const fromTz = document.getElementById('fromTz');
    const toTz = document.getElementById('toTz');
    
    timezones.forEach(tz => {
        fromTz.add(new Option(tz.label, tz.value));
        toTz.add(new Option(tz.label, tz.value));
    });
}

function convertTimezone() {
    const time = document.getElementById('tzTime').value;
    const fromTz = document.getElementById('fromTz').value;
    const toTz = document.getElementById('toTz').value;
    
    if (!isValidTime24(time)) {
        showError('tzError', 'Invalid time format');
        return;
    }
    
    try {
        const date = new Date();
        const [hours, minutes] = time.split(':');
        date.setHours(hours);
        date.setMinutes(minutes);
        
        const result = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: toTz
        }).format(date);
        
        const resultDiv = document.getElementById('tzResult');
        resultDiv.classList.remove('hidden');
        resultDiv.textContent = `Result: ${result}`;
    } catch (error) {
        showError('tzError', 'Error converting timezone');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeTimezones();
    
    // Time converter listeners
    document.getElementById('time12').addEventListener('input', function(e) {
        const time24 = convert12to24(e.target.value);
        if (time24) {
            document.getElementById('time24').value = time24;
            document.getElementById('timeDecimal').value = convertToDecimal(time24);
        }
    });
    
    document.getElementById('time24').addEventListener('input', function(e) {
        if (isValidTime24(e.target.value)) {
            document.getElementById('time12').value = convert24to12(e.target.value);
            document.getElementById('timeDecimal').value = convertToDecimal(e.target.value);
        }
    });
    
    document.getElementById('timeDecimal').addEventListener('input', function(e) {
        if (isValidDecimal(e.target.value)) {
            const time24 = convertFromDecimal(e.target.value);
            document.getElementById('time24').value = time24;
            document.getElementById('time12').value = convert24to12(time24);
        }
    });
});
