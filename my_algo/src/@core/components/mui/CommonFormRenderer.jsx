import { Controller } from 'react-hook-form'
import { useState } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

import MultiSelect from '@/@core/components/mui/MultiSelect'
import CommonDatePicker from '@/@core/components/mui/CommonDatePicker'
import { Button } from '@mui/material'
import CommonFileUploader from './CommonFileUploader'

const CommonFormRenderer = ({ formFields, control, errors }) => {
  const [imagePreview, setImagePreview] = useState({})

  const handleImageChange = (e, onChange, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => ({ ...prev, [fieldName]: reader.result }))
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  return (
    <>
      {formFields &&
        formFields.map(field => {
          if (field.type === 'select') {
            return (
              <FormControl fullWidth key={field.name} error={Boolean(errors[field.name])}>
                <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: controllerField }) => (
                    <Select labelId={`${field.name}-label`} label={field.label} {...controllerField}>
                      {field.options.map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors[field.name] && <FormHelperText>This field is required.</FormHelperText>}
              </FormControl>
            )
          }

          if (field.type === 'multiSelect') {
            return (
              <FormControl fullWidth key={field.name} error={Boolean(errors[field.name])}>
                <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: controllerField }) => (
                    <MultiSelect
                      label={field.label}
                      options={field.options.map(opt => opt.label)}
                      value={field.options.filter(opt => controllerField.value?.includes(opt.id)).map(opt => opt.label)}
                      onChange={selectedLabels => {
                        const selectedIds = field.options
                          .filter(opt => selectedLabels.includes(opt.label))
                          .map(opt => opt.id)
                        controllerField.onChange(selectedIds)
                      }}
                    />
                  )}
                />
                {errors[field.name] && <FormHelperText>This field is required.</FormHelperText>}
              </FormControl>
            )
          }

          if (['date', 'date-range'].includes(field.type)) {
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                rules={{ required: field.required }}
                render={({ field: controllerField }) => (
                  <CommonDatePicker
                    label={field.label}
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                    type={field.type}
                  />
                )}
              />
            )
          }

          if (field.type === 'textarea') {
            return (
              <Box key={field.name} display='flex' alignItems='center' gap={1}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      multiline
                      rows={4}
                      fullWidth
                      label={field.label}
                      placeholder={field.label}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name] && 'This field is required.'}
                    />
                  )}
                />
              </Box>
            )
          }

          if (field.type === 'file') {
            return (
              <Box key={field.name} mb={4}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: controllerField }) => (
                    <CommonFileUploader
                      multiple={field?.multiple || false}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      lable={field.label}
                    />
                  )}
                />
                {errors[field.name] && <FormHelperText error>This field is required.</FormHelperText>}
              </Box>
            )
          }

          return (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: controllerField }) => (
                <Box sx={{ position: 'relative' }}>
                  <TextField
                    {...controllerField}
                    fullWidth
                    label={field.label}
                    type={field.type}
                    placeholder={field.label}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name] && 'This field is required.'}
                  />
                  {field.endAdornment && (
                    <Box sx={{ position: 'absolute', top: '10px', right: '2px' }}>{field.endAdornment}</Box>
                  )}
                </Box>
              )}
            />
          )
        })}
    </>
  )
}

export default CommonFormRenderer
