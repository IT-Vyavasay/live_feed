'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import CommonDialog from '@/components/commonComponents/CommonDialog'
import { Save } from '@mui/icons-material'
import { updateProviderConfiguration } from '@/utils/apiController'
import useReplaceReduxRecord from '@/hooks/useReplaceReduxRecord'
import { updateProviderDetails } from '@/redux-store/slices/circuler/common'
import { useDispatch } from 'react-redux'

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

const revenueCategories = ['postShare', 'audioCallShare', 'videoCallShare', 'liveCallShare', 'chatShare']

function extractProviderShares(shareData) {
  const providerShares = {}

  for (const key in shareData) {
    if (shareData[key]?.provider != null) {
      providerShares[key] = shareData[key].provider
    }
  }

  return providerShares
}

const EditConfigurationDistribution = ({ open, setOpen, providerDetails }) => {
  // States
  const dispatch = useDispatch()
  const replaceProviderDetails = useReplaceReduxRecord({
    despatchFun: modifiedData => dispatch(updateProviderDetails(modifiedData))
  })
  const [loader, setLoader] = useState(false)
  const [configaData, setConfigaData] = useState({})
  const [revenueSharing, setRevenueSharing] = useState(() =>
    revenueCategories.reduce((acc, category) => {
      const key = `${category}`
      const configaDataKey = configaData?.[key]
      const providerShare = configaDataKey ? parseInt(configaDataKey) : 0
      const adminShare = 100 - providerShare

      acc[category] = {
        provider: providerShare,
        admin: adminShare
      }

      return acc
    }, {})
  )

  const handleClose = () => {
    setOpen(false)
  }

  const onSaveConfig = async () => {
    console.log({ revenueSharing })

    const payloadData = extractProviderShares(revenueSharing)
    setLoader(true)
    await updateProviderConfiguration({
      providerId: parseInt(providerDetails.id),
      ...payloadData
    })

    replaceProviderDetails({
      pathArray: ['commonReducer', 'providerDetails'],
      uniqueKey: 'id',
      uniqueValue: providerDetails.id,
      newRecord: { configuration: payloadData },
      recordListKey: 'providerDetails',
      directPush: true
    })

    // setOpenDialog(false)
    setLoader(false)
  }

  useEffect(() => {
    const configaData = providerDetails?.configuration
    setConfigaData(configaData)
    setRevenueSharing(() =>
      revenueCategories.reduce((acc, category) => {
        const key = `${category}`

        const configaDataKey = configaData?.[key]
        const providerShare = configaDataKey ? parseInt(configaDataKey) : 0
        const adminShare = 100 - providerShare

        acc[category] = {
          provider: providerShare,
          admin: adminShare
        }

        return acc
      }, {})
    )
  }, [open, providerDetails])
  return (
    <CommonDialog
      open={open}
      handleClose={() => {
        setOpen(false)
      }}
      title='Change Provider Configuration'
      size='md'
      content={<ConfigurationDestribution revenueSharing={revenueSharing} setRevenueSharing={setRevenueSharing} />}
      actionFunction={onSaveConfig}
      actionName={'Save'}
      actionIcon={<Save />}
      actionLoader={loader}
      actionButtonColor={'primary'}
    />
  )
}

export default EditConfigurationDistribution
