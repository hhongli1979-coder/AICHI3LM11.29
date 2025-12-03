export const formatDates = (dateString: any) => {
  const milliseconds =
    dateString._seconds * 1000 + dateString._nanoseconds / 1_000_000
  const date = new Date(milliseconds)

  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = String(date.getFullYear())
  const hours = String(date.getHours() % 12 || 12).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
  return {
    date: `${day} ${month}’${year}`,
    time: `${hours}:${minutes} ${ampm}`,
  }
}

export const apiformatDates = (dateString: string) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = String(date.getFullYear())
  const hours = String(date.getHours() % 12 || 12).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
  return {
    // date: `${day} ${month}’${year}`,
    date: `${day} ${month}`,
    time: `${hours}:${minutes} ${ampm}`,
  }
}

