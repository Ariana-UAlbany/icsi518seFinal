import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
//import { format } from "date-fns"

export default function JournalCalendar({ entries, selectedDate, onSelect }) {
  // Convert journal dates into calendar modifiers
  const entryDates = entries.map(e => new Date(e.createdAt))

  return (
    <div className="journal-calendar">
      <h3 className="calendar-title">Journal Calendar</h3>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        modifiers={{ hasEntry: entryDates }}
        modifiersClassNames={{
          hasEntry: "day-has-entry"
        }}
      />
    </div>
  )
}