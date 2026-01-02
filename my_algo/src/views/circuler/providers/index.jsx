// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ProviderListTable from './ProviderListTable'
import ProviderListCards from './ProviderListCards'

const ProviderList = () => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <ProviderListCards />
      </Grid> */}
      <Grid item xs={12}>
        <ProviderListTable />
      </Grid>
    </Grid>
  )
}

export default ProviderList
