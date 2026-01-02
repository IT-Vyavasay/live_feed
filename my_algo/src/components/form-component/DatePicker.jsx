import { forwardRef } from 'react'

// MUI Imports
import TextField from '@mui/material/TextField'

// Third-party Imports
import { format } from 'date-fns'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const PickersRange = ({
  isMonthlyRange = true,
  label,
  startDateRange, // in milliseconds
  endDateRange, // in milliseconds
  onChange = () => {}
}) => {
  // Convert incoming milliseconds to Date objects for the picker
  const startDateObj = startDateRange ? new Date(startDateRange) : null
  const endDateObj = endDateRange ? new Date(endDateRange) : null

  // Handle picker change
  const handleOnChangeRange = dates => {
    const [start, end] = dates

    // Convert Date objects to milliseconds before passing to parent
    const startMs = start ? start.getTime() : null
    const endMs = end ? end.getTime() : null

    onChange([startMs, endMs])
  }

  const CustomInput = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = start ? format(start, 'MM/dd/yyyy') : ''
    const endDateStr = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={`${startDate}${endDateStr}`} />
  })

  return (
    <AppReactDatepicker
      selectsRange
      monthsShown={2}
      startDate={startDateObj}
      endDate={endDateObj}
      selected={startDateObj}
      shouldCloseOnSelect={false}
      id='date-range-picker-months'
      onChange={handleOnChangeRange}
      customInput={<CustomInput label={label || 'Multiple Months'} end={endDateObj} start={startDateObj} />}
    />
  )
}

export default PickersRange
