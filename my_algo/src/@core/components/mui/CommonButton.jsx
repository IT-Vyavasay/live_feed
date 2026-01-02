'use client'

// React Imports
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

const CommonButton = ({
  children,
  loading = false,
  loadingText = 'Loading...',
  startIcon,
  endIcon,
  onlyIcon = false,
  iconSize = 'small',
  icon = null, // required for onlyIcon
  ...props
}) => {
  if (onlyIcon) {
    return (
      <IconButton size={iconSize} disabled={loading || props.disabled} {...props}>
        {loading ? <CircularProgress size={20} color='inherit' className='mie-2' /> : icon}
      </IconButton>
    )
  }

  return (
    <Button
      {...props}
      disabled={loading || props.disabled}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color='inherit' className='mie-2' />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export default CommonButton
