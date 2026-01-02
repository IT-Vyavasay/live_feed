import React from 'react'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CommonButton from '@/components/commonComponents/CommonButton'

// softDeleted: { color: 'error', label: 'Soft Deleted' },
// blocked: { color: 'warning', label: 'Blocked' },
// notVerified: { color: 'secondary', label: 'Unverified' },
// verified: { color: 'success', label: 'Verified' },
// notAprooved: { color: 'info', label: 'Not Aprooved' },
// unknown: { color: 'default', label: 'Unknown' }

const StatusToggleButton = ({ currentStatus = 'blocked', onClick, id, actionLoader }) => {
  let buttonProps = {
    label: 'verify',
    color: 'success',
    icon: <CheckCircleIcon />
  }
  switch (currentStatus) {
    case 'verified':
      buttonProps = {
        label: 'Block',
        color: 'error',
        icon: <CancelIcon />,
        field: 'isBlocked',
        value: 1,

        successMessage: `Provider has been blocked successfully.`,
        errorMessage: `Failed to block provider. Please try again.`
      }
      break

    case 'notAprooved':
      buttonProps = {
        label: 'Aproove',
        color: 'warning',
        icon: <HourglassEmptyIcon />,
        field: 'isApproved',
        value: 1,

        successMessage: `Provider has been Aprroved successfully.`,
        errorMessage: `Failed to Aprrov provider. Please try again.`
      }
      break
    case 'blocked':
      buttonProps = {
        label: 'Activate',
        color: 'success',
        icon: <CheckCircleIcon />,
        field: 'isBlocked',
        value: 2,

        successMessage: `Provider has been active successfully.`,
        errorMessage: `Failed to active provider. Please try again.`
      }
      break
    case 'softDeleted':
      buttonProps = {
        label: 'Activate',
        color: 'success',
        icon: <CheckCircleIcon />,
        field: 'isSoftDeleted',
        value: 2,

        successMessage: `Provider has been active successfully.`,
        errorMessage: `Failed to active provider. Please try again.`
      }
  }

  const isLoading = actionLoader[`prvider-${id}-${buttonProps.field}`]
  return (
    <CommonButton
      variant='contained'
      size='small'
      loading={isLoading}
      sx={{ padding: '0px 8px', borderRadius: '3px', textTransform: 'capitalize' }}
      color={buttonProps.color}
      preIcon={buttonProps.icon}
      loaderSize={10}
      onClick={() =>
        onClick({
          field: buttonProps.field,
          value: buttonProps.value,
          id,
          successMessage: buttonProps.successMessage,
          errorMessage: buttonProps.errorMessage
        })
      }
    >
      {buttonProps.label}
    </CommonButton>
  )
}

export default StatusToggleButton
