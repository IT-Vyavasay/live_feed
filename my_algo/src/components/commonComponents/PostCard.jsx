// components/PostCard.tsx
import { Button, Typography, Grid, Badge, Tooltip } from '@mui/material'
import ImageSlider from '../ImageSlider'
import { convert_date, timeAgo } from '@/utils/common'
import CommonButton from './CommonButton'
import { memo } from 'react'

const StatusBadge = ({ status }) => {
  let color
  let label

  switch (status) {
    case 'paid':
      color = 'info'
      label = 'Paid'
      break

    default:
      color = 'warning'
      label = 'Unpaid'
      break
  }

  return <Badge badgeContent={label} color={color} />
}

function getFileUrlList({ fileUrlList }) {
  try {
    const parsed = JSON.parse(fileUrlList)
    if (!Array.isArray(parsed)) return null
    return parsed.map(item => item.fileUrl).filter(Boolean)
  } catch (e) {
    console.log('Invalid JSON:', e)
    return null
  }
}

const PostCard = ({ item: post, actionLoader, onDeleteRecord = () => {} }) => {
  const parceList = getFileUrlList({ fileUrlList: post.fileUrlList })

  const {
    provider: { name, profileImg },
    createdOn,
    description,
    likes,
    save,
    comments,
    postPrice,
    revenue,
    type,
    postId,
    isBlocked,
    isSoftDeleted
  } = post ?? {}

  const isPostDelete = isBlocked == 1 && isSoftDeleted == 1
  return (
    <Grid item xs={12} sm={6} md={4}>
      <div
        className='border rounded-lg bs-full relative flex flex-col justify-between'
        onClick={() => console.log({ post })}
      >
        <div className='pli-2 pbs-2 relative'>
          <ImageSlider images={parceList} description={description ?? ''} />

          <div className='absolute top-[20px] right-[40px]'>
            <StatusBadge status={type == 1 ? 'paid' : 'free'} />
          </div>

          <div
            className={`flex items-center justify-between absolute rounded-[35px] bg-[#ffffff] px-[6px] py-0 bottom-[10px] left-[1rem] bg-blue-100 text-blue-800`}
          >
            <div className='flex items-center'>
              <img
                alt='User Avatar'
                src={profileImg ?? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?...'}
                className='relative inline-block h-8 w-8 rounded-full'
              />
              <div className='flex flex-col ml-3 text-sm'>
                <span className='text-slate-800 font-semibold'>{name ?? 'Unknown'}</span>
                <span className='text-slate-600'>{convert_date(createdOn ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 p-5'>
          {/* <div className='flex items-center justify-between'>
            <div className='absolute top-[20px] right-[40px]'>
              <StatusBadge status={'paid'} />
            </div>

            <div
              className={`flex items-center justify-between absolute rounded-[35px] bg-[#ffffff94] px-[6px] py-0 bottom-[13rem] left-[1rem] bg-blue-100 text-blue-800`}
            >
              <div className='flex items-center'>
                <img
                  alt='User Avatar'
                  src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?...'
                  className='relative inline-block h-8 w-8 rounded-full'
                />
                <div className='flex flex-col ml-3 text-sm'>
                  <span className='text-slate-800 font-semibold'>Lewis Daniel</span>
                  <span className='text-slate-600'>January 10, 2024</span>
                </div>
              </div>
            </div>
          </div> */}
          {parceList && (
            <div className='flex flex-col gap-1 h-20 overflow-y-auto'>
              <Typography>
                {' '}
                <span className='font-bold'>Description: </span>
                {description}
              </Typography>
            </div>
          )}

          <div className='flex items-start justify-between w-full'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1'>
                <i className='ri-time-line text-xl' />
                <Typography>{timeAgo({ timestamp: createdOn ?? 0 })}</Typography>
              </div>
            </div>
          </div>

          <div className='flex justify-start gap-4 text-red-600 text-sm'>
            {/* Likes Tooltip */}
            <Tooltip title='Likes'>
              <div className='flex items-center gap-1'>
                <i className='ri-heart-fill' />
                <span>{likes ?? 0}</span>
              </div>
            </Tooltip>

            {/* Save Tooltip */}
            <Tooltip title='Saved'>
              <div className='flex items-center gap-1'>
                <i className='ri-archive-fill' />
                <span>{save ?? 0}</span>
              </div>
            </Tooltip>

            {/* Comments Tooltip */}
            <Tooltip title='Comments'>
              <div className='flex items-center gap-1'>
                <i className='ri-chat-follow-up-fill' />
                <span>{comments ?? 0}</span>
              </div>
            </Tooltip>
          </div>

          {/* Metrics Row 2 */}
          <div className='flex justify-between text-gray-600 text-sm'>
            {/* Price Tooltip */}
            <Tooltip title='Post Price'>
              <div className='flex items-center gap-1'>
                <i className='ri-price-tag-fill' />
                <span>{postPrice ?? 0} ₹</span>
              </div>
            </Tooltip>

            {/* Revenue Tooltip */}
            <Tooltip title='Revenue'>
              <div className='flex items-center gap-1'>
                <i className='ri-money-rupee-circle-line' />
                <span>{revenue ?? 0} ₹</span>
              </div>
            </Tooltip>
          </div>

          <CommonButton
            onClick={() =>
              onDeleteRecord({
                action: 'delete',
                id: postId,
                ...(isPostDelete ? { isBlocked: 2, isSoftDeleted: 2 } : { isBlocked: 1, isSoftDeleted: 1 })
              })
            }
            {...(!isPostDelete ? { preIcon: <i className='ri-delete-bin-line' />, color: 'error' } : {})}
            loading={actionLoader?.[`post-${postId}-delete`]}
            variant={'contained'}
          >
            {isPostDelete ? 'Click for Active Post' : 'Click for Delete Post'}
          </CommonButton>
        </div>
      </div>
    </Grid>
  )
}

export default memo(PostCard)
