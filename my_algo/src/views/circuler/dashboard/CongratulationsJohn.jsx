'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, addRevenueSummaryWithIntervalFilter, setLoader } from '@/redux-store/slices/circuler/common'
import { getCategory } from '@/utils/apiController'
import { useEffect, useMemo } from 'react'

const CongratulationsJohn = ({ serverMode }) => {
  const dispatch = useDispatch()

  const selectedCategoryInDashboard =
    useSelector(state => state.commonReducer.revenueSummaryWithIntervalFilter.category) ?? 0 // ✅ default to 0

  const revenueSummaryWithIntervalFilter = useSelector(state => state.commonReducer.category)

  const setCategory = data => {
    dispatch(
      addRevenueSummaryWithIntervalFilter(
        data.category === 0
          ? { ...revenueSummaryWithIntervalFilter, interval: 'daily' }
          : { ...revenueSummaryWithIntervalFilter, ...data, interval: 'daily' }
      )
    )
  }

  const categoryList = useSelector(state => state.commonReducer.categoryList)

  const categoryOption = useMemo(() => {
    return (categoryList || []).map(c => ({ label: c.name, id: c.categoryId }))
  }, [categoryList])

  // Vars
  const darkImg = '/images/cards/user-john-dark.png'
  const lightImg = '/images/cards/user-john-light.png'

  // Hooks
  const image = useImageVariant(serverMode, lightImg, darkImg)

  const getCategoryData = async () => {
    dispatch(setLoader({ categoryList: true }))
    const response = await getCategory()
    dispatch(addCategory(response?.data?.data ?? []))
    dispatch(setLoader({ categoryList: false }))
  }

  useEffect(() => {
    if (!categoryList?.length) {
      getCategoryData()
    }
  }, [])

  return (
    <Card className='relative bs-full'>
      <CardContent className='sm:pbe-0'>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8} className='flex flex-col items-start gap-4'>
            <Typography variant='h4'>
              *Congratulations <span className='font-bold'>{'Ajay'}!</span> 🎉
            </Typography>
            <div className='flex'>
              <div>
                <Typography>
                  You have done 68% 😎 more income today. Check your revenue according to service category.
                </Typography>
              </div>
              <FormControl fullWidth>
                <InputLabel id='select-service-category'>Select Service Category</InputLabel>
                <Select
                  fullWidth
                  id='select-role'
                  value={selectedCategoryInDashboard} // ✅ always defined
                  onChange={e => setCategory({ category: e.target.value, providerCategory: 1 })}
                  label='Select Service Category'
                  labelId='select-service-category'
                  inputProps={{ placeholder: 'Select Service Category' }}
                >
                  <MenuItem value={0} name='all'>
                    All
                  </MenuItem>
                  {categoryOption.map((opt, index) => (
                    <MenuItem key={index} name={opt.label} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} md={4} className='max-sm:-order-1 max-sm:flex max-sm:justify-center'>
            <img
              alt='Upgrade Account'
              src={image}
              className='max-bs-[186px] sm:absolute block-end-0 inline-end-0 max-is-full'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CongratulationsJohn
