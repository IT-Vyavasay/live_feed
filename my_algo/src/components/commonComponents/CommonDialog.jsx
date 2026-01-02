'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CommonButton from './CommonButton'

const CommonDialog = ({
  open,
  handleClose,
  title = 'Dialog Title',
  content = null,
  actionFunction = null,
  size = 'md',
  actionName,
  actionLoader,
  actionIcon,
  actionButtonVerient = 'contained',
  actionButtonColor = 'secondary'
}) => {
  useEffect(() => {}, [])

  const handleHide = () => {
    handleClose()
  }

  const handleSubmit = () => {
    if (actionFunction) actionFunction()
    handleClose()
  }

  return (
    <Dialog fullWidth open={open} onClose={handleHide} maxWidth={size}>
      <DialogTitle variant='h5' className='text-left'>
        {title}
      </DialogTitle>

      <DialogContent className='overflow-auto'>{content}</DialogContent>

      <DialogActions className='justify-center'>
        {actionFunction && (
          <CommonButton
            variant={actionButtonVerient}
            color={actionButtonColor}
            onClick={handleSubmit}
            preIcon={actionIcon}
            loading={actionLoader}
          >
            {actionName ?? 'Submit'}
          </CommonButton>
        )}
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CommonDialog
