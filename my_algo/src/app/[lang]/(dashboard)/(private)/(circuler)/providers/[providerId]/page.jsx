'use client'
// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserLeftOverview from '@views/circuler/providers/view/user-left-overview'
import ProviderRevenueCards from '@/views/circuler/providers/view/ProviderRevenueCards'
import BankDetails from '@/views/circuler/providers/view/user-left-overview/BankDetails'
import ProjectListTable from '@/views/circuler/providers/view/user-right/overview/ProjectListTable'
import { Box } from '@mui/material'

const OverViewTab = dynamic(() => import('@views/circuler/providers/view/user-right/overview'))

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/pricing` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
/* const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
} */
const UserViewTab = () => {
  return (
    <Grid container spacing={6}>
      {/* Full width item */}
      <Grid item xs={12} width={'100%'}>
        <ProviderRevenueCards />
      </Grid>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr', lg: '1fr 3fr' },
          gap: 6,
          width: '100%'
        }}
      >
        <Box>
          <UserLeftOverview />
        </Box>
        <Box>
          <Box display='flex' flexDirection='column' gap={6}>
            <ProjectListTable />
            <BankDetails />
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}

export default UserViewTab
