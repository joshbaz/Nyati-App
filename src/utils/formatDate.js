/**
 * @name formatAddedDate
 * @description Formats the date to show when the film was added as 2 days ago or 1 month ago etc.
 * @param {Date} date - The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatAddedDate = (date) => {
  const dateObject = new Date(date) // Today's date
  const currentDate = new Date()

  const oneDay = 1000 * 60 * 60 * 24
  const oneMonth = oneDay * 30
  const oneYear = oneDay * 365

  const oneHour = 1000 * 60 * 60 // 60 minutes
  const oneMinute = 1000 * 60 // 60 seconds

  const diff = currentDate - dateObject

  if (diff < oneDay) {
    // calculate the hours, minutes, and seconds
    console.log(diff)
    if (diff < oneMinute) {
      // if uploaded less than a minute ago
      return "just now"
    }
    if (diff < oneHour) {
      // less than an hour
      const diffInMinutes = Math.floor(diff / oneMinute)
      return `${diffInMinutes} ${diffInMinutes > 1 ? "minutes" : "minute"} ago`
    }
    return `${Math.floor(diff / oneHour)} hours ago`
  } else if (diff < oneMonth) {
    const diffInDays = Math.floor(diff / oneDay)
    return `${diffInDays} ${diffInDays > 1 ? "days" : "day"} ago`
  } else if (diff < oneYear) {
    const diffInMonths = Math.floor(diff / oneMonth)
    return `${diffInMonths} ${diffInMonths > 1 ? "months" : "month"} ago`
  } else {
    const diffInYears = Math.floor(diff / oneYear)
    return `${diffInYears} ${diffInYears > 1 ? "years" : "year"} ago`
  }
}
