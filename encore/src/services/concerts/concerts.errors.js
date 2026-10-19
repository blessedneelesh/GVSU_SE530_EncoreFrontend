export function getConcertErrorMessage(error) {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      const location = Array.isArray(item.loc) ? item.loc.join('.') : 'request';
      return `${location}: ${item.msg || 'Invalid value'}`;
    }).join(' ');
  }
  return error?.response?.data?.message
    || detail
    || error?.message
    || 'Concerts could not be loaded. Please try again.';
}
