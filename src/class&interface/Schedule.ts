function getWeekIndexInYear(date: Date): number {
    // Copy the date to avoid modifying the original
    const newDate = new Date(date);
    // Set the first day of the year
    newDate.setMonth(0, 1);
    // Get the day of the week for the first day of the year (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayOfWeek = newDate.getDay();

    // Calculate the number of days passed since the first day of the year
    const diff = Math.floor((date.getTime() - newDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate the week index
    const weekIndex = Math.floor((diff + firstDayOfWeek) / 7) + 1;

    return weekIndex;
}

// Example usage:
const date = new Date('2023-1-8'); // Input date
const weekIndex = getWeekIndexInYear(date);
console.log(`Week index of ${date.toDateString()} in the year: ${weekIndex}`);