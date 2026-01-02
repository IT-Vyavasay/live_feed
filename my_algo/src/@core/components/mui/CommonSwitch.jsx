import React from 'react'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const CommonSwitch = ({ label, labelPlacement = 'end', size = 'medium', sx = {}, loading = false, ...props }) => {
  const isLarge = size === 'large'

  return (
    <FormControlLabel
      label={label}
      labelPlacement={labelPlacement}
      control={
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Switch
            {...props}
            disabled={loading || props.disabled}
            size={isLarge ? 'medium' : size}
            sx={{
              ...(isLarge && {
                transform: 'scale(1.5)',
                '& .MuiSwitch-thumb': {
                  width: 18,
                  height: 15
                },
                '& .MuiSwitch-switchBase': {
                  padding: 10
                },
                '& .MuiSwitch-track': {
                  borderRadius: 15,
                  height: 15
                }
              }),
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? 'none' : 'auto',
              ...sx
            }}
          />
          {loading && <CircularProgress size={15} sx={{ position: 'absolute', top: '0.75rem', left: '10px' }} />}
        </Box>
      }
    />
  )
}

export default CommonSwitch
