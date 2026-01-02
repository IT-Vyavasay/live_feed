// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import { CircularProgress } from '@mui/material'

const CardStatVertical = props => {
  // Props
  const {
    title,
    stats,
    avatarIcon,
    avatarColor,
    trendNumber,
    trend,
    chipText,
    chipColor,
    avatarSkin,
    avatarSize,
    totalRevenue,
    loader
  } = props ?? {}

  return (
    <Card onClick={() => console.log(props)}>
      <CardContent className='flex flex-wrap justify-between items-start gap-2'>
        <CustomAvatar size={avatarSize} variant='rounded' skin={avatarSkin} color={avatarColor}>
          {loader ? <CircularProgress size={20} color='inherit' /> : <i className={avatarIcon} />}
        </CustomAvatar>

        <div className='flex flex-col flex-wrap gap-1'>
          <Typography variant='h5'>{totalRevenue ?? 0} ₹</Typography>
          <Typography>{title}</Typography>
        </div>
        {/* <div className='flex flex-col '>
          <div className='flex items-center gap-2'>
            <Typography color={'success.main'}>{`${trendNumber}$`}</Typography>
            <i className={classnames('text-lg', 'ri-hand-coin-line text-success')}></i>
          </div>
        </div> */}
      </CardContent>
      {/* <CardContent className='flex flex-col items-start gap-4'>
        <div className='flex flex-col flex-wrap gap-1'>
          <Typography variant='h5'>{totalRevenue ?? 0} ₹</Typography>
          <Typography>{title}</Typography>
        </div>
        <Chip size='small' variant='tonal' label={`${trendNumber + 10}$ Remain to Accept`} color={chipColor} />
      </CardContent> */}
    </Card>
  )
}

export default CardStatVertical
