'use client'

import { useState, forwardRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { format } from 'date-fns'

const CustomInput = forwardRef(({ label, value, ...rest }, ref) => (
  <TextField fullWidth inputRef={ref} label={label} value={value} {...rest} />
))

const RangeInput = forwardRef(({ label, start, end, ...rest }, ref) => {
  const startDate = start ? format(start, 'MM/dd/yyyy') : ''
  const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''
  const value = `${startDate}${endDate}`

  return <TextField fullWidth inputRef={ref} label={label} value={value} {...rest} />
})

const CommonDatePicker = ({
  type = 'single', // 'single' or 'range'
  label = 'Select Date',
  value,
  onChange = () => {},
  disabled = false,
  readOnly = false,
  ...props
}) => {
  const [singleDate, setSingleDate] = useState(value || new Date())
  const [rangeStart, setRangeStart] = useState(value?.[0] || null)
  const [rangeEnd, setRangeEnd] = useState(value?.[1] || null)

  // Sync external value changes with internal state
  useEffect(() => {
    if (type === 'single' && value && value !== singleDate) {
      setSingleDate(value)
    }
    if (type === 'date-range' && Array.isArray(value)) {
      setRangeStart(value[0] || null)
      setRangeEnd(value[1] || null)
    }
  }, [value, type])

  const handleSingleChange = date => {
    setSingleDate(date)
    if (date instanceof Date && !isNaN(date)) {
      onChange(date.getTime()) // timestamp in ms
    } else {
      onChange(null)
    }
  }

  const handleRangeChange = dates => {
    const [start, end] = dates
    setRangeStart(start)
    setRangeEnd(end)
    const startTimestamp = start instanceof Date && !isNaN(start) ? start.getTime() : null
    const endTimestamp = end instanceof Date && !isNaN(end) ? end.getTime() : null
    onChange([startTimestamp, endTimestamp])
  }

  if (type === 'date-range') {
    return (
      <AppReactDatepicker
        selectsRange
        startDate={rangeStart}
        endDate={rangeEnd}
        onChange={handleRangeChange}
        shouldCloseOnSelect={false}
        disabled={disabled}
        customInput={<RangeInput label={label} start={rangeStart} end={rangeEnd} readOnly={readOnly} />}
        {...props}
      />
    )
  }

  return (
    <AppReactDatepicker
      weekLabel='Wk'
      showWeekNumbers
      selected={singleDate}
      onChange={handleSingleChange}
      disabled={disabled}
      customInput={<CustomInput label={label} readOnly={readOnly} />}
      {...props}
    />
  )
}

export default CommonDatePicker
