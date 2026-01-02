'use client'

import ConfigurationDistribution from '@/components/commonComponents/ConfigurationDistribution'
import { Button, Card, CardContent, Grid } from '@mui/material'

// Vars

const Connections = () => {
  return (
    <Card>
      <Grid>
        <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'></Grid>
        <ConfigurationDistribution />

        <Grid>
          <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
            <CardContent className='flex gap-4'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button variant='outlined' color='secondary' type='reset'>
                Reset
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Connections
