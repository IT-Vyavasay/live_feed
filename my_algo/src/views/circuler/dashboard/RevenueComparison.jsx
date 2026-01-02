'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import useHooks from '@/hooks/useHooks'
import { excludeKeys } from '@/utils/common'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const RevenueComparison = ({ totalRevenue }) => {
  // Hooks
  const theme = useTheme()

  const graphData = useHooks({
    hookType: 'memo',
    input: {
      key: Object.keys(excludeKeys({ obj: totalRevenue, keysToRemove: ['total'] })),
      value: Object.values(excludeKeys({ obj: totalRevenue, keysToRemove: ['total'] }))
    },
    dependencies: [totalRevenue]
  })

  const options = useHooks({
    hookType: 'memo',
    input: {
      chart: {
        sparkline: { enabled: true }
      },
      colors: [
        'var(--mui-palette-warning-main)',
        'rgba(var(--mui-palette-warning-mainChannel) / 0.8)',
        'rgba(var(--mui-palette-warning-mainChannel) / 0.6)',
        'rgba(var(--mui-palette-warning-mainChannel) / 0.4)',
        'rgba(var(--mui-palette-warning-mainChannel) / 0.2)'
      ],
      grid: {
        padding: {
          bottom: -30
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '15px',
        offsetY: 5,
        itemMargin: {
          horizontal: 28,
          vertical: 6
        },
        labels: {
          colors: 'var(--mui-palette-text-secondary)'
        },
        markers: {
          offsetY: 1,
          offsetX: theme.direction === 'rtl' ? 4 : -1,
          width: 10,
          height: 10
        }
      },
      tooltip: { enabled: false },
      dataLabels: { enabled: false },
      stroke: { width: 4, lineCap: 'round', colors: ['var(--mui-palette-background-paper)'] },
      labels: graphData.key,
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      plotOptions: {
        pie: {
          endAngle: 130,
          startAngle: -130,
          customScale: 0.9,
          donut: {
            size: '83%',
            labels: {
              show: true,
              name: {
                offsetY: 25,
                fontSize: '0.9375rem',
                color: 'var(--mui-palette-text-secondary)'
              },
              value: {
                offsetY: -15,
                fontWeight: 500,
                fontSize: '1.75rem',
                formatter: value => `${value} ₹`,
                color: 'var(--mui-palette-text-primary)'
              },
              total: {
                show: true,
                label: '2026',
                fontSize: '1rem',
                color: 'var(--mui-palette-text-secondary)',
                formatter: value => `${value.globals.seriesTotals.reduce((total, num) => total + num)} ₹`
              }
            }
          }
        }
      }
    },

    dependencies: [graphData]
  })

  return (
    <Card>
      <CardHeader
        title='Revenue Comparison'
        action={<OptionMenu options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      />
      <CardContent>
        <AppReactApexCharts type='donut' height={373} width='100%' options={options} series={graphData.value} />
      </CardContent>
    </Card>
  )
}

export default RevenueComparison
