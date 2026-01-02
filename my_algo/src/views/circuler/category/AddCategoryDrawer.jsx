// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { manageCategory } from '@/utils/apiController'
import { setLoader } from '@/redux-store/slices/circuler/common'
import CommonButton from '@/components/commonComponents/CommonButton'
import { EdgesensorHigh } from '@mui/icons-material'

// Vars
const initialData = {
  name: '',
  image: ''
}

const AddCategoryDrawer = props => {
  // Props
  const { open, handleClose, data, onSuccessAction } = props
  const isUpdate = data?.categoryId ?? 0
  const loaderState = isUpdate ? 'updateCategoy' : 'addCategoy'
  const actionLoader = useSelector(state => state.commonReducer.loader[loaderState])
  const dispatch = useDispatch()

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      image: '',
      name: ''
    }
  })

  const onSubmit = async data => {
    let newRecord = {
      image: data?.image,
      name: data?.name
    }
    if (isUpdate) {
      newRecord.categoryId = data?.categoryId
    }
    dispatch(setLoader({ [loaderState]: true }))

    await manageCategory({
      data: JSON.stringify(newRecord),
      successMessage: { text: `Category ${isUpdate ? 'updated' : 'added'} successfully`, type: 'success' },
      successAction: onSuccessAction
    })

    dispatch(setLoader({ [loaderState]: false }))

    handleClose()
    resetForm({ name: '', image: '' })
  }

  const handleReset = () => {
    resetForm({ name: '', image: '' })
    handleClose()
  }

  useEffect(() => {
    if (isUpdate) {
      resetForm({ name: data.name, image: data?.image, categoryId: data?.categoryId })
    }
  }, [isUpdate])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add New Category</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='name'
            control={control}
            rules={{ required: isUpdate ? false : true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Category Name'
                placeholder='Category Name'
                {...(errors.name && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='image'
            control={control}
            rules={{ required: isUpdate ? false : true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='text'
                label='Category Icon'
                placeholder='Category Emogi'
                {...(errors.image && { error: true, helperText: 'Image is required.' })}
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <CommonButton onClick={handleSubmit} loading={actionLoader} type='submit'>
              {'Submit'}
            </CommonButton>

            <Button variant='outlined' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer
