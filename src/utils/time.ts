export const formatTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (e) {
    console.error('Date formatting error:', e);
    return '';
  }
};

export const formatDuration = (eta: string): string => {
  if (!eta) return '';
  return eta.replace(/ /g, '');
};
