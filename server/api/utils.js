// Parse duration as seconds (eg. '00:25:00' → 1500)
const parseDuration = (duration) => {
  const [hours, minutes, seconds] = duration
    .split(':')
    .filter((x) => x) // Filter null/undefined
    .map((x) => +x) // '00' → 0
  const parsed = (hours * 60 + minutes) * 60 + seconds
  return parsed
}

module.exports = {
  parseDuration,
}
