export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function getMonthRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    start_date: formatDate(startOfMonth),
    end_date: formatDate(endOfMonth)
  };
}
