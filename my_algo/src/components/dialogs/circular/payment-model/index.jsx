'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Payment from '@/components/commonComponents/Payment'

// Vars
const initialData = {
  firstName: 'Oliver',
  lastName: 'Queen',
  userName: 'oliverQueen',
  billingEmail: 'oliverQueen@gmail.com',
  status: 'status',
  taxId: 'Tax-8894',
  contact: '+ 1 609 933 4422',
  language: ['english'],
  country: 'US',
  useAsBillingAddress: true
}

const PaymentModel = ({ open, setOpen, data }) => {
  // States
  const [userData, setUserData] = useState(data || initialData)

  const handleClose = () => {
    setOpen(false)
    setUserData(data || initialData)
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Payment Section</div>
      </DialogTitle>
      <DialogContent className='overflow-auto m-2'>
        <Payment />
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentModel
