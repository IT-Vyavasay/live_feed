import CustomAvatar from '@/@core/components/mui/Avatar'
import { Typography } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { convert_date } from '@/utils/common'

const useRevenueListColumnData = ({ selectedRevenueType, isLiveCall }) => {
  const columnHelper = createColumnHelper()

  const liveCallColumns = [
    columnHelper.accessor('totalUserJoined', {
      header: (
        <div className='flex flex-col'>
          <span>User Joined</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'>{row?.original?.totalUserJoined ?? 0}</Typography>
    }),

    columnHelper.accessor('avgDuration', {
      header: (
        <div className='flex flex-col'>
          <span>Duration</span> <span className='capitalize text-[10px]'>Avg Duration (Minute)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.avgDuration ?? 0}</Typography>
    }),

    columnHelper.accessor('totalTasks', {
      header: (
        <div className='flex flex-col'>
          <span>Avg Revenue(₹)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.avgRevenue ?? 0}</Typography>
    }),
    columnHelper.accessor('date', {
      header: (
        <div className='flex flex-col'>
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {convert_date(row?.original?.date ?? 0)}</Typography>
    })
  ]
  const audioVideoCallColumns = [
    columnHelper.accessor('user', {
      header: 'User',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar src={row?.original?.user?.profileImg} size={34} />
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row?.original?.user?.name}
            </Typography>
            <Typography variant='body2'> {row?.original?.user?.mobile}</Typography>
          </div>
        </div>
      )
    }),

    columnHelper.accessor('avgDuration', {
      header: (
        <div className='flex flex-col'>
          <span>Duration</span> <span className='capitalize text-[10px]'>Avg Duration (Minute)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.avgDuration ?? 0}</Typography>
    }),

    columnHelper.accessor('buyOnPrice', {
      header: (
        <div className='flex flex-col'>
          <span>Revenue(₹)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.buyOnPrice ?? 0}</Typography>
    }),
    columnHelper.accessor('date', {
      header: (
        <div className='flex flex-col'>
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {convert_date(row?.original?.date ?? 0)}</Typography>
    })
  ]

  const chatColumns = [
    columnHelper.accessor('user', {
      header: 'Buyer',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar src={row?.original?.profileImg} size={34} />
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row?.original?.name}
            </Typography>
          </div>
        </div>
      )
    }),

    columnHelper.accessor('totalRevenue', {
      header: (
        <div className='flex flex-col'>
          <span>Revenue(₹)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.totalRevenue ?? 0}</Typography>
    }),
    columnHelper.accessor('lastMessage', {
      header: (
        <div className='flex flex-col'>
          <span>Last Message</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {`${row?.original?.lastMessage}`.slice(0, 20)}</Typography>
    }),
    columnHelper.accessor('lastMessageTime', {
      header: (
        <div className='flex flex-col'>
          <span>Last Message Time</span>
        </div>
      ),
      cell: ({ row }) => (
        <Typography color='text.primary'> {convert_date(row?.original?.lastMessageTime ?? 0)}</Typography>
      )
    }),

    columnHelper.accessor('dateRange', {
      header: (
        <div className='flex flex-col'>
          <span>Date Range</span>
        </div>
      ),
      cell: ({ row }) => (
        <Typography color='text.primary'>
          {' '}
          {convert_date(row?.original?.dateRange?.startingDate ?? 0) -
            convert_date(row?.original?.dateRange?.endingDate ?? 0)}
        </Typography>
      )
    })
  ]
  const postColumns = [
    columnHelper.accessor('postId', {
      header: 'Post Id',
      cell: ({ row }) => <Typography variant='body2'> {row?.original?.postData?.postId}</Typography>
    }),
    columnHelper.accessor('user', {
      header: 'Buyer',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar src={row?.original?.userProfileImg} size={34} />
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row?.original?.name}
            </Typography>
          </div>
        </div>
      )
    }),

    columnHelper.accessor('totalTask', {
      header: 'Post Status',
      cell: ({ row }) => (
        <Typography color='text.primary'>{['Deleted', 'Active'][Number(row?.post?.isSoftDeleted ?? 1) - 1]}</Typography>
      )
    }),

    columnHelper.accessor('buyOnPrice', {
      header: (
        <div className='flex flex-col'>
          <span>Revenue(₹)</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'> {row?.original?.buyOnPrice ?? 0}</Typography>
    }),
    columnHelper.accessor('date', {
      header: (
        <div className='flex flex-col'>
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => (
        <Typography color='text.primary'> {convert_date(row?.original?.postData?.createdOn ?? 0)}</Typography>
      )
    })
  ]

  const walletColumns = [
    columnHelper.accessor('projectTitle', {
      header: 'Revenue Type',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <CustomAvatar src={row.original.img} size={34} />
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.projectTitle}
            </Typography>
            <Typography variant='body2'>{row.original.projectType}</Typography>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('totalTask', {
      header: (
        <div className='flex flex-col'>
          <span>Revenue($)</span> <span className='capitalize text-[10px]'>Admin / Provider / Total</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'>{row.original.totalTask}</Typography>
    }),
    columnHelper.accessor('hours', {
      header: (
        <div className='flex flex-col'>
          <span>Time(Minute)</span>{' '}
          <span className='capitalize text-[10px]'>{isLiveCall ? `Avg. attended time / Total` : ''}</span>
        </div>
      ),
      cell: ({ row }) => <Typography color='text.primary'>{row.original.totalTask}</Typography>
    })
  ]

  const getColumnData = selectedRevenueType => {
    switch (selectedRevenueType) {
      case 'Live Call':
        return liveCallColumns
      case 'Video Call':
        return audioVideoCallColumns
      case 'Voice Call':
        return audioVideoCallColumns
      case 'Chat':
        return chatColumns
      case 'Post':
        return postColumns
      case 'Wallat History':
        return walletColumns

      default:
        return liveCallColumns
    }
  }
  const columns = useMemo(
    () => getColumnData(selectedRevenueType),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRevenueType, isLiveCall]
  )
  return columns
}

export default useRevenueListColumnData
