export const formatDate = (locale = navigator.language, date = new Date()) => {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long", // 'lunes'
    year: "numeric", // '2025'
    month: "long", // 'septiembre'
    day: "numeric", // '10'
    hour: "2-digit", // '06' ó '18'
    minute: "2-digit", // '05'
    second: "2-digit", // '09'
    hour12: false, // usar 24h; poner true para 12h
    timeZoneName: "short",
  }).format(date);
};
