'use client'
// MUI Imports
import Grid from '@mui/material/Grid'

// Components Imports
import CongratulationsJohn from '@views/circuler/dashboard/CongratulationsJohn'
import CardStatVertical from '@components/card-statistics/Vertical'
import LineChart from '@views/circuler/dashboard/LineChart'

// Server Action Imports
import RevenueDistribution from '@/views/circuler/dashboard/RevenueDistribution'
import RevenueAnalysis from '@/views/circuler/dashboard/RevenueAnalysis'
import RevenueComparison from '@/views/circuler/dashboard/RevenueComparison'
import { getRevenueSummaryWithInterval } from '@/utils/apiController'
import { addRevenueSummaryWithInterval, setLoader } from '@/redux-store/slices/circuler/common'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import useHooks from '@/hooks/useHooks'
import { sumArray } from '@/utils/common'

const DashboardAnalytics = ({ serverMode }) => {
  const dispatch = useDispatch()
  const revenueSummaryWithInterval = useSelector(state => state.commonReducer.revenueSummaryWithInterval)
  const revenueSummaryWithIntervalActionLoader = useSelector(
    state => state.commonReducer.loader.revenueSummaryWithInterval
  )
  const revenueSummaryWithIntervalFilter = useSelector(state => state.commonReducer.revenueSummaryWithIntervalFilter)
  const getData = async () => {
    dispatch(setLoader({ revenueSummaryWithInterval: true }))
    const response = await getRevenueSummaryWithInterval({
      ...revenueSummaryWithIntervalFilter
    })

    dispatch(addRevenueSummaryWithInterval(response?.data?.data ?? {}))
    dispatch(setLoader({ revenueSummaryWithInterval: false }))
  }

  const graphData = useHooks({
    hookType: 'memo',
    input: prepareRevenueSeries(revenueSummaryWithInterval?.data ?? []),
    dependencies: [revenueSummaryWithInterval]
  })
  const revenueSum = useHooks({
    hookType: 'memo',
    input: {
      admin: sumArray(graphData?.adminShare),
      provider: sumArray(graphData?.providerShare),
      total: sumArray(graphData?.totalShare)
    },
    dependencies: [revenueSummaryWithInterval]
  })
  useEffect(() => {
    getData()
  }, [revenueSummaryWithIntervalFilter])

  const revenueData = useHooks({
    hookType: 'memo',
    input: sumRevenue(revenueSummaryWithInterval?.data ?? []),
    dependencies: [revenueSummaryWithInterval]
  })

  useEffect(() => {
    console.log('revenueSummaryWithInterval', revenueSummaryWithInterval)
  }, [revenueSummaryWithInterval])
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        <CongratulationsJohn serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <CardStatVertical
          stats='155k'
          avatarColor='primary'
          trendNumber='22%'
          title='*Total Orders'
          chipText='Last 4 Month'
          avatarIcon='ri-shopping-cart-line'
          avatarSkin='light'
          chipColor='secondary'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <LineChart />
      </Grid>
      <Grid item xs={12} md={12} sm={12}>
        <RevenueDistribution graphData={graphData} />
      </Grid>
      <Grid item xs={12} md={8} sm={12}>
        <RevenueAnalysis revenueData={revenueData} revenueSum={revenueSum} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <RevenueComparison totalRevenue={revenueData?.totalRevenue ?? {}} />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={4}>
        <ProjectStatistics serverMode={serverMode} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <BarChart />
          </Grid>
          <Grid item xs={6}>
            <CardStatVertical
              stats='$13.4k'
              avatarColor='success'
              trendNumber='38%'
              title='Total Sales'
              chipText='Last Six Month'
              avatarIcon='ri-handbag-line'
              avatarSkin='light'
              chipColor='secondary'
            />
          </Grid>
          <Grid item xs={6}>
            <CardStatVertical
              stats='142.8k'
              avatarColor='info'
              trendNumber='62%'
              title='Total Impression'
              chipText='Last One Month'
              avatarIcon='ri-link'
              avatarSkin='light'
              chipColor='secondary'
            />
          </Grid>
          <Grid item xs={6}>
            <RadialBarChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <SalesCountry />
      </Grid>
      <Grid item xs={12} md={8}>
        <TopReferralSources />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <WeeklySales />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <VisitsByDay />
      </Grid>
      <Grid item xs={12} md={8}>
        <ActivityTimeline />
      </Grid> */}
    </Grid>
  )
}

export default DashboardAnalytics

function prepareRevenueSeries(data) {
  return {
    adminShare: data.map(item => item.revenue.adminRevenue.total || 0),
    providerShare: data.map(item => item.revenue.providerRevenue.total || 0),
    totalShare: data.map(item => item.revenue.totalRevenue.total || 0),
    interval: data.map(item => item.timestamp)
  }
}

function sumRevenue(data) {
  const keys = ['videoCall', 'audioCall', 'total', 'liveCall', 'post', 'chat']
  const result = {
    totalRevenue: {},
    adminRevenue: {},
    providerRevenue: {}
  }

  // Initialize all keys except total with 0
  ;['totalRevenue', 'adminRevenue', 'providerRevenue'].forEach(type => {
    keys.forEach(key => {
      result[type][key] = 0
    })
  })

  data.forEach(item => {
    for (let revenueType in item.revenue) {
      // Sum all keys except total first
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        result[revenueType][key] += item.revenue[revenueType][key] || 0
      }
    }
  })

  // Calculate total as sum of first five keys
  ;['totalRevenue', 'adminRevenue', 'providerRevenue'].forEach(type => {
    result[type]['total'] = keys.slice(0, -1).reduce((sum, key) => sum + (result[type][key] || 0), 0)
  })

  return result
}
