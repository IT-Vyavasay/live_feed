'use client'

import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { IconButton } from '@mui/material'

const CommonButton = ({
  children,
  size = 'medium',
  variant = 'contained',
  preIcon,
  postIcon,
  color,
  loaderSize = 20,
  loading = false,
  onlyIcon = false,
  ...rest
}) => {
  const renderStartIcon = () => {
    if (loading && preIcon) return <CircularProgress size={loaderSize} color='inherit' />
    return preIcon || null
  }

  const renderEndIcon = () => {
    if (loading && !preIcon && postIcon) return <CircularProgress size={loaderSize} color='inherit' />
    return postIcon || null
  }

  return (
    <>
      {onlyIcon ? (
        <IconButton size='small' {...rest} variant={variant} color={color}>
          {loading ? <CircularProgress size={loaderSize} color='inherit' /> : <span className='flex'>{preIcon}</span>}
        </IconButton>
      ) : (
        <Button
          color={color}
          size={size}
          {...(onlyIcon ? { sx: { margin: '0', padding: '7px' } } : { variant })}
          startIcon={renderStartIcon()}
          endIcon={renderEndIcon()}
          disabled={loading || rest.disabled}
          {...rest}
          variant={variant}
        >
          {loading && !preIcon && !postIcon ? <CircularProgress size={loaderSize} color='inherit' /> : ''}
          {children ? <>&nbsp;&nbsp;{children}</> : null}
        </Button>
      )}
    </>
  )
}

export default CommonButton
