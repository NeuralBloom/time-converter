// Validation functions
function isValidTime24(time) {
    return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
}

function isValidTime12(time) {
    return /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM|am|pm)$/i.test(time);
}

function isValidDecimal(time) {
    if (!/^([01]?[0-9]|2[0-3])\.([0-9]{1,2})$/.test(time)) return false;
    const [hours, minutes] = time.split('.');
    return parseInt(minutes) <= 99;
}

// Conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
    if (!match) return '';
    
    let [_, hours, minutes, period] = match;
    hours = parseInt(hours);
    period = period.toUpperCase();
    
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
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
    if (!e.target.value) {
        document.getElementById('time24').value = '';
        document.getElementById('timeDecimal').value = '';
        return;
    }
    if (isValidTime12(e.target.value)) {
        const time24 = convert12to24(e.target.value);
        document.getElementById('time24').value = time24;
        document.getElementById('timeDecimal').value = standardToDecimal(time24);
    }
});

document.getElementById('time24').addEventListener('input', function(e) {
    if (!e.target.value) {
        document.getElementById('time12').value = '';
        document.getElementById('timeDecimal').value = '';
        return;
    }
    if (isValidTime24(e.target.value)) {
        document.getElementById('time12').value = convert24to12(e.target.value);
        document.getElementById('timeDecimal').value = standardToDecimal(e.target.value);
    }
});

document.getElementById('timeDecimal').addEventListener('input', function(e) {
    if (!e.target.value) {
        document.getElementById('time12').value = '';
        document.getElementById('time24').value = '';
        return;
    }
    if (isValidDecimal(e.target.value)) {
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

    // Validate inputs are not empty
    if (!startTime || !endTime) {
        alert('Please enter both start and end times');
        return;
    }

    // Convert inputs to 24-hour format based on selected format
    try {
        if (startFormat === '12h') {
            if (!isValidTime12(startTime)) {
                alert('Invalid start time format. Use HH:MM AM/PM');
                return;
            }
            startTime = convert12to24(startTime);
        } else if (startFormat === 'decimal') {
            if (!isValidDecimal(startTime)) {
                alert('Invalid decimal time format for start time');
                return;
            }
            startTime = decimalToStandard(startTime);
        } else if (!isValidTime24(startTime)) {
            alert('Invalid 24-hour format for start time');
            return;
        }

        if (endFormat === '12h') {
            if (!isValidTime12(endTime)) {
                alert('Invalid end time format. Use HH:MM AM/PM');
                return;
            }
            endTime = convert12to24(endTime);
        } else if (endFormat === 'decimal') {
            if (!isValidDecimal(endTime)) {
                alert('Invalid decimal time format for end time');
                return;
            }
            endTime = decimalToStandard(endTime);
        } else if (!isValidTime24(endTime)) {
            alert('Invalid 24-hour format for end time');
            return;
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

        // Format the decimal hours
        const decimalHours = (hours + (minutes / 60)).toFixed(2);

        // Show in all formats
        document.getElementById('result12').innerHTML = 
            `<strong>Standard format:</strong> ${hours} hours and ${minutes} minutes`;
        document.getElementById('result24').innerHTML = 
            `<strong>24-hour format:</strong> ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        document.getElementById('resultDecimal').innerHTML = 
            `<strong>Decimal format:</strong> ${decimalHours} hours`;

    } catch (error) {
        alert('Error calculating duration. Please check your input formats.');
        console.error(error);
    }
}

function clearAll() {
    // Clear all input fields
    document.querySelectorAll('input').forEach(input => input.value = '');
    
    // Reset select elements to default
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    
    // Hide results
    document.getElementById('calculationResult').classList.add('hidden');
    document.querySelectorAll('[id^="result"]').forEach(div => {
        div.textContent = '';
    });
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization if needed
});
