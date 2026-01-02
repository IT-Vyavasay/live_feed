'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import { FormControlLabel } from '@mui/material'
import ConfigurationDestribution from '@/components/commonComponents/ConfigurationDistribution'
import ChatWrapper from '@/views/circuler/providers/chat'
import PostCard from '@/components/commonComponents/PostCard'

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

const status = ['Status', 'Active', 'Inactive', 'Suspended']
const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']
const countries = ['Select Country', 'France', 'Russia', 'China', 'UK', 'US']

const ShowPostDetails = ({ open, setOpen, data }) => {
  // States
  const [userData, setUserData] = useState(data || initialData)

  const handleClose = () => {
    setOpen(false)
    setUserData(data || initialData)
  }

  const postDummyData = {}
  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='md' scroll='body' closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Post Details</div>
      </DialogTitle>
      <DialogContent className='overflow-auto h-[60vh] pbs-0 sm:pbe-6 sm:pli-16'>
        <PostCard />
      </DialogContent>

      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' color='secondary' type='reset' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShowPostDetails
