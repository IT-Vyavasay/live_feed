// Data Imports
import { getUserData } from '@/app/server/actions'
import CategoryList from '@/views/circuler/category'

const CategoryListPage = async () => {
  // Vars
  const data = await getUserData()

  return <CategoryList userData={data} />
}

export default CategoryListPage
