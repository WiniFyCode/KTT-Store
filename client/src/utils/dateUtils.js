// Hàm format ngày theo định dạng dd/mm/yyyy
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Hàm format ngày giờ đầy đủ
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const dateStr = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return `${time} ${dateStr}`;
};
