// Time conversion functions
function convert12to24(time12h) {
    if (!time12h) return '';
    
    const [time, period] = time12h.split(' ');
    if (!period) return '';
    
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

function calculateDuration() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (!startTime || !endTime) {
        alert('Please enter both start and end times');
        return;
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let diffMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    const durationDiv = document.getElementById('duration');
    const durationResult = document.getElementById('durationResult');
    durationDiv.classList.remove('hidden');
    durationResult.textContent = `${hours} hours and ${minutes} minutes`;
}

// Event listeners
document.getElementById('time12').addEventListener('input', function(e) {
    const time24 = convert12to24(e.target.value);
    document.getElementById('time24').value = time24;
});

document.getElementById('time24').addEventListener('input', function(e) {
    const time12 = convert24to12(e.target.value);
    document.getElementById('time12').value = time12;
});
