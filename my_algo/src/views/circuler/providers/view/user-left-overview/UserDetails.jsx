'use client'
// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import EditConfigurationDistribution from '@/components/dialogs/circular/edit-configuration-distribution'
import { useDispatch, useSelector } from 'react-redux'
import { addProviderDetails, addProviders, setLoader } from '@/redux-store/slices/circuler/common'
import { getProviders, getSingleProvider } from '@/utils/apiController'
import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getPrioritizedStatus, refineLanguageString, userStatusObj } from '@/utils/common'
import CommonDialog from '@/components/commonComponents/CommonDialog'

// Vars
const userData = {
  firstName: 'Seth',
  lastName: 'Hallam',
  userName: '@shallamb',
  billingEmail: 'shallamb@gmail.com',
  status: 'active',
  role: 'Provider',
  taxId: 'Tax-8894',
  contact: '+1 (234) 464-0600',
  language: ['Gujarati, ', 'Hindi, ', 'English'],
  country: 'India',
  useAsBillingAddress: true
}

const UserDetails = () => {
  // Vars
  const params = useParams()
  const providerDetails = useSelector(state => state.commonReducer.providerDetails)[0]
  const {
    id = 0,
    name = '',
    email = null,
    mobile = null,
    role = 0,
    createdOn = 0,
    updatedOn = 0,
    countryCode = '',
    profileImg = '',
    referralCode = '',
    fcmToken = '',
    category = [],
    isLive = 0,
    isSoftDeleted = 0,
    isBlocked = 0,
    userName = '',
    businessDetail = '',
    description = '',
    language = null,
    servicePrice = {},
    referralPoint = 0,
    totalPurchase = 0,
    totalMinute = 0,
    totalPost = 0,
    totalFollower = 0,
    isVerify = 0,
    isApproved = 0,
    totalVideoCallMinute = 0,
    isChat = 0,
    isCall = 0,
    isFollowed = 0
  } = providerDetails ?? {}
  const providerDetailsActionLoader = useSelector(state => state.commonReducer.loader.providerDetails)
  const dispatch = useDispatch()
  const totalRevenueData = useSelector(state => state?.commonReducer?.providerRevenueData?.tillTotalRevenue) ?? 0

  const getData = async () => {
    dispatch(setLoader({ providerDetails: true }))
    const response = await getSingleProvider({
      providerId: params?.providerId
    })

    dispatch(addProviderDetails([response?.data?.data] ?? [{}]))
    dispatch(setLoader({ providerDetails: false }))
  }

  useEffect(() => {
    if (params?.providerId) {
      getData()
    }
  }, [])

  const buttonProps = (children, color, variant) => ({
    children,
    color,
    variant
  })

  function StatCard({ iconClass, value, label, color = 'primary', skin = 'light' }) {
    return (
      <div className='flex items-center gap-4 p-4 rounded-lg border bg-white shadow-sm'>
        <CustomAvatar variant='rounded' color={color} skin={skin}>
          <i className={iconClass} />
        </CustomAvatar>
        <div>
          <Typography variant='h5'>{value}</Typography>
          <Typography>{label}</Typography>
        </div>
      </div>
    )
  }

  const statsData = useMemo(
    () => [
      {
        iconClass: 'ri-video-on-line',
        value: `${totalVideoCallMinute}m`,
        label: 'Video Call',
        color: 'warning',
        skin: 'light'
      },
      { iconClass: 'ri-phone-line', value: `${totalMinute}m`, label: 'Audio Call', color: 'success', skin: 'light' },
      { iconClass: 'ri-file-paper-2-line', value: totalPost, label: 'Post Buyer', color: 'info', skin: 'light' },
      {
        iconClass: 'ri-briefcase-line',
        value: `${totalRevenueData} ₹`,
        label: 'Total Revenue',
        color: 'primary',
        skin: 'light'
      }
    ],
    [totalRevenueData]
  )

  const statusKey = getPrioritizedStatus({
    isVerify,
    isSoftDeleted,
    isBlocked,
    isApproved
  })

  const status = userStatusObj[statusKey]
  return (
    <>
      <Card onClick={() => console.log(providerDetails)}>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col items-center justify-center gap-4'>
              <CustomAvatar
                alt='user-profile'
                src={profileImg ?? '/images/avatars/1.png'}
                variant='rounded'
                className='rounded-lg'
                size={120}
              />
              <Typography variant='h5'>{name ?? '-'}</Typography>
              <Chip label={`${totalFollower} Followers`} variant='tonal' color='error' size='small' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_3fr] gap-6'>
              {statsData.map((item, index) => (
                <StatCard
                  key={index}
                  iconClass={item.iconClass}
                  value={item.value}
                  label={item.label}
                  color={item.color}
                  skin={item.skin}
                />
              ))}
            </div>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography color='text.primary' className='font-medium'>
                  Username:
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>{userName}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography color='text.primary' className='font-medium'>
                  Email:
                </Typography>
                <Typography>{email}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography color='text.primary' className='font-medium'>
                  Contact:
                </Typography>
                <Typography>{`${countryCode ?? ''}${mobile ?? ''}`}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography color='text.primary' className='font-medium'>
                  Status:
                </Typography>
                <Chip variant='tonal' label={status.label} size='small' color={status.color} className='capitalize' />
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography color='text.primary' className='font-medium'>
                  Language:
                </Typography>
                <Typography>{refineLanguageString(language)}</Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-4 flex-wrap justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Change Configuration', 'primary', 'contained')}
              dialog={EditConfigurationDistribution}
              dialogProps={{ providerDetails }}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
