import { getServerMode } from '@/@core/utils/serverHelpers'
import { getAcademyData } from '@/app/server/actions'
import PostsList from '@/views/circuler/posts'

const PostsListPage = async () => {
  // Vars
  const mode = getServerMode()
  const data = await getAcademyData()

  return <PostsList mode={mode} courseData={data?.courses} />
}

export default PostsListPage
