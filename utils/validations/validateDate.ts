/**
 * Validates if a given string represents a valid date in the format DD-MM-YYYY.
 *
 * @param stringDate - The string to be validated.
 * @returns A boolean indicating whether the string is a valid date.
 *
 * @example
 *
 * const validDate = isValidDate('31-12-2022'); // true
 * const invalidDate = isValidDate('13-31-2022'); // false
 * const invalidDate = isValidDate('2022-13-31'); // false
 */

export function isValidDate(stringDate: string): boolean {
  const regex = /^(3[01]|[12][0-9]|0[1-9])(\/|-)(1[0-2]|0[1-9])\2([0-9]{4})$/;
  return regex.test(stringDate);
}
