// MUI Imports
import { styled } from '@mui/material/styles'
import MuiSlider from '@mui/material/Slider'

const marks = [
  {
    value: 0
  },
  {
    value: 20
  },
  {
    value: 37
  },
  {
    value: 100
  }
]

// Styled Slider component
const Slider = styled(MuiSlider)(({ theme }) => ({
  blockSize: 2,
  padding: '15px 0',
  color: 'var(--mui-palette-primary-main)',
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf'
  },
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-mark': {
    inlineSize: 1,
    blockSize: 8,
    backgroundColor: '#bfbfbf',
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor'
    }
  },
  '& .MuiSlider-thumb': {
    inlineSize: 28,
    blockSize: 28,
    border: 'none',
    backgroundColor: 'var(--mui-palette-common-white)',
    boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02) !important',

      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'
      }
    }
  },
  '& .MuiSlider-valueLabel': {
    top: -6,
    fontSize: 12,
    fontWeight: 'normal',
    backgroundColor: 'unset',
    color: 'var(--mui-palette-text-primary)',
    '&:before': {
      display: 'none'
    },
    '& *': {
      background: 'transparent',
      color: 'var(--mui-palette-common-black)',
      ...theme.applyStyles('dark', {
        color: 'var(--mui-palette-common-white)'
      })
    }
  }
}))

const SliderCustomized = ({ onChange, value }) => (
  <Slider
    value={value}
    onChange={onChange}
    marks={marks}
    defaultValue={value}
    valueLabelDisplay='on'
    aria-labelledby='customized-slider'
  />
)

export default SliderCustomized
