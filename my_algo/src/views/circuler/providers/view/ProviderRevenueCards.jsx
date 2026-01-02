// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
import CardStatVertical from '@components/card-statistics/Vertical'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { getProviderRevenueSummary } from '@/utils/apiController'
import { addProviderRevenueData } from '@/redux-store/slices/circuler/common'

const ProviderRevenueCards = () => {
  const filtereParams = useSelector(state => state.commonReducer.providerRevenueHistoryFilter)
  const [providerDetails] = useSelector(state => state?.commonReducer?.providerDetails) ?? [{}]
  const revenueData = useSelector(state => state?.commonReducer?.providerRevenueData) ?? [{}]
  const dispatch = useDispatch()
  const setRevenueData = data => dispatch(addProviderRevenueData(data))
  const [loader, setLoader] = useState(false)
  const providerId = providerDetails?.id
  const { startDate, endDate } = filtereParams
  const getData = async () => {
    if (providerId) {
      setLoader(true)
      const response = await getProviderRevenueSummary({
        providerId,
        ...(Number(startDate) !== 0 && Number(endDate) !== 0 ? { startDate, endDate } : {})
      })

      if (response?.data?.isSuccess) {
        setRevenueData(response?.data?.data)
      }

      setLoader(false)
    }
  }

  useEffect(() => {
    if (providerId) getData()
  }, [filtereParams, providerId])

  const data = useMemo(() => {
    const baseData = [
      {
        stats: '$89.34k',
        title: 'Video Call',
        trend: 'negative',
        trendNumber: 18,
        chipText: 'Last One Year',
        avatarColor: 'warning',
        avatarIcon: 'ri-video-on-line'
      },
      {
        stats: '142.8k',
        title: 'Post',
        trendNumber: 62,
        chipText: 'Last One Year',
        avatarColor: 'info',
        avatarIcon: 'ri-file-paper-2-line'
      },
      {
        stats: '$13.4k',
        title: 'Phone',
        trendNumber: 38,
        chipText: 'Last Six Months',
        avatarColor: 'success',
        avatarIcon: 'ri-phone-line'
      },
      {
        stats: '$8.16k',
        title: 'Live Call',
        trend: 'negative',
        trendNumber: 16,
        chipText: 'Last One Month',
        avatarColor: 'error',
        avatarIcon: 'ri-rfid-line'
      },

      {
        stats: '$2.55k',
        title: 'Chat',
        trendNumber: 38,
        chipText: 'Last One Year',
        avatarColor: 'secondary',
        avatarIcon: 'ri-message-3-line '
      }
    ]

    // Mapping titles to revenue object2
    const mapping = {
      'Video Call': revenueData.videoCallRevenue,
      Post: revenueData.postTotalRevenue,
      Phone: revenueData.voiceCallRevenue,
      'Live Call': revenueData.liveRevenue,
      Chat: revenueData.chatRevenue
    }
    return baseData.map(item => {
      const value = mapping?.[item?.title]
      return {
        ...item,
        stats: typeof value === 'number' ? `$${(value / 1000).toFixed(2)}k` : item.stats,
        ...(value ?? {})
      }
    })
  }, [revenueData])

  if (data) {
    return (
      <Grid container spacing={5}>
        {data.map((item, index) => (
          <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={index}>
            <CardStatVertical {...item} avatarSkin='light' chipColor='secondary' loader={loader} />
          </Grid>
        ))}
      </Grid>
    )
  }
}

export default ProviderRevenueCards
