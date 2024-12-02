// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const originalText = element.value || element.textContent;
        if (element.tagName === 'INPUT') {
            element.value = 'Copied!';
            setTimeout(() => element.value = originalText, 1000);
        } else {
            element.textContent = 'Copied!';
            setTimeout(() => element.textContent = originalText, 1000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    setTimeout(() => errorElement.classList.add('hidden'), 3000);
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
    const pattern = /^([01]?[0-9]|2[0-3])\.(\d{1,2})$/;
    if (!pattern.test(time)) return false;
    const [hours, decimal] = time.split('.');
    return parseFloat(hours) >= 0 && parseFloat(hours) < 24 && parseFloat(decimal) <= 99;
}

// Conversion functions
function standardToDecimal(hours, minutes) {
    const decimalMinutes = Math.round((minutes / 60) * 100);
    return `${hours}.${decimalMinutes.toString().padStart(2, '0')}`;
}

function decimalToStandard(decimalTime) {
    const [hours, decimal] = decimalTime.split('.');
    const minutes = Math.round((decimal / 100) * 60);
    return `${hours.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function convert12to24(time12h) {
    if (!time12h) return '';
    
    if (!isValidTime12(time12h)) {
        showError('error12', 'Invalid format. Use "HH:MM AM/PM" (e.g., 2:30 PM)');
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
        showError('error24', 'Invalid format. Use "HH:MM" (e.g., 14:30)');
        return '';
    }
    
    let [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Calculator functions
function calculateDecimalDuration() {
    const startTime = document.getElementById('startTimeDecimal').value;
    const endTime = document.getElementById('endTimeDecimal').value;
    
    if (!isValidDecimal(startTime)) {
        showError('errorStartDecimal', 'Invalid decimal time format (e.g., 14.50)');
        return;
    }
    if (!isValidDecimal(endTime)) {
        showError('errorEndDecimal', 'Invalid decimal time format (e.g., 17.75)');
        return;
    }

    const start = parseFloat(startTime);
    const end = parseFloat(endTime);
    let duration = end - start;
    
    // Handle overnight shifts
    if (duration < 0) {
        duration += 24;
    }
    
    // Format result to 2 decimal places
    const formattedDuration = duration.toFixed(2);
    
    const durationDiv = document.getElementById('durationDecimal');
    const durationResult = document.getElementById('durationResultDecimal');
    durationDiv.classList.remove('hidden');
    durationResult.textContent = `${formattedDuration} decimal hours`;
}

function calculateStandardDuration() {
    const startTime = document.getElementById('startTimeStd').value;
    const endTime = document.getElementById('endTimeStd').value;
    
    if (!isValidTime24(startTime)) {
        showError('errorStartStd', 'Invalid 24-hour format (e.g., 14:30)');
        return;
    }
    if (!isValidTime24(endTime)) {
        showError('errorEndStd', 'Invalid 24-hour format (e.g., 17:45)');
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
    
    const durationDiv = document.getElementById('durationStd');
    const durationResult = document.getElementById('durationResultStd');
    durationDiv.classList.remove('hidden');
    
    // Also show decimal format
    const decimalHours = standardToDecimal(hours, minutes);
    durationResult.textContent = `${hours}:${minutes.toString().padStart(2, '0')} (${decimalHours} decimal hours)`;
}

// Event listeners
document.getElementById('time12').addEventListener('input', function(e) {
    const time24 = convert12to24(e.target.value);
    if (time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        document.getElementById('time24').value = time24;
        document.getElementById('timeDecimal').value = standardToDecimal(hours, minutes);
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    if (isValidTime24(e.target.value)) {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        document.getElementById('time12').value = convert24to12(e.target.value);
        document.getElementById('timeDecimal').value = standardToDecimal(hours, minutes);
    }
});

document.getElementById('timeDecimal').addEventListener('input', function(e) {
    if (!isValidDecimal(e.target.value)) {
        showError('errorDecimal', 'Invalid decimal format (e.g., 14.50)');
        return;
    }
    
    const standardTime = decimalToStandard(e.target.value);
    document.getElementById('time24').value = standardTime;
    document.getElementById('time12').value = convert24to12(standardTime);
});

// Add input masks for better user experience
function addInputMask(inputElement, pattern) {
    inputElement.addEventListener('keypress', function(e) {
        if (!pattern.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
            e.preventDefault();
        }
    });
}

// Initialize input masks
document.addEventListener('DOMContentLoaded', function() {
    addInputMask(document.getElementById('time24'), /[\d:]$/);
    addInputMask(document.getElementById('timeDecimal'), /[\d.]$/);
    addInputMask(document.getElementById('startTimeStd'), /[\d:]$/);
    addInputMask(document.getElementById('endTimeStd'), /[\d:]$/);
    addInputMask(document.getElementById('startTimeDecimal'), /[\d.]$/);
    addInputMask(document.getElementById('endTimeDecimal'), /[\d.]$/);
});
