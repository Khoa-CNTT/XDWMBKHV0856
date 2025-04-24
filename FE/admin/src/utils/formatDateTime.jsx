export const formatDateTime = (datetimeStr) => {
    // Tách phần ngày và giờ
    const [datePart, timePart, meridiem] = datetimeStr.split(' '); // "2025-04-23", "13:25:53", "PM"
    const [year, month, day] = datePart.split('-');
    let [hour, minute, second] = timePart.split(':').map(Number);
  
    // Xử lý AM/PM thành giờ 24h
    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
  
    // Format lại với leading zero
    const pad = (n) => n.toString().padStart(2, '0');
  
    return `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
  };
  