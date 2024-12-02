// Enhanced utility functions
function clearAllFields() {
    // Clear converter fields
    ['time12', 'time24', 'timeDecimal'].forEach(id => {
        document.getElementById(id).value = '';
    });

    // Clear calculator fields
    ['startTime12', 'endTime12', 'startTime24', 'endTime24', 'timeAmount', 'breakDuration'].forEach(id => {
        document.getElementById(id)?.value = '';
    });

    // Reset selects to defaults
    ['startPeriod', 'endPeriod', 'timeUnit', 'operation', 'breakUnit'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.selectedIndex = 0;
    });

    // Hide results
    ['durationStd', 'operationResult', 'durationDecimal'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });

    // Clear error messages
    document.querySelectorAll('[id^="error"]').forEach(element => {
        element.classList.add('hidden');
    });
}

// Enhanced time conversion functions
function convert12to24WithPeriod(time12h, period) {
    if (!time12h) return '';
    
    let [hours, minutes] = time12h.split(':').map(Number);
    
    if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Advanced calculation functions
function addTime(time24h, amount, unit) {
    let [hours, minutes] = time24h.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes;

    switch(unit) {
        case 'minutes':
            totalMinutes += parseInt(amount);
            break;
        case 'hours':
            totalMinutes += parseInt(amount) * 60;
            break;
        case 'decimal':
            totalMinutes += parseFloat(amount) * 60;
            break;
    }

    // Handle overnight wrapping
    while (totalMinutes >= 24 * 60) {
        totalMinutes -= 24 * 60;
    }
    while (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }

    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

function performTimeOperation() {
    const amount = document.getElementById('timeAmount').value;
    const unit = document.getElementById('timeUnit').value;
    const operation = document.getElementById('operation').value;
    const startTime24 = document.getElementById('startTime24').value;

    if (!isValidTime24(startTime24)) {
        showError('errorStart24', 'Please enter a valid start time');
        return;
    }

    if (!amount || isNaN(amount)) {
        showError('errorOperation', 'Please enter a valid amount');
        return;
    }

    const operationAmount = operation === 'subtract' ? -amount : amount;
    const result24h = addTime(startTime24, operationAmount, unit);
    const result12h = convert24to12(result24h);
    const resultDecimal = standardToDecimal(...result24h.split(':').map(Number));

    const resultDiv = document.getElementById('operationResult');
    const resultText = document.getElementById('operationResultText');
    resultDiv.classList.remove('hidden');
    resultText.innerHTML = `
        12-hour: ${result12h}<br>
        24-hour: ${result24h}<br>
        Decimal: ${resultDecimal}
    `;
}

function calculateWithBreak() {
    const startTime24 = document.getElementById('startTime24').value;
    const endTime24 = document.getElementById('endTime24').value;
    const breakDuration = document.getElementById('breakDuration').value;
    const breakUnit = document.getElementById('breakUnit').value;

    if (!isValidTime24(startTime24) || !isValidTime24(endTime24)) {
        showError('errorTime', 'Please enter valid start and end times');
        return;
    }

    if (!breakDuration || isNaN(breakDuration)) {
        showError('errorBreak', 'Please enter a valid break duration');
        return;
    }

    // Convert break duration to minutes
    let breakMinutes;
    switch(breakUnit) {
        case 'minutes':
            breakMinutes = parseInt(breakDuration);
            break;
        case 'hours':
            breakMinutes = parseInt(breakDuration) * 60;
            break;
        case 'decimal':
            breakMinutes = Math.round(parseFloat(breakDuration) * 60);
            break;
    }

    // Calculate total duration minus break
    const [startHours, startMinutes] = startTime24.split(':').map(Number);
    const [endHours, endMinutes] = endTime24.split(':').map(Number);
    
    let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const netMinutes = totalMinutes - breakMinutes;
    const netHours = Math.floor(netMinutes / 60);
    const remainingMinutes = netMinutes % 60;

    const durationDiv = document.getElementById('durationStd');
    const durationResult = document.getElementById('durationResultStd');
    durationDiv.classList.remove('hidden');
    
    durationResult.innerHTML = `
        Total Time: ${Math.floor(totalMinutes / 60)}:${(totalMinutes % 60).toString().padStart(2, '0')}<br>
        Break Time: ${Math.floor(breakMinutes / 60)}:${(breakMinutes % 60).toString().padStart(2, '0')}<br>
        Net Time: ${netHours}:${remainingMinutes.toString().padStart(2, '0')}
    `;

    // Also show in decimal format
    const decimalResult = document.getElementById('durationDecimalResultStd');
    const decimalTotal = (totalMinutes / 60).toFixed(2);
    const decimalBreak = (breakMinutes / 60).toFixed(2);
    const decimalNet = (netMinutes / 60).toFixed(2);
    
    decimalResult.innerHTML = `
        Decimal Format:<br>
        Total: ${decimalTotal}h<br>
        Break: ${decimalBreak}h<br>
        Net: ${decimalNet}h
    `;
}

// Event listeners for 12-hour time fields
document.getElementById('startTime12')?.addEventListener('input', function(e) {
    const period = document.getElementById('startPeriod').value;
    const time24 = convert12to24WithPeriod(e.target.value, period);
    if (time24) {
        document.getElementById('startTime24').value = time24;
    }
});

document.getElementById('endTime12')?.addEventListener('input', function(e) {
    const period = document.getElementById('endPeriod').value;
    const time24 = convert12to24WithPeriod(e.target.value, period);
    if (time24) {
        document.getElementById('endTime24').value = time24;
    }
});

// Period select change handlers
['startPeriod', 'endPeriod'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', function(e) {
        const timeInput = id === 'startPeriod' ? 'startTime12' : 'endTime12';
        const time12 = document.getElementById(timeInput).value;
        if (time12) {
            const time24 = convert12to24WithPeriod(time12, e.target.value);
            document.getElementById(id === 'startPeriod' ? 'startTime24' : 'endTime24').value = time24;
        }
    });
});

// Initialize input masks and event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input masks for time fields
    const timeInputs = document.querySelectorAll('input[type="text"]');
    timeInputs.forEach(input => {
        if (input.id.includes('12')) {
            addInputMask(input, /[\d:]$/);
        } else if (input.id.includes('24')) {
            addInputMask(input, /[\d:]$/);
        } else if (input.id.includes('Decimal')) {
            addInputMask(input, /[\d.]$/);
        }
    });
});
