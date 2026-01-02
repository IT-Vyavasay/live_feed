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
import { acceptWithdrawRequest, getWithdrawRequests } from '@/utils/apiController'
import { addWithdrawRequests, setLoader, updateWithdrawRequests } from '@/redux-store/slices/circuler/common'
import { useDispatch, useSelector } from 'react-redux'
import CommonTable from '@/components/commonComponents/CommonTable'
import { Box, Button, Chip } from '@mui/material'
import { convert_date } from '@/utils/common'
import CommonButton from '@/components/commonComponents/CommonButton'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import CommonDialog from '@/components/commonComponents/CommonDialog'
import useReplaceReduxRecord from '@/hooks/useReplaceReduxRecord'

// Column Definitions
const columnHelper = createColumnHelper()

const WithdrawRequestTable = () => {
  //hooks
  const dispatch = useDispatch()
  const replaceProvider = useReplaceReduxRecord({
    despatchFun: modifiedData => dispatch(updateWithdrawRequests(modifiedData))
  })
  // States

  const [filtereParams, setFiltereParams] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const WithdrawRequests = useSelector(state => state.commonReducer.withdrawRequests)
  const WithdrawRequestsActionLoader = useSelector(state => state.commonReducer.loader.withdrawRequests)
  const actionLoader = useSelector(state => state.commonReducer.loader)
  // const categoryListActionLoader = useSelector(state => state.commonReducer.loader.categoryList)
  const { recordCount, total, totalPage, data } = WithdrawRequests ?? {}

  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState({})

  const categoryOption = [
    { label: 'Panding', id: 2 },
    { label: 'Accepted', id: 1 }
  ]

  const statusObj = {
    2: { color: 'error', label: 'Pending' },
    1: { color: 'success', label: 'Accepted' }
  }

  const getData = async () => {
    dispatch(setLoader({ withdrawRequests: true }))
    const response = await getWithdrawRequests({
      search: globalFilter,
      pageLimit: rowsPerPage,
      page: curentPage,
      ...sort,
      ...filtereParams
    })

    dispatch(addWithdrawRequests(response?.data?.data ?? {}))
    dispatch(setLoader({ withdrawRequests: false }))
  }

  const onWithdrawRequestAccept = async data => {
    const { id } = data
    dispatch(setLoader({ [`provider-${id}-withdrawRequest`]: true }))
    const response = await acceptWithdrawRequest({
      withdrawRequestId: id
    })
    if (response?.data?.isSuccess) {
      const responseData = response?.data?.data
      const { withdrawRequestId, requestAccepted } = responseData ?? {}
      replaceProvider({
        pathArray: ['commonReducer', 'withdrawRequests', 'data'],
        uniqueKey: 'withDrawrequestId',
        uniqueValue: withdrawRequestId,
        newRecord: { status: requestAccepted },
        recordListKey: 'withdrawRequests'
      })
    }
    dispatch(setLoader({ [`provider-${id}-withdrawRequest`]: false }))
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

      columnHelper.accessor('provider', {
        header: 'Provider',
        // enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row?.original?.provider?.profileImg, fullName: row?.original?.provider?.name ?? 'U' })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.provider?.name ?? '-'}
              </Typography>
              <Typography variant='body2'>{row?.original?.provider?.mobile}</Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.amount ?? 0}
              </Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = statusObj[row?.original?.status]
          return (
            <div className='flex items-center gap-3'>
              <Chip variant='tonal' label={status.label} size='small' color={status.color} className='capitalize' />
            </div>
          )
        }
      }),

      columnHelper.accessor('createdOn', {
        header: 'Requested at',

        style: { maxWidth: '15rem', width: '15rem', textAlign: 'center' },
        // enableSorting: true,
        cell: ({ row }) => (
          <Typography variant='body2' textAlign={'center'}>
            {convert_date(row.original.createdOn ?? 0)}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        style: { width: '10rem' },
        cell: ({ row }) => {
          const notAccepted = row?.original?.status == 2
          return (
            <>
              {notAccepted ? (
                <div className='flex items-center gap-0.5'>
                  <CommonButton
                    onClick={() => onWithdrawRequestAccept({ id: row.original.withDrawrequestId })}
                    loading={actionLoader[`provider-${row.original.withDrawrequestId}-withdrawRequest`]}
                  >
                    Acccept
                  </CommonButton>
                </div>
              ) : null}
            </>
          )
        },
        enableSorting: false
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
        <CardHeader title='Withdraw Requests List' className='pbe-4' />
        <TableFilters setFiltereParams={setFiltereParams} tableData={data} categoryOption={categoryOption} />
        <Divider />
        <CommonTable
          data={data}
          columns={columns}
          loading={WithdrawRequestsActionLoader}
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

export default WithdrawRequestTable
