// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

// Data Imports
import { events } from '@/fake-db/apps/calendar'

const initialState = {
  usersList: []
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState: initialState,
  reducers: {
    filterEvents: state => {
      state.filteredEvents = state.events
    },
    addEvent: (state, action) => {
      const newEvent = [...action.payload]

      state.usersList.push(newEvent)
    }
  }
})
export const {
  filterEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  selectedEvent,
  filterCalendarLabel,
  filterAllCalendarLabels
} = calendarSlice.actions
export default calendarSlice.reducer
