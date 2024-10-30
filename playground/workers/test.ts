import { isSameMinute } from 'date-fns'

export function hi() {
  const date = new Date()
  if (isSameMinute(date, date)) {
    return 'Hello from worker!'
  }
}
