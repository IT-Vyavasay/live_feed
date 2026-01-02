// Data Imports
import { getUserData } from '@/app/server/actions'
import ProviderList from '@/views/circuler/providers'

const ProviderListPage = async () => {
  // Vars
  const data = await getUserData()

  return <ProviderList userData={data} />
}

export default ProviderListPage
