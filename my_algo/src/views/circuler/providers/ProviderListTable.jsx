'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
// Third-party Imports
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import TableFilters from './TableFilters'
import AddProviderDrawer from './AddProviderDrawer'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import CommonSwitch from '@/@core/components/mui/CommonSwitch'
import StatusToggleButton from './StatusToggleButton'
import { deleteAccount, getCategory, getProviders, updateRoleData } from '@/utils/apiController'
import { addCategory, addProviders, setLoader, updateProviders } from '@/redux-store/slices/circuler/common'
import { useDispatch, useSelector } from 'react-redux'
import CommonTable from '@/components/commonComponents/CommonTable'
import { value } from 'valibot'
import useReplaceReduxRecord from '@/hooks/useReplaceReduxRecord'
import { getPrioritizedStatus, userStatusObj } from '@/utils/common'
import CommonButton from '@/components/commonComponents/CommonButton'

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const ProviderListTable = () => {
  // States
  const replaceProvider = useReplaceReduxRecord({
    despatchFun: modifiedData => dispatch(updateProviders(modifiedData))
  })
  const deleteProvider = useReplaceReduxRecord({
    despatchFun: modifiedData => dispatch(updateProviders(modifiedData)),
    action: 'delete'
  })
  const [filtereParams, setFiltereParams] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const providersList = useSelector(state => state.commonReducer.providersList)
  const providersListActionLoader = useSelector(state => state.commonReducer.loader.providersList)
  const actionLoader = useSelector(state => state.commonReducer.loader)
  const categoryList = useSelector(state => state.commonReducer.categoryList)
  // const categoryListActionLoader = useSelector(state => state.commonReducer.loader.categoryList)
  const { recordCount, total, totalPage, data } = providersList ?? {}
  const dispatch = useDispatch()
  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState({})
  const [addUpdateOpen, setAddUpdateOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)

  const categoryOption = useMemo(() => {
    return categoryList.map(c => ({ label: c.name, id: c.categoryId }))
  }, [categoryList])

  const getData = async () => {
    dispatch(setLoader({ providersList: true }))
    const response = await getProviders({
      search: globalFilter,
      pageLimit: rowsPerPage,
      page: curentPage,
      ...sort,
      ...filtereParams
    })

    dispatch(addProviders(response?.data?.data ?? {}))
    dispatch(setLoader({ providersList: false }))
  }

  const getCategoryData = async () => {
    dispatch(setLoader({ categoryList: true }))
    const response = await getCategory()
    dispatch(addCategory(response?.data?.data ?? []))
    dispatch(setLoader({ categoryList: false }))
  }

  const onUpdateRecord = async data => {
    const { field, value, errorMessage, successMessage, id } = data
    dispatch(setLoader({ [`provider-${id}-${field}`]: true }))
    const response = await updateRoleData({
      userId: id,
      role: 2,
      [field]: value,
      errorMessage,
      successMessage
    })
    if (response?.data?.isSuccess) {
      const responseData = response?.data?.data
      replaceProvider({
        pathArray: ['commonReducer', 'providersList', 'data'],
        uniqueKey: 'id',
        uniqueValue: id,
        newRecord: { [field]: responseData[field] },
        recordListKey: 'providersList'
      })
    }
    dispatch(setLoader({ [`provider-${id}-${field}`]: false }))
  }

  const onDeleteRecord = async data => {
    const { action, id } = data
    dispatch(setLoader({ [`provider-${id}-${action}`]: true }))
    const response = await deleteAccount({
      user_id: id,
      userRole: 2
    })
    if (response?.data?.isSuccess) {
      deleteProvider({
        pathArray: ['commonReducer', 'providersList', 'data'],
        uniqueKey: 'id',
        uniqueValue: id,
        recordListKey: 'providersList'
      })
    }
    dispatch(setLoader({ [`provider-${id}-${action}`]: false }))
  }

  const onAddUpdatedRecord = data => {
    setSelectedProvider(data)
    setAddUpdateOpen(true)
  }

  useEffect(() => {
    getData()
  }, [curentPage, rowsPerPage, globalFilter, sort, filtereParams])

  useEffect(() => {
    if (categoryList?.length == 0) {
      getCategoryData()
    }
  }, [])

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
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
      columnHelper.accessor('userName', {
        header: 'Provider Name',
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row.original.profileImg, fullName: row.original?.name ?? 'U' })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
              <Typography variant='body2'>{row.original.userName}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Contect Detail',
        cell: ({ row }) => {
          return (
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.email}
              </Typography>
              <Typography variant='body2'> {row.original.mobile}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => (
          <div className='flex items-center gap-3 overflow-auto  w-80 scroll-type-1 pb-1'>
            {(row?.original?.category ?? []).map((c, index) => (
              <Chip key={index} variant='tonal' label={c.name} size='small' color={'primary'} className='capitalize' />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('isCall', {
        header: 'Call',
        cell: ({ row }) => {
          const isCall = row?.original?.isCall == 1
          const id = parseInt(row?.original?.id)
          const isLoading = actionLoader[`provider-${id}-isCall`]
          return (
            <CommonSwitch
              checked={isCall ? true : false}
              size='medium'
              loading={isLoading}
              onChange={() =>
                onUpdateRecord({
                  field: 'isCall',
                  value: isCall ? 2 : 1,
                  id,
                  successMessage: `Provider call access ${isCall ? 'denied' : 'approved'} successfully.`,
                  errorMessage: `Failed to ${isCall ? 'deny' : 'approve'} provider call access. Please try again.`
                })
              }
            />
          )
        }
      }),
      columnHelper.accessor('isChat', {
        header: 'Chat',
        cell: ({ row }) => {
          const isChat = row?.original?.isChat == 1
          const id = parseInt(row?.original?.id)
          const isLoading = actionLoader[`provider-${id}-isChat`]
          return (
            <CommonSwitch
              checked={isChat ? true : false}
              size='medium'
              loading={isLoading}
              onChange={() =>
                onUpdateRecord({
                  field: 'isChat',
                  value: isChat ? 2 : 1,
                  id,
                  successMessage: `Provider chat access ${isChat ? 'denied' : 'approved'} successfully.`,
                  errorMessage: `Failed to ${isChat ? 'deny' : 'approve'} provider chat access. Please try again.`
                })
              }
            />
          )
        }
      }),
      columnHelper.accessor('avatarColor', {
        header: 'Live',
        cell: ({ row }) => {
          const isLive = row?.original?.isLive
          return (
            <div className='flex items-center gap-3'>
              <Chip
                variant='tonal'
                label={isLive ? 'Live' : 'Offline'}
                size='small'
                color={isLive ? 'success' : 'error'}
                className='capitalize'
              />
            </div>
          )
        }
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const statusKey = getPrioritizedStatus({
            isVerify: row.original.isVerify,
            isSoftDeleted: row.original.isSoftDeleted,
            isBlocked: row.original.isBlocked,
            isApproved: row.original.isApproved
          })

          const status = userStatusObj[statusKey]

          return (
            <div className='flex items-center gap-3'>
              <Chip variant='tonal' label={status.label} size='small' color={status.color} className='capitalize' />
            </div>
          )
        }
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => {
          const dt = {
            isVerify: row.original.isVerify,
            isSoftDeleted: row.original.isSoftDeleted,
            isBlocked: row.original.isBlocked,
            isApproved: row.original.isApproved
          }
          const statusKey = getPrioritizedStatus({
            isVerify: row.original.isVerify,
            isSoftDeleted: row.original.isSoftDeleted,
            isBlocked: row.original.isBlocked,
            isApproved: row.original.isApproved
          })

          const id = parseInt(row?.original?.id)
          return (
            <div className='flex items-center gap-0.5'>
              <div style={{ width: '112px' }}>
                {' '}
                <StatusToggleButton
                  currentStatus={statusKey}
                  onClick={data => onUpdateRecord(data)}
                  id={id}
                  actionLoader={actionLoader}
                />
              </div>

              <CommonButton
                onClick={() => onDeleteRecord({ ...row.original, action: 'delete' })}
                preIcon={<i className='ri-delete-bin-7-line text-textSecondary' />}
                onlyIcon={true}
                loading={actionLoader[`provider-${row.original.id}-delete`]}
              />

              <IconButton size='small'>
                <Link href={getLocalizedUrl(`/providers/${row.original.id}`, locale)} className='flex'>
                  <i className='ri-eye-line text-textSecondary' />
                </Link>
              </IconButton>
              <IconButton size='small' onClick={() => onAddUpdatedRecord(row.original)}>
                <i className='ri-edit-line text-textSecondary' />
              </IconButton>
            </div>
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
        <CardHeader title='Provider List' className='pbe-4' />
        <TableFilters setFiltereParams={setFiltereParams} tableData={data} categoryOption={categoryOption} />
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          {/* <Button
            color='secondary'
            variant='outlined'
            startIcon={<i className='ri-upload-2-line' />}
            className='max-sm:is-full'
          >
            Export
          </Button> */}
          <div className='flex items-center gap-x-4 max-sm:gap-y-4 flex-col max-sm:is-full sm:flex-row'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Provider'
              className='max-sm:is-full'
            />
            <Button variant='contained' onClick={() => setAddUpdateOpen(true)} className='max-sm:is-full'>
              Add New Provider
            </Button>
          </div>
        </div>
        <CommonTable
          data={data}
          columns={columns}
          loading={providersListActionLoader}
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
      <AddProviderDrawer
        open={addUpdateOpen}
        handleClose={() => {
          setAddUpdateOpen(!addUpdateOpen), setSelectedProvider(null)
        }}
        categoryOption={categoryOption}
        data={selectedProvider}
        onSuccessAction={getData}
      />
    </>
  )
}

export default ProviderListTable
