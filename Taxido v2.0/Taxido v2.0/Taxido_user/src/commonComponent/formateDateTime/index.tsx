export const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);

    const optionsDate: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    const formattedDate = date.toLocaleDateString('en-US', optionsDate).replace(',', '’');
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    return {
        date: formattedDate,
        time: formattedTime,
    };
};
