export const parseCustomDate = (dateString: string) => {
  // str esperado: "dd-mm-yyyy HH:MM:SS.mmm"
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hms, ms] = timePart.split(".");
  const [hour, minute, second] = hms.split(":").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    ms ? Number(ms) : 0
  );
};
