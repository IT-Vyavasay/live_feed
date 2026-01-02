// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import WithdrawRequestTable from './WithdrawRequestTable'

const WithdrawRequests = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <WithdrawRequestTable />
      </Grid>
    </Grid>
  )
}

export default WithdrawRequests
