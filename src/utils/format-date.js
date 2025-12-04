export function formatDate(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date)) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

const dateStr = '2025-06-13T17:26:52.779Z';
const date = new Date(dateStr);

// Method 1: Using toLocaleDateString with options
// const formatted1 = date.toLocaleDateString('en-GB', {
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric'
// });
// console.log(formatted1); // "13 June 2025"

// Method 2: Manual formatting with ordinal suffix

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function formatISODateWithOrdinal(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return '';

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
