// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import DashboardAnalytics from '@/views/circuler/dashboard'

const DashboardPage = () => {
  // Vars
  const serverMode = getServerMode()

  return <DashboardAnalytics serverMode={serverMode} />
}

export default DashboardPage
