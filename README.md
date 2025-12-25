# Glucose Tracker Application

This application allows you to track food intake, water consumption, and glucose levels manually. Since your glucose sensor is external and doesn't connect directly to the application, you can manually enter glucose readings and correlate them with your food and water intake.

## Features

- **Food Tracking**: Record meals with details like carbs, protein, fat, and calories
- **Water Tracking**: Log your daily water intake
- **Glucose Monitoring**: Manually enter glucose readings with notes
- **Data Visualization**: View charts and statistics of your data
- **Date Filtering**: Filter entries by date range
- **Entry History**: View all entries in a tabular format

## Installation

1. Make sure you have Node.js installed on your system
2. Clone or download this repository
3. Navigate to the project directory
4. Install dependencies:

```bash
npm install
```

## Usage

1. Start the application:

```bash
npm start
```

2. Open your web browser and go to `http://localhost:3000`

## How to Use

1. **Adding Food Entries**:
   - Fill in the meal name and description
   - Enter nutritional values (carbs, protein, fat, calories) if known
   - Click "Add Food Entry"

2. **Adding Water Entries**:
   - Enter the amount of water consumed in milliliters
   - Click "Add Water Entry"

3. **Adding Glucose Readings**:
   - Enter your glucose level in mg/dL
   - Add any notes about how you're feeling or other observations
   - Click "Add Glucose Reading"

4. **Viewing Data**:
   - The main page shows recent entries
   - Use the date filters to see entries from specific time periods
   - Visit the "Statistics" page for charts and trends
   - Visit the "All Entries" page for a complete tabular view

## Data Storage

All data is stored locally in an SQLite database file (`glucose_tracker.db`) in the application directory.

## Manual Correlation

Since your glucose sensor is external, you can:
1. Take glucose readings at regular intervals
2. Note the time of each reading
3. Correlate these readings with your food and water entries based on the timestamps
4. Add notes to glucose entries to document how you felt or any relevant observations

## Customization

You can modify the application by editing the following files:
- `index.js` - Main application logic and database schema
- `views/index.ejs` - Main page with entry forms
- `views/stats.ejs` - Statistics and charts page
- `views/entries.ejs` - All entries table page