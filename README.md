# Time Converter & Calculator

A web-based tool for converting between different time formats and calculating time durations. This tool handles 12-hour, 24-hour, and decimal time formats.

## Features

### Time Format Converter
- Convert between:
  - 12-hour format (2:30 PM)
  - 24-hour format (14:30)
  - Decimal format (14.50)
- Real-time conversion as you type
- Input validation for all formats

### Time Duration Calculator
- Calculate time differences using any time format
- Support for:
  - 12-hour format with AM/PM
  - 24-hour format
  - Decimal time format
- Results displayed in all three formats
- Handles overnight time spans

## Usage

### Time Converter
1. Enter a time in any of the three input fields
2. The other fields will automatically update with the converted values
3. Formats:
   - 12-hour: HH:MM AM/PM (e.g., 2:30 PM)
   - 24-hour: HH:MM (e.g., 14:30)
   - Decimal: HH.MM (e.g., 14.50)

### Duration Calculator
1. Enter start time and end time
2. Select the format for each input
3. Click "Calculate Duration"
4. View results in all three formats

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/time-converter.git

Open index.html in a web browser

File Structure
Copytime-converter/
├── index.html
├── script.js
└── README.md
Technical Details
Technologies Used

HTML5
JavaScript
Tailwind CSS for styling

Time Format Specifications

12-hour format: HH:MM AM/PM (1:00 AM to 12:59 PM)
24-hour format: HH:MM (00:00 to 23:59)
Decimal format: HH.MM (00.00 to 23.99)

Examples
Time Conversion

2:30 PM → 14:30 → 14.50
9:45 AM → 09:45 → 09.75
23:30 → 11:30 PM → 23.50

Duration Calculation
Start Time: 09:30 AM
End Time: 2:45 PM
Result:

Standard: 5 hours and 15 minutes
24-hour: 05:15
Decimal: 5.25 hours

Browser Compatibility

Chrome (recommended)
Firefox
Safari
Edge

Contributing

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Create a Pull Request

License
MIT License - feel free to use and modify for your own projects.
Author
NeuralBloom
Acknowledgments

Tailwind CSS for the styling framework
JavaScript Date object for time calculations
