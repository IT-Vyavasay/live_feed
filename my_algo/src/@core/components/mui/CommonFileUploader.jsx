import { useState, useEffect } from 'react'

// MUI
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'

// Dropzone
import { useDropzone } from 'react-dropzone'

const CommonFileUploader = ({ multiple = false, value = multiple ? [] : null, onChange, lable = '' }) => {
  const [files, setFiles] = useState(multiple ? [] : null)

  useEffect(() => {
    setFiles(value)
  }, [value])

  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      if (multiple) {
        const newFiles = [...(files || []), ...acceptedFiles]
        setFiles(newFiles)
        onChange && onChange(newFiles)
      } else {
        setFiles(acceptedFiles[0])
        onChange && onChange(acceptedFiles[0])
      }
    }
  })

  const handleRemoveFile = fileToRemove => {
    if (!multiple) {
      setFiles(null)
      onChange && onChange(null)
    } else {
      const updatedFiles = files.filter(file => file.name !== fileToRemove.name)
      setFiles(updatedFiles)
      onChange && onChange(updatedFiles)
    }
  }

  const handleRemoveAll = () => {
    setFiles(multiple ? [] : null)
    onChange && onChange(multiple ? [] : null)
  }

  const renderPreview = file => {
    return (
      <img
        key={file.name}
        src={URL.createObjectURL(file)}
        alt={file.name}
        className='file-preview-image'
        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
      />
    )
  }

  return (
    <>
      <Box
        {...getRootProps({ className: 'dropzone' })}
        sx={{
          border: '1px dashed #ccc',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 2
        }}
      >
        <input {...getInputProps()} />
        {!files || (Array.isArray(files) && files.length === 0) ? (
          <div className='flex items-center flex-col'>
            <Avatar variant='rounded' sx={{ mb: 2 }}>
              <i className='ri-upload-2-line' />
            </Avatar>
            <Typography variant='h5'>
              Drop {`${lable}`.toLocaleLowerCase() ?? `files here`} or click to upload.
            </Typography>
            <Typography color='text.secondary'>
              Or{' '}
              <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                browse
              </a>{' '}
              your device
            </Typography>
          </div>
        ) : multiple ? (
          <>
            <List sx={{ width: '100%' }}>
              {files.map(file => (
                <ListItem
                  key={file.name}
                  secondaryAction={
                    <IconButton onClick={() => handleRemoveFile(file)}>
                      <i className='ri-close-line text-xl' />
                    </IconButton>
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={URL.createObjectURL(file)} variant='rounded' />
                    <div>
                      <Typography>{file.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </div>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box mt={2} display='flex' gap={2}>
              <Button variant='outlined' color='error' onClick={handleRemoveAll}>
                Remove All
              </Button>
              <Button variant='contained'>Upload</Button>
            </Box>
          </>
        ) : (
          renderPreview(files)
        )}
      </Box>
    </>
  )
}

export default CommonFileUploader
