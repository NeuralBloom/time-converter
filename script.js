// Validation functions
function isValidTime24(time) {
    return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
}

function isValidTime12(time) {
    return /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM|am|pm)$/.test(time);
}

function isValidDecimal(time) {
    if (!/^([01]?[0-9]|2[0-3])\.([0-9]{1,2})$/.test(time)) return false;
    const [hours, minutes] = time.split('.');
    return parseInt(minutes) <= 99;
}

// Conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function convert24to12(time24h) {
    if (!time24h) return '';
    let [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function decimalToStandard(decimal) {
    if (!decimal) return '';
    const [hours, decimalMinutes] = decimal.split('.');
    const minutes = Math.round((parseInt(decimalMinutes) / 100) * 60);
    return `${hours.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function standardToDecimal(time24h) {
    if (!time24h) return '';
    const [hours, minutes] = time24h.split(':').map(Number);
    const decimalMinutes = Math.round((minutes / 60) * 100);
    return `${hours}.${decimalMinutes.toString().padStart(2, '0')}`;
}

// Time Converter Event Listeners
document.getElementById('time12').addEventListener('input', function(e) {
    if (e.target.value && isValidTime12(e.target.value)) {
        const time24 = convert12to24(e.target.value);
        document.getElementById('time24').value = time24;
        document.getElementById('timeDecimal').value = standardToDecimal(time24);
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    if (e.target.value && isValidTime24(e.target.value)) {
        document.getElementById('time12').value = convert24to12(e.target.value);
        document.getElementById('timeDecimal').value = standardToDecimal(e.target.value);
    }
});

document.getElementById('timeDecimal').addEventListener('input', function(e) {
    if (e.target.value && isValidDecimal(e.target.value)) {
        const time24 = decimalToStandard(e.target.value);
        document.getElementById('time24').value = time24;
        document.getElementById('time12').value = convert24to12(time24);
    }
});

// Calculator functions
function calculateDuration() {
    let startTime = document.getElementById('calcStartTime').value;
    let endTime = document.getElementById('calcEndTime').value;
    const startFormat = document.getElementById('calcStartFormat').value;
    const endFormat = document.getElementById('calcEndFormat').value;

    // Convert inputs to 24-hour format for calculation
    if (startFormat === '12h') {
        if (!startTime.includes('AM') && !startTime.includes('PM')) {
            alert('Please include AM or PM for 12-hour format');
            return;
        }
        startTime = convert12to24(startTime);
    } else if (startFormat === 'decimal') {
        if (!isValidDecimal(startTime)) {
            alert('Invalid decimal time format');
            return;
        }
        startTime = decimalToStandard(startTime);
    }

    if (endFormat === '12h') {
        if (!endTime.includes('AM') && !endTime.includes('PM')) {
            alert('Please include AM or PM for 12-hour format');
            return;
        }
        endTime = convert12to24(endTime);
    } else if (endFormat === 'decimal') {
        if (!isValidDecimal(endTime)) {
            alert('Invalid decimal time format');
            return;
        }
        endTime = decimalToStandard(endTime);
    }

    // Calculate time difference
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    // Display results
    const resultDiv = document.getElementById('calculationResult');
    resultDiv.classList.remove('hidden');

    // Show in all formats
    document.getElementById('result12').textContent = 
        `12-hour format: ${hours} hours and ${minutes} minutes`;
    document.getElementById('result24').textContent = 
        `24-hour format: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    document.getElementById('resultDecimal').textContent = 
        `Decimal format: ${standardToDecimal(hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0'))} hours`;
}

// Clear all fields
function clearAll() {
    // Clear all input fields
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    // Reset select elements to default
    const selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    // Hide results
    const resultDivs = document.querySelectorAll('#calculationResult, [id^="result"]');
    resultDivs.forEach(div => div.classList.add('hidden'));
}

// Initialize event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization if needed
});
