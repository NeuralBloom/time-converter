// Validation functions
function isValidTime24(time) {
    const pattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return pattern.test(time);
}

function isValidTime12(time) {
    const pattern = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM|am|pm)$/;
    return pattern.test(time);
}

// Basic conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    
    const [time, period] = time12h.split(' ');
    if (!time || !period) return '';
    
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function convert24to12(time24h) {
    if (!time24h) return '';
    
    let [hours, minutes] = time24h.split(':');
    hours = parseInt(hours);
    
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${period}`;
}

function convertToDecimal(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':').map(Number);
    const decimalMinutes = (minutes / 60) * 100;
    return `${hours}.${Math.round(decimalMinutes).toString().padStart(2, '0')}`;
}

// Duration calculation
function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!isValidTime24(startTime) || !isValidTime24(endTime)) {
        alert('Please enter valid times in 24-hour format (e.g., 14:30)');
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
    resultDiv.textContent = `${hours} hours and ${minutes} minutes`;
}

// Event listeners
document.getElementById('time12').addEventListener('input', function(e) {
    const time24 = convert12to24(e.target.value);
    if (time24) {
        document.getElementById('time24').value = time24;
        document.getElementById('timeDecimal').value = convertToDecimal(time24);
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    const time12 = convert24to12(e.target.value);
    if (time12) {
        document.getElementById('time12').value = time12;
        document.getElementById('timeDecimal').value = convertToDecimal(e.target.value);
    }
});

// Clear function
function clearAll() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    const results = document.querySelectorAll('[id$="Result"]');
    results.forEach(div => div.classList.add('hidden'));
}
