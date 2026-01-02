'use client'
// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'
import SliderCustomized from '@/components/form-component/Slider'
import { Button } from '@mui/material'
import { useState } from 'react'

// Vars
const connectedAccountsArr = [
  {
    checked: false,
    title: 'Post',
    id: 'postShare',
    logo: 'ri-file-paper-2-line',
    subtitle: 'Communications'
  },
  {
    checked: true,
    title: 'Voice Call',
    id: 'audioCallShare',
    logo: 'ri-phone-line',
    subtitle: 'Manage your Git repositories'
  },
  {
    checked: true,
    title: 'Video Call',
    id: 'videoCallShare',
    logo: 'ri-video-on-line',
    subtitle: 'Calendar and Contacts'
  },
  {
    checked: true,
    title: 'Live Call',
    id: 'liveCallShare',
    subtitle: 'Email marketing service',
    logo: 'ri-rfid-line'
  },

  {
    title: 'Chat',
    id: 'chatShare',
    checked: true,
    subtitle: 'Task Communication',
    logo: 'ri-message-3-line '
  }
]

const ConfigurationDistribution = ({ revenueSharing, setRevenueSharing }) => {
  const handleShareChange = (category, value, type) => {
    const parsedValue = Number(value)
    const otherValue = 100 - parsedValue

    setRevenueSharing(prev => ({
      ...prev,
      [category]: {
        admin: type === 'admin' ? parsedValue : otherValue,
        provider: type === 'provider' ? parsedValue : otherValue
      }
    }))
  }

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6 }}>
        <CardHeader title='Admin Share' subheader="Allocate the admin's portion of the revenue." />
        <CardContent className='flex flex-col gap-4'>
          {connectedAccountsArr.map((item, index) => (
            <div key={index} className='flex items-center justify-between gap-4'>
              <div className='flex flex-grow items-center gap-4'>
                <div className='p-2 pb-0 rounded-lg bg-blue-100 text-blue-800 backdrop-blur-sm  '>
                  <i className={item.logo}></i>
                </div>

                <div className='flex-grow'>
                  <Typography className='font-medium' color='text.primary'>
                    {item.title}
                  </Typography>
                </div>
              </div>
              <SliderCustomized
                value={revenueSharing?.[item?.id]?.['admin']}
                onChange={e => handleShareChange(item?.id, e.target.value, 'admin')}
              />
            </div>
          ))}
        </CardContent>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CardHeader title='Provider Share' subheader="Allocate the provider's portion of the revenue." />
        <CardContent className='flex flex-col gap-4'>
          {connectedAccountsArr.map((item, index) => (
            <div key={index} className='flex items-center justify-between gap-4'>
              <div className='flex flex-grow items-center gap-4'>
                <div className='p-2 pb-0 rounded-lg bg-blue-100 text-blue-800 backdrop-blur-sm  '>
                  <i className={item.logo}></i>
                </div>

                <div className='flex-grow'>
                  <Typography className='font-medium' color='text.primary'>
                    {item.title}
                  </Typography>
                </div>
              </div>
              <SliderCustomized
                value={revenueSharing?.[item?.id]?.['provider']}
                onChange={e => handleShareChange(item?.id, e.target.value, 'provider')}
              />
            </div>
          ))}
        </CardContent>
      </Grid>
    </Grid>
  )
}

export default ConfigurationDistribution
