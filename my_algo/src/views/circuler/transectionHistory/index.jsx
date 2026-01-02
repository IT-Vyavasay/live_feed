// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import TransectionHistoryTable from './TransectionHistoryTable'

const TransectionHistory = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TransectionHistoryTable />
      </Grid>
    </Grid>
  )
}

export default TransectionHistory
