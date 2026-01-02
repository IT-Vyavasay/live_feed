// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MultiSelect from '@/@core/components/mui/MultiSelect'
import CommonButton from '@/components/commonComponents/CommonButton'
import { Box } from '@mui/material'

const TableFilters = ({ setFiltereParams, tableData, categoryOption = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState([])

  const applyFilter = () => {
    setFiltereParams(prev => ({ ...prev, category: selectedCategory.join(',') }))
  }
  const clearFilter = () => {
    setFiltereParams({})
  }
  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='role-select'>Select Category</InputLabel>
            <MultiSelect
              label={'Select Category'}
              options={categoryOption.map(opt => opt.label)}
              value={categoryOption.filter(opt => selectedCategory?.includes(opt.id)).map(opt => opt.label)}
              onChange={selectedLabels => {
                const selectedIds = categoryOption.filter(opt => selectedLabels.includes(opt.label)).map(opt => opt.id)
                console.log(selectedIds)

                setSelectedCategory(selectedIds)
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ gap: '1rem', display: 'flex' }}>
            <CommonButton variant='contained' onClick={applyFilter}>
              Apply Filter
            </CommonButton>
            <CommonButton variant='contained' onClick={clearFilter}>
              Clear Filter
            </CommonButton>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
