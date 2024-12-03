// Validation functions
function isValidTime24(time) {
    const pattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return pattern.test(time);
}

function isValidTime12(time) {
    const pattern = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
    return pattern.test(time);
}

function isValidDecimal(time) {
    const pattern = /^([01]?[0-9]|2[0-3])\.([0-9]{1,2})$/;
    if (!pattern.test(time)) return false;
    const [hours, decimal] = time.split('.');
    return parseFloat(hours) >= 0 && parseFloat(hours) < 24 && parseFloat(decimal) <= 99;
}

// Basic conversion functions
function convert12to24(time12h, period) {
    if (!time12h) return '';
    
    let [hours, minutes] = time12h.split(':');
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
    
    return {
        time: `${hours}:${minutes}`,
        period: period
    };
}

function convertToDecimal(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':').map(Number);
    const decimalMinutes = (minutes / 60) * 100;
    return `${hours}.${Math.round(decimalMinutes).toString().padStart(2, '0')}`;
}

function convertFromDecimal(decimal) {
    if (!decimal) return '';
    if (!isValidDecimal(decimal)) return '';
    
    const [hours, decimalMinutes] = decimal.split('.');
    const minutes = Math.round((parseInt(decimalMinutes) / 100) * 60);
    return `${hours.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Time Converter Event Handlers
document.getElementById('time12').addEventListener('input', function(e) {
    if (e.target.value === '') {
        document.getElementById('time24').value = '';
        document.getElementById('timeDecimal').value = '';
        return;
    }

    const time12Input = e.target.value;
    const match = time12Input.match(/^(0?[1-9]|1[0-2]):([0-5][0-9]) ?(am|pm|AM|PM)$/);
    
    if (match) {
        const period = match[3].toUpperCase();
        const time24 = convert12to24(`${match[1]}:${match[2]}`, period);
        document.getElementById('time24').value = time24;
        document.getElementById('timeDecimal').value = convertToDecimal(time24);
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    if (e.target.value === '') {
        document.getElementById('time12').value = '';
        document.getElementById('timeDecimal').value = '';
        return;
    }

    if (isValidTime24(e.target.value)) {
        const result = convert24to12(e.target.value);
        document.getElementById('time12').value = `${result.time} ${result.period}`;
        document.getElementById('timeDecimal').value = convertToDecimal(e.target.value);
    }
});

document.getElementById('timeDecimal').addEventListener('input', function(e) {
    if (e.target.value === '') {
        document.getElementById('time12').value = '';
        document.getElementById('time24').value = '';
        return;
    }

    if (isValidDecimal(e.target.value)) {
        const time24 = convertFromDecimal(e.target.value);
        document.getElementById('time24').value = time24;
        const result = convert24to12(time24);
        document.getElementById('time12').value = `${result.time} ${result.period}`;
    }
});

// Time Calculator Event Handlers
document.getElementById('startTime12').addEventListener('input', function(e) {
    if (isValidTime12(e.target.value)) {
        const period = document.getElementById('startPeriod').value;
        const time24 = convert12to24(e.target.value, period);
        document.getElementById('startTime24').value = time24;
        document.getElementById('startTimeDecimal').value = convertToDecimal(time24);
    }
});

document.getElementById('endTime12').addEventListener('input', function(e) {
    if (isValidTime12(e.target.value)) {
        const period = document.getElementById('endPeriod').value;
        const time24 = convert12to24(e.target.value, period);
        document.getElementById('endTime24').value = time24;
        document.getElementById('endTimeDecimal').value = convertToDecimal(time24);
    }
});

document.getElementById('startTime24').addEventListener('input', function(e) {
    if (isValidTime24(e.target.value)) {
        const result = convert24to12(e.target.value);
        document.getElementById('startTime12').value = result.time;
        document.getElementById('startPeriod').value = result.period;
        document.getElementById('startTimeDecimal').value = convertToDecimal(e.target.value);
    }
});

document.getElementById('endTime24').addEventListener('input', function(e) {
    if (isValidTime24(e.target.value)) {
        const result = convert24to12(e.target.value);
        document.getElementById('endTime12').value = result.time;
        document.getElementById('endPeriod').value = result.period;
        document.getElementById('endTimeDecimal').value = convertToDecimal(e.target.value);
    }
});

// Period select change handlers
['startPeriod', 'endPeriod'].forEach(id => {
    document.getElementById(id).addEventListener('change', function(e) {
        const timeInput = id === 'startPeriod' ? 'startTime12' : 'endTime12';
        const time12 = document.getElementById(timeInput).value;
        if (time12 && isValidTime12(time12)) {
            const time24 = convert12to24(time12, e.target.value);
            document.getElementById(id === 'startPeriod' ? 'startTime24' : 'endTime24').value = time24;
            document.getElementById(id === 'startPeriod' ? 'startTimeDecimal' : 'endTimeDecimal').value = convertToDecimal(time24);
        }
    });
});

function calculateDuration() {
    const startTime24 = document.getElementById('startTime24').value;
    const endTime24 = document.getElementById('endTime24').value;

    if (!isValidTime24(startTime24) || !isValidTime24(endTime24)) {
        alert('Please enter valid times');
        return;
    }

    const [startHours, startMinutes] = startTime24.split(':').map(Number);
    const [endHours, endMinutes] = endTime24.split(':').map(Number);

    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    // Show result in all formats
    const durationDiv = document.getElementById('duration');
    const duration12 = document.getElementById('duration12');
    const duration24 = document.getElementById('duration24');
    const durationDecimal = document.getElementById('durationDecimal');

    durationDiv.classList.remove('hidden');

    // 12-hour format
    duration12.textContent = `12-hour: ${hours} hours and ${minutes} minutes`;
    
    // 24-hour format
    duration24.textContent = `24-hour: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Decimal format
    const decimalHours = (hours + minutes / 60).toFixed(2);
    durationDecimal.textContent = `Decimal: ${decimalHours} hours`;
}

function clearAll() {
    // Clear all input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    // Reset all selects to first option
    const selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    // Hide all result divs
    const results = document.querySelectorAll('[id^="duration"]');
    results.forEach(div => {
        if (div.classList.contains('hidden')) return;
        div.classList.add('hidden');
    });
}

// Initialize event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here if needed
});
