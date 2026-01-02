// Data Imports
import { getUserData } from '@/app/server/actions'
import UserList from '@/views/circuler/users'

const UserListPage = async () => {
  // Vars
  const data = await getUserData()

  return <UserList userData={data} />
}

export default UserListPage
