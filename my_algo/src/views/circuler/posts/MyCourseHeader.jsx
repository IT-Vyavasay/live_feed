// MUI Imports
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useDispatch, useSelector } from 'react-redux'
import { setGeneralData } from '@/redux-store/slices/circuler/common'
import { useEffect, useState } from 'react'
import CommonButton from '@/components/commonComponents/CommonButton'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField
      {...props}
      onChange={e => setValue(e.target.value)}
      placeholder='Find post by description'
      size='small'
      value={value}
      className='sm:is-[350px] max-sm:flex-1'
    />
  )
}

const MyCourseHeader = props => {
  // Props
  const { mode } = props
  const dispatch = useDispatch()
  const setSearchValue = value => dispatch(setGeneralData({ postSearch: value }))
  const [search, setSearch] = useState('')
  const postListActionLoader = useSelector(state => state.commonReducer.loader.postList)
  const lightIllustration = '/images/apps/academy/hand-with-bulb-light.png'
  const darkIllustration = '/images/apps/academy/hand-with-bulb-dark.png'

  // Hooks
  const theme = useTheme()
  const leftIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  return (
    <Card className='relative flex justify-center'>
      <img src={leftIllustration} className='max-md:hidden absolute max-is-[100px] top-12 start-12' />
      <div className='flex flex-col items-center gap-4 max-md:pli-5 plb-12 md:is-1/2'>
        <Typography variant='h4' className='text-center md:is-3/4'>
          Education, talents, career and other consulting service.{' '}
          <span className='text-primary'>All in one place.</span>
        </Typography>
        <Typography className='text-center'>
          Get expert consultancy across all domains — legal, medical, business, wellness, education, and more — through
          trusted professionals via chats, voices, video calls, and posts on the Mediule platform.
        </Typography>
        <div className='flex items-center gap-4 max-sm:is-full'>
          <DebouncedInput
            value={search}
            onChange={value => setSearch(value)}
            placeholder='Find post'
            className='sm:is-[350px] max-sm:flex-1'
          />

          <CommonButton
            variant='contained'
            color='primary'
            onClick={() => setSearchValue(search)}
            preIcon={<i className='ri-search-2-line' />}
            onlyIcon={true}
            loading={postListActionLoader}
          />
        </div>
      </div>
      <img
        src='/images/apps/academy/9.png'
        className={classnames('max-md:hidden absolute max-bs-[180px] bottom-0 end-0', {
          'scale-x-[-1]': theme.direction === 'rtl'
        })}
      />
    </Card>
  )
}

export default MyCourseHeader
