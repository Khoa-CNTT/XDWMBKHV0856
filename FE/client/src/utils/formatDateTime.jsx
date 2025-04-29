// Format date strings from API like "2025-04-27 23:57:14 PM" to user-friendly format
export const formatDate = (datetimeStr) => {
  if (!datetimeStr) return "Unknown date";

  try {
    // Tách phần ngày và giờ
    const [datePart, timePart, meridiem] = datetimeStr.split(" "); // "2025-04-23", "13:25:53", "PM"
    const [year, month, day] = datePart.split("-");

    // Format lại với leading zero
    const pad = (n) => n.toString().padStart(2, "0");

    // Return formatted date (day/month/year)
    return `${pad(parseInt(day))}/${pad(parseInt(month))}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format complete datetime strings from API
export const formatDateTime = (datetimeStr) => {
  if (!datetimeStr) return "Unknown date";

  try {
    // Tách phần ngày và giờ
    const [datePart, timePart, meridiem] = datetimeStr.split(" "); // "2025-04-23", "13:25:53", "PM"
    const [year, month, day] = datePart.split("-");
    let [hour, minute, second] = timePart.split(":").map(Number);

    // Xử lý AM/PM thành giờ 24h
    if (meridiem === "PM" && hour < 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    // Format lại với leading zero
    const pad = (n) => n.toString().padStart(2, "0");

    return `${pad(parseInt(day))}/${pad(parseInt(month))}/${year} ${pad(
      hour
    )}:${pad(minute)}:${pad(second)}`;
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "Invalid date";
  }
};
