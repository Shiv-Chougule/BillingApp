/**
 * Date Utility Functions
 *
 * Central place for all date formatting used across the UI.
 * All dates from the backend are displayed in dd/mm/yyyy format.
 */

/**
 * Formats any backend date value to "dd/mm/yyyy" for UI display.
 *
 * @param {string | Date | number | null | undefined} dateValue - The date from the backend (ISO string, Date object, or timestamp).
 * @param {string} [fallback='N/A'] - Value to return when dateValue is falsy or invalid.
 * @returns {string} Formatted date string in "dd/mm/yyyy" format, or the fallback value.
 *
 * @example
 * formatDate('2024-03-15T10:00:00.000Z') // → '15/03/2024'
 * formatDate(new Date())                  // → '20/02/2026'
 * formatDate(null)                        // → 'N/A'
 * formatDate(undefined, '—')             // → '—'
 */
export function formatDate(dateValue, fallback = 'N/A') {
    if (!dateValue) return fallback;

    const date = new Date(dateValue);

    // Guard against invalid dates (e.g. new Date('garbage') → NaN)
    if (isNaN(date.getTime())) return fallback;

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
}

/**
 * Returns today's date as a string in "yyyy-MM-dd" format —
 * suitable for use as the `value` of an <input type="date">.
 *
 * @returns {string} e.g. "2026-02-20"
 */
export function todayInputValue() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Converts a yyyy-MM-dd input string (from <input type="date">)
 * to a full ISO string for sending to the backend.
 *
 * @param {string} inputDateStr - e.g. "2026-02-20"
 * @returns {string} ISO string e.g. "2026-02-20T00:00:00.000Z"
 */
export function inputDateToISO(inputDateStr) {
    return new Date(inputDateStr).toISOString();
}
