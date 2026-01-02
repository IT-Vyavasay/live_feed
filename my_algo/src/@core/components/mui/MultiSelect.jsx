// React Imports
import { useMemo } from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

const MultiSelect = ({
  label = 'Select Options',
  options = [],
  value = [],
  onChange = () => {},
  menuMaxHeight = 220
}) => {
  const MenuProps = useMemo(
    () => ({
      PaperProps: {
        style: {
          inlineSize: 250,
          maxBlockSize: menuMaxHeight
        }
      }
    }),
    [menuMaxHeight]
  )

  return (
    <Select
      multiple
      value={value}
      label={label}
      onChange={e => onChange(e.target.value)}
      MenuProps={MenuProps}
      id={`${label}-checkbox`}
      labelId={`${label}-checkbox-label`}
      renderValue={selected => (
        <div className='flex flex-wrap gap-1'>
          {selected.map(val => (
            <Chip key={val} label={val} size='small' />
          ))}
        </div>
      )}
    >
      {options.map(opt => (
        <MenuItem key={opt} value={opt}>
          <Checkbox checked={value.indexOf(opt) > -1} />
          <ListItemText primary={opt} />
        </MenuItem>
      ))}
    </Select>
  )
}

export default MultiSelect
