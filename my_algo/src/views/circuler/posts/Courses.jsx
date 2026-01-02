import { useState, useEffect, memo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
// Util Imports
import PostCard from '@/components/commonComponents/PostCard'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, addPostList, setLoader, updatePost } from '@/redux-store/slices/circuler/common'
import { getCategory, getposts, updatePostData } from '@/utils/apiController'
import useReplaceReduxRecord from '@/hooks/useReplaceReduxRecord'

const chipColor = {
  Web: { color: 'primary' },
  Art: { color: 'success' },
  'UI/UX': { color: 'error' },
  Psychology: { color: 'warning' },
  Design: { color: 'info' }
}

const Courses = () => {
  // Props
  const [filtereParams, setFiltereParams] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const postList = useSelector(state => state.commonReducer.postList)

  const actionLoader = useSelector(state => state.commonReducer.loader)
  const categoryList = useSelector(state => state.commonReducer.categoryList)
  const postSearchValue = useSelector(state => state?.commonReducer?.generalData?.postSearch)
  const dispatch = useDispatch()
  const replacePost = useReplaceReduxRecord({
    despatchFun: modifiedData => dispatch(updatePost(modifiedData))
  })
  // const categoryListActionLoader = useSelector(state => state.commonReducer.loader.categoryList)
  const { recordCount, total, totalPages, data = [] } = postList ?? {}

  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(9)
  const [sort, setSort] = useState({})

  const serviceList = [
    {
      type: 'chat',
      icon: <i className='ri-message-3-line' />,
      className: 'bg-blue-100 text-blue-800'
    },
    {
      type: 'voice-call',
      icon: <i className='ri-phone-line text-xl' />,
      className: 'bg-green-100 text-green-800'
    },
    {
      type: 'video-call',
      icon: <i className='ri-video-on-line' />,
      className: 'bg-purple-100 text-purple-800'
    },
    {
      type: 'live-broadcasting',
      icon: <i className='ri-rfid-line' />,
      className: 'bg-red-100 text-red-800'
    },
    {
      type: 'post',
      icon: <i className='ri-file-paper-2-line' />,
      className: 'bg-yellow-100 text-yellow-800'
    },
    {
      type: 'video',
      icon: <i className='ri-play-large-line' />,
      className: 'bg-pink-100 text-pink-800'
    },
    {
      type: 'course',
      icon: <i className='ri-book-open-line' />,
      className: 'bg-indigo-100 text-indigo-800'
    }
  ]
  // ✅ Get a random item
  const getRandomService = () => {
    const randomIndex = Math.floor(Math.random() * serviceList.length)
    return serviceList[randomIndex]
  }
  // Example usage:

  const getData = async () => {
    dispatch(setLoader({ postList: true }))
    const response = await getposts({
      search: postSearchValue,
      pageLimit: rowsPerPage,
      page: curentPage,
      ...sort,
      ...filtereParams
    })
    dispatch(addPostList(response?.data?.data ?? {}))
    dispatch(setLoader({ postList: false }))
  }

  const getCategoryData = async () => {
    dispatch(setLoader({ categoryList: true }))
    const response = await getCategory()
    dispatch(addCategory(response?.data?.data ?? []))
    dispatch(setLoader({ categoryList: false }))
  }

  const onDeleteRecord = async data => {
    const { action, id, isBlocked, isSoftDeleted } = data
    dispatch(setLoader({ [`post-${id}-${action}`]: true }))
    const response = await updatePostData({
      isSoftDeleted,
      isBlocked,
      postId: id
    })

    console.log({ id })
    if (response?.data?.isSuccess) {
      replacePost({
        pathArray: ['commonReducer', 'postList', 'data'],
        uniqueKey: 'postId',
        uniqueValue: id,
        newRecord: { isSoftDeleted: response?.data?.data?.isSoftDeleted, isBlocked: response?.data?.data?.isBlocked },
        recordListKey: 'postList'
      })
    }
    dispatch(setLoader({ [`post-${id}-${action}`]: false }))
  }

  useEffect(() => {
    getData()
  }, [curentPage, rowsPerPage, postSearchValue, sort, filtereParams])

  useEffect(() => {
    if (categoryList?.length == 0) {
      getCategoryData()
    }
  }, [curentPage, rowsPerPage, globalFilter, sort, filtereParams])

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <Typography variant='h5'>All Posts</Typography>
            {/* <Typography>Total 6 course you have purchased</Typography> */}
          </div>
          <div className='flex flex-wrap items-center gap-y-4 gap-x-6'>
            <FormControl fullWidth size='small' className='is-[250px] flex-auto'>
              <InputLabel id='course-select'>Post type</InputLabel>
              <Select
                fullWidth
                id='select-course'
                value={filtereParams.isPaid ?? '0'}
                onChange={e => {
                  setFiltereParams({ isPaid: e.target.value })
                  setCurrentPage(0)
                }}
                label='Post type'
                labelId='course-select'
              >
                <MenuItem value={0}>All Post</MenuItem>
                <MenuItem value='1'>Paid</MenuItem>
                <MenuItem value='2'>Unpaid</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className='flex justify-center'>
          <Pagination
            count={totalPages}
            page={curentPage + 1}
            showFirstButton
            showLastButton
            variant='tonal'
            color='primary'
            onChange={(e, page) => setCurrentPage(page - 1)}
          />
        </div>
        {data && data.length > 0 ? (
          <Grid container spacing={6}>
            {data.map((item, index) => {
              const RandomService = getRandomService()
              return (
                <PostCard
                  key={index}
                  item={item}
                  RandomService={RandomService}
                  onDeleteRecord={onDeleteRecord}
                  actionLoader={actionLoader}
                />
              )
            })}
          </Grid>
        ) : (
          <Typography className='text-center'>No post found</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default memo(Courses)
