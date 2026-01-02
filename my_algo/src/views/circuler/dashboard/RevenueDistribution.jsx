'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import classnames from 'classnames'

// Components Imports
import OptionMenu from '@core/components/option-menu'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Styles Imports
import tableStyles from '@core/styles/table.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { addRevenueSummaryWithInterval, setLoader } from '@/redux-store/slices/circuler/common'
import { getProviders, getRevenueSummaryWithInterval } from '@/utils/apiController'
import { useEffect, useMemo, useState } from 'react'
import { sumArray } from '@/utils/common'

// Vars

// const series = [
//   {
//     name: 'Admin share',
//     data: [155, 135, 320, 100, 150, 335, 160, 155, 135, 320, 100]
//   },
//   {
//     name: 'Provider share',
//     data: [110, 235, 125, 230, 215, 115, 200, 125, 230, 215, 115]
//   }
// ]

const RevenueDistribution = ({ graphData }) => {
  // Hooks

  const theme = useTheme()

  const series = useMemo(
    () => [
      {
        name: 'Admin share',
        data: graphData?.adminShare
      },
      {
        name: 'Provider share',
        data: graphData?.providerShare
      }
    ],
    [graphData]
  )
  const data = useMemo(
    () => [
      {
        sales: `${sumArray(graphData?.adminShare)} ₹`,
        title: 'Admin share',
        trendNumber: '82%',
        trend: 'down',
        iconColor: 'primary'
      },
      {
        sales: `${sumArray(graphData?.providerShare)} ₹`,
        title: 'Provider share',
        trendNumber: '52%',
        trend: 'up',
        iconColor: 'secondary'
      }
    ],
    [graphData]
  )
  const options = useMemo(
    () => ({
      chart: {
        stacked: true,
        parentHeightOffset: 0,
        toolbar: { show: true }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '45%',
          borderRadiusApplication: 'around',
          borderRadiusWhenStacked: 'all'
        }
      },
      xaxis: {
        labels: { show: true },
        axisTicks: { show: true },
        axisBorder: { show: true },
        categories: graphData?.interval ?? []
      },
      yaxis: { show: true },
      colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-secondary-main)'],
      grid: {
        strokeDashArray: 10,
        borderColor: 'var(--mui-palette-divider)',
        padding: {
          top: -25,
          left: -4,
          right: -5,
          bottom: -10
        }
      },
      legend: { show: true },
      dataLabels: { enabled: true },
      stroke: {
        width: 6,
        curve: 'smooth',
        lineCap: 'round',
        colors: ['var(--mui-palette-background-paper)']
      },
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      responsive: [
        {
          breakpoint: theme.breakpoints.values.xl,
          options: {
            plotOptions: {
              bar: { columnWidth: '48%', borderRadius: 9 }
            }
          }
        },
        {
          breakpoint: 1445,
          options: {
            plotOptions: {
              bar: { columnWidth: '52%' }
            }
          }
        },
        {
          breakpoint: 1368,
          options: {
            plotOptions: {
              bar: { columnWidth: '55%', borderRadius: 8 }
            }
          }
        },
        {
          breakpoint: 1201,
          options: {
            plotOptions: {
              bar: { columnWidth: '48%' }
            }
          }
        },
        {
          breakpoint: 1081,
          options: {
            plotOptions: {
              bar: { columnWidth: '55%', borderRadius: 7 }
            }
          }
        },
        {
          breakpoint: theme.breakpoints.values.md,
          options: {
            plotOptions: {
              bar: { columnWidth: '45%', borderRadius: 8 }
            }
          }
        },
        {
          breakpoint: 750,
          options: {
            plotOptions: {
              bar: { columnWidth: '50%', borderRadius: 7 }
            }
          }
        },
        {
          breakpoint: theme.breakpoints.values.sm,

          options: {
            plotOptions: {
              bar: { columnWidth: '40%', borderRadius: 8 }
            }
          }
        },
        {
          breakpoint: 450,
          options: {
            plotOptions: {
              bar: { columnWidth: '45%', borderRadius: 7 }
            }
          }
        }
      ]
    }),
    [graphData]
  )

  return (
    <Card>
      <CardHeader title='Revenue Distribution' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <CardContent className='flex flex-col gap-10 pbs-5'>
        <AppReactApexCharts type='bar' height={260} width='100%' series={series} options={options} />
        <div className='w-fit'>
          <table className={tableStyles.table}>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className='border-0'>
                  <td className='!pis-0 !pbe-0 !pbs-2 !bs-6'>
                    <div className='flex items-center gap-2 !pis-0'>
                      <i className={`ri-circle-fill text-sm text-${row.iconColor}`} />
                      <Typography variant='body2' color='text.primary' className='font-medium'>
                        {row.title}
                      </Typography>
                    </div>
                  </td>
                  <td className='text-end !pbe-0 !pbs-2 !bs-6'>
                    <Typography variant='body2'>{row.sales}</Typography>
                  </td>
                  {/* <td className='!pie-0 !pbe-0 !pbs-2 !bs-6'>
                    <div className='flex gap-2 items-center justify-end !pie-0'>
                      <Typography variant='body2' color='text.primary' className='font-medium'>
                        {row.trendNumber}
                      </Typography>
                      <i
                        className={classnames(
                          row.trend === 'up' ? 'ri-arrow-up-s-line text-success' : 'ri-arrow-down-s-line text-error'
                        )}
                      />
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueDistribution
