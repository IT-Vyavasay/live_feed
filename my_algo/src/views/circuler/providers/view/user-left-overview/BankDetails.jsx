'use client'
import { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useDispatch, useSelector } from 'react-redux'
import { manageBankDetails } from '@/utils/apiController'
import CommonButton from '@/components/commonComponents/CommonButton'

const EditableField = ({ title, value, onChange, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleBlur = () => {
    setIsEditing(false)
    onChange(inputValue)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  return (
    <div className='flex flex-col gap-1'>
      <Typography className='text-sm text-gray-500'>{title}</Typography>
      {isEditing ? (
        <TextField
          size='small'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          type={type}
        />
      ) : (
        <Typography variant='body1' className='cursor-pointer text-base' onClick={() => setIsEditing(true)}>
          {value}
        </Typography>
      )}
    </div>
  )
}

const EditableSelectField = ({ title, value, onChange, options }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  const handleBlur = () => {
    setIsEditing(false)
    onChange(selectedValue)
  }

  const handleChange = event => {
    setSelectedValue(event.target.value)
  }

  return (
    <div className='flex flex-col gap-1'>
      <Typography className='text-sm text-gray-500'>{title}</Typography>
      {isEditing ? (
        <FormControl size='small' fullWidth autoFocus>
          <InputLabel id={`${title}-label`}>{title}</InputLabel>
          <Select
            labelId={`${title}-label`}
            value={selectedValue}
            label={title}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            MenuProps={{ disablePortal: true }}
          >
            {options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography variant='body1' className='cursor-pointer text-base' onClick={() => setIsEditing(true)}>
          {value}
        </Typography>
      )}
    </div>
  )
}

const BankDetails = () => {
  const [loader, setLoader] = useState(false)
  const providerDetails = useSelector(state => state?.commonReducer?.providerDetails)[0] ?? {}
  const { role, id } = providerDetails ?? {}

  const [fields, setFields] = useState({
    accountHolderName: 'John Doe',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India'
  })

  const bankOptions = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Kotak Mahindra Bank'
  ]

  const handleChange = async (field, value) => {
    setFields(prev => ({ ...prev, [field]: value }))

    setLoader(true)
    await manageBankDetails({
      ...fields,
      role,
      roleId: id
    })

    setLoader(false)
  }

  return (
    <Card>
      <Grid>
        <Grid>
          <CardContent>
            <Typography variant='h5' className='mb-2'>
              Bank Details{' '}
              {loader && (
                <CommonButton
                  variant='contained'
                  color='primary'
                  preIcon={<i className='ri-search-2-line' />}
                  onlyIcon={true}
                  loading={loader}
                />
              )}
            </Typography>

            <Divider className='mb-7' />

            <Grid container>
              {/* Left Column */}
              <Grid size={{ xs: 12, sm: 6 }} className='flex flex-col pe-5 gap-[26px]'>
                <EditableField
                  title='Account Holder Name'
                  value={fields.accountHolderName}
                  onChange={val => handleChange('accountHolderName', val)}
                />
                <EditableField
                  title='Account Number'
                  value={fields.accountNumber}
                  type={'number'}
                  onChange={val => handleChange('accountNumber', val)}
                />
              </Grid>

              {/* Right Column */}
              <Grid size={{ xs: 12, sm: 6 }} className='flex flex-col max-sm:mb-6 sm:ps-5 sm:border-l gap-[26px]'>
                <EditableField
                  title='IFSC Code'
                  value={fields.ifscCode}
                  onChange={val => handleChange('ifscCode', val)}
                />
                <EditableSelectField
                  title='Bank Name'
                  value={fields.bankName}
                  onChange={val => handleChange('bankName', val)}
                  options={bankOptions}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default BankDetails
