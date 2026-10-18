export function getConcertErrorMessage(error) {
  return error?.response?.data?.message
    || error?.message
    || 'Concerts could not be loaded. Please try again.';
}
