'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm } from 'react-hook-form'

// Project Imports
import CommonButton from '@/@core/components/mui/CommonButton'
import CommonFormRenderer from '@/@core/components/mui/CommonFormRenderer'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProvider, verifyProviderOtp } from '@/utils/apiController'
import { setLoader } from '@/redux-store/slices/circuler/common'

const AddProviderDrawer = props => {
  const { open, handleClose, data, onSuccessAction, categoryOption } = props
  const isUpdate = !!data?.id
  const loaderState = 'addUpdateProvider'
  const actionLoader = useSelector(state => state.commonReducer.loader[loaderState])
  const dispatch = useDispatch()

  const baseFormFieldData = [
    { name: 'username', type: 'text', label: 'User Name' },
    { name: 'name', type: 'text', label: 'Name' },
    { name: 'mobile', type: 'number', label: 'Mobile Number' },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      options: categoryOption
    }
  ]

  const [formField, setFormField] = useState(baseFormFieldData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [initialMobile, setInitialMobile] = useState('')
  const dFVal = {
    username: 'hello',
    name: 'hi',
    mobile: '1234567890',
    category: 61,
    otp: '000000'
  }
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm({
    defaultValues: {
      username: 'hello',
      name: 'hi',
      mobile: '1234567890',
      category: 61,
      otp: '000000'
    }
  })

  const onSubmit = async formData => {
    try {
      dispatch(setLoader({ [loaderState]: true }))
      const newRecord = {
        providerId: data?.id,
        username: formData.username,
        name: formData.name,
        mobile: formData.mobile,
        category: formData.category
      }

      if (isUpdate && formData.mobile == initialMobile && !isSubmitted) {
        // Mobile not changed for update: skip OTP
        const response = await addNewProvider(newRecord)
        console.log('Direct update without OTP:', newRecord)
        // await dispatch or API
        onSuccessAction?.()
        handleReset()
      } else if (isUpdate && formData.mobile != initialMobile && !isSubmitted) {
        // Mobile not changed for update: skip OTP
        const response = await addNewProvider(newRecord)
        console.log('Direct update without OTP:', newRecord)
        setIsSubmitted(true)
        setFormField(prev => [...prev, { name: 'otp', type: 'number', label: 'OTP', required: true }])
        setValue('id', data?.id)
      } else if (!isSubmitted) {
        // First step - trigger OTP
        const response = await addNewProvider(newRecord)

        const recordId = response?.data?.data?.results[0]?.['insertId']
        setValue('id', recordId)

        console.log({ response })
        setIsSubmitted(true)
        setFormField(prev => [...prev, { name: 'otp', type: 'number', label: 'OTP', required: true }])
      } else {
        // OTP Verification Step
        if (`${formData.otp}`.length === 6) {
          await verifyProviderOtp({ otp: formData.otp, providerId: formData.id })

          setIsOtpVerified(true)

          if (isUpdate) {
            newRecord.id = data?.id
          }

          console.log('Final submission after OTP:', { newRecord })
          // await dispatch or API
          onSuccessAction?.()
          handleReset()
        } else {
          alert('Invalid OTP') // replace with UI feedback
        }
      }
      dispatch(setLoader({ [loaderState]: false }))
    } catch (error) {
      dispatch(setLoader({ [loaderState]: false }))
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setIsOtpVerified(false)
    setFormField(baseFormFieldData)
    resetForm(dFVal)
    handleClose()
  }

  useEffect(() => {
    if (isUpdate) {
      resetForm({
        username: data?.userName ?? '',
        name: data?.name ?? '',
        mobile: data?.mobile ?? '',
        category: data?.category?.[0]?.['categoryId'] ?? '',
        otp: ''
      })
      setInitialMobile(data?.mobile ?? '')
    }
  }, [isUpdate])

  // Disable all fields except OTP in OTP stage
  const isOtpStep = isSubmitted && !isOtpVerified
  const getDisabledState = field => {
    if (!isOtpStep) return false
    return field.name !== 'otp'
  }

  const disabledFields = formField.map(field => ({
    ...field,
    disabled: getDisabledState(field)
  }))

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
        <Typography variant='h5'>{isUpdate ? 'Update' : 'Add New'} Provider</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5' noValidate>
          <CommonFormRenderer formFields={disabledFields} control={control} errors={errors} />

          <div className='flex items-center gap-4'>
            <CommonButton variant='contained' type='submit' loading={actionLoader}>
              {isOtpStep ? 'Verify OTP' : 'Submit'}
            </CommonButton>
            <Button variant='outlined' color='error' type='button' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddProviderDrawer
