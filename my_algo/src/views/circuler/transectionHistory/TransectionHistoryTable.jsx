'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
// Third-party Imports
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import { getTransectionHistory } from '@/utils/apiController'
import { addTransectionHistory, setLoader } from '@/redux-store/slices/circuler/common'
import { useDispatch, useSelector } from 'react-redux'
import CommonTable from '@/components/commonComponents/CommonTable'
import { convert_date } from '@/utils/common'

// Column Definitions
const columnHelper = createColumnHelper()

const TransectionHistoryTable = () => {
  // States

  const [filtereParams, setFiltereParams] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const TransectionHistory = useSelector(state => state.commonReducer.transectionHistory)
  const TransectionHistoryActionLoader = useSelector(state => state.commonReducer.loader.transectionHistory)
  const actionLoader = useSelector(state => state.commonReducer.loader)
  // const categoryListActionLoader = useSelector(state => state.commonReducer.loader.categoryList)
  const { recordCount, total, totalPage, data } = TransectionHistory ?? {}
  const dispatch = useDispatch()
  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState({})

  const categoryOption = [
    { label: 'Live Call', id: 'liveCall' },
    { label: 'Video Call', id: 'videoCall' },
    { label: 'Audio Call', id: 'audioCall' },
    { label: 'Chat', id: 'chat' },
    { label: 'Post', id: 'post' }
  ]

  const getData = async () => {
    dispatch(setLoader({ transectionHistory: true }))
    const response = await getTransectionHistory({
      search: globalFilter,
      pageLimit: rowsPerPage,
      page: curentPage,
      ...sort,
      ...filtereParams
    })

    dispatch(addTransectionHistory(response?.data?.data ?? {}))
    dispatch(setLoader({ transectionHistory: false }))
  }

  useEffect(() => {
    getData()
  }, [curentPage, rowsPerPage, globalFilter, sort, filtereParams])

  const columns = useMemo(
    () => [
      columnHelper.accessor('index', {
        header: 'Index',
        style: { maxWidth: '10rem', width: '10rem', textAlign: 'center' },
        enableSorting: true,
        cell: ({ row }) => (
          <Typography variant='body2' textAlign={'center'}>
            {row.original.index}
          </Typography>
        )
      }),
      columnHelper.accessor('type', {
        header: 'Transection Type',
        style: { maxWidth: '10rem', width: '10rem', textAlign: 'center' },
        enableSorting: true,
        cell: ({ row }) => (
          <Typography variant='body2' textAlign={'center'}>
            {row.original.type}
          </Typography>
        )
      }),

      columnHelper.accessor('user', {
        header: 'User',
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row?.original?.user?.profileImg, fullName: row?.original?.user?.name ?? 'U' })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.user?.name ?? '-'}
              </Typography>
              <Typography variant='body2'>{row?.original?.user?.mobile}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('provider', {
        header: 'Provider',
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row?.original?.provider?.profileImg, fullName: row?.original?.provider?.name ?? 'P' })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.provider?.name ?? '-'}
              </Typography>
              <Typography variant='body2'>{row?.original?.provider?.mobile ?? '-'}</Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('buyOnPrice', {
        style: { maxWidth: '18rem', width: '18rem', textAlign: 'center' },
        header: (
          <div className='flex flex-col'>
            <div color='text.primary' className='font-medium'>
              Transection Value
            </div>
            <Typography variant='body2'>Admin share | Provider share</Typography>
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.buyOnPrice ?? 0}
              </Typography>
              <Typography variant='body2'>{`${row?.original?.adminRevenue ?? 0} | ${row?.original?.providerRevenue ?? 0}`}</Typography>
            </div>
          )
        }
      }),

      columnHelper.accessor('createdOn', {
        header: 'Transection at',
        style: { maxWidth: '10rem', width: '10rem', textAlign: 'center' },
        enableSorting: true,
        cell: ({ row }) => (
          <Typography variant='body2' textAlign={'center'}>
            {convert_date(row?.original?.createdOn ?? 0)}
          </Typography>
        )
      })
    ],
    [data, actionLoader]
  )

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(fullName)}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Transaction List' className='pbe-4' />
        <TableFilters setFiltereParams={setFiltereParams} tableData={data} categoryOption={categoryOption} />
        <Divider />
        <CommonTable
          data={data}
          columns={columns}
          loading={TransectionHistoryActionLoader}
          pageSize={10}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          recordCount={recordCount}
          totalRecord={total}
          totalPage={totalPage}
          pageLimit={10}
          onPageChange={page => setCurrentPage(page)}
          onRowChange={limit => {
            setRowsPerPage(limit)
            setCurrentPage(0)
          }}
          isBackendPagination={true}
          onHandleSort={sort => setSort(sort)}
        />
      </Card>
    </>
  )
}

export default TransectionHistoryTable
