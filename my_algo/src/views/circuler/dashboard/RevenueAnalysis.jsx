'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import useHooks from '@/hooks/useHooks'
import { getPercentage, getValuesInSequence } from '@/utils/common'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const RevenueAnalysis = ({ revenueSum, revenueData }) => {
  const { totalRevenue, providerRevenue, adminRevenue } = revenueData ?? {
    totalRevenue: {},
    providerRevenue: {},
    adminRevenue: {}
  }

  const { admin, provider, total } = revenueSum ?? {}
  const sequence = ['videoCall', 'audioCall', 'total', 'liveCall', 'post', 'chat']

  const series = useHooks({
    hookType: 'memo',
    input: [
      {
        name: 'Admin',
        data: getValuesInSequence({ obj: adminRevenue, sequence }).map(i => i * -1)
      },
      {
        name: 'Provider',
        data: getValuesInSequence({ obj: providerRevenue, sequence })
      }
    ],
    dependencies: [revenueData]
  })

  const options = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      y: { formatter: val => `${Math.abs(val)}` }
    },
    legend: { show: true },
    dataLabels: { enabled: true },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-success-main)'],
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: true }
      },
      padding: {
        top: -10,
        bottom: -25
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        barHeight: '50%',
        horizontal: true,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all'
      }
    },
    xaxis: {
      position: 'top',
      axisTicks: { show: true },
      axisBorder: { show: true },
      categories: sequence,
      labels: {
        formatter: val => `${Math.abs(Number(val))}`,
        style: { colors: 'var(--mui-palette-text-disabled)', fontSize: '13px' }
      }
    },
    yaxis: {
      labels: { show: true }
    }
  }

  return (
    <Card className='md:bs-full'>
      <Grid container className='md:bs-full'>
        <Grid item xs={12} sm={7} className='max-sm:border-be sm:border-ie flex flex-col'>
          <CardHeader title='Revenue Analysis' />
          <CardContent className='flex flex-grow flex-col justify-center pbs-5'>
            <AppReactApexCharts type='bar' height={232} width='100%' series={series} options={options} />
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={5} className='flex flex-col'>
          <CardHeader
            title='Report'
            subheader='Last month transactions* $234.40k'
            action={<OptionMenu options={['Refresh', 'Update', 'Share']} />}
          />
          <CardContent className='flex flex-grow flex-col justify-center'>
            <div className='flex flex-col gap-5'>
              <div className='flex justify-evenly'>
                <div className='flex flex-col gap-3 items-center'>
                  <CustomAvatar skin='light' color='success' variant='rounded'>
                    <i className='ri-pie-chart-2-line' />
                  </CustomAvatar>
                  <div className='flex flex-col items-center gap-0.5'>
                    <Typography>Admin</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      {`${getPercentage({ part: admin, baseValue: total })} %`}
                    </Typography>
                  </div>
                </div>
                <Divider orientation='vertical' flexItem />
                <div className='flex flex-col gap-3 items-center'>
                  <CustomAvatar skin='light' color='primary' variant='rounded'>
                    <i className='ri-money-dollar-circle-line' />
                  </CustomAvatar>
                  <div className='flex flex-col items-center gap-0.5'>
                    <Typography>Provider</Typography>
                    <Typography color='text.primary' className='font-medium'>
                      {`${getPercentage({ part: provider, baseValue: total })} %`}
                    </Typography>
                  </div>
                </div>
              </div>
              <Divider />
              <div className='flex flex-wrap gap-3 items-center justify-around '>
                <div className='flex flex-col items-center gap-0.5'>
                  <Typography>Performance*</Typography>
                  <Typography color='text.primary' className='font-medium'>
                    +94.15%
                  </Typography>
                </div>
                <div>
                  <Button variant='contained'>View Report</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default RevenueAnalysis
