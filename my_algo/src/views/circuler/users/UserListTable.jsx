'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// import Checkbox from '@mui/material/Checkbox'

// Third-party Imports '
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import { useDispatch, useSelector } from 'react-redux'
import { addUsers, setLoader } from '@/redux-store/slices/circuler/common'
import { getUsers } from '@/utils/apiController'
import CommonTable from '@/components/commonComponents/CommonTable'
import { Chip } from '@mui/material'
import { convert_date } from '@/utils/common'

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
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = ({ tableData }) => {
  const [globalFilter, setGlobalFilter] = useState('')
  const usersList = useSelector(state => state.commonReducer.userList)
  const usersListActionLoader = useSelector(state => state.commonReducer.loader.userList)
  const { recordCount, total, totalPage, data } = usersList ?? {}
  const dispatch = useDispatch()
  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState({})

  const getData = async () => {
    dispatch(setLoader({ userList: true }))
    const response = await getUsers({
      search: globalFilter,
      pageLimit: rowsPerPage,
      page: curentPage,
      ...sort
    })
    dispatch(addUsers(response?.data?.data ?? []))
    dispatch(setLoader({ userList: false }))
  }
  useEffect(() => {
    getData()
  }, [curentPage, rowsPerPage, globalFilter, sort])
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
      columnHelper.accessor('name', {
        header: 'User',
        style: { maxWidth: '20rem', width: '20rem' },
        enableSorting: true,
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row?.original?.profileImg ?? '', fullName: row?.original?.name ?? '' })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
              <Typography variant='body2'>{row.original.username}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        style: { maxWidth: '20rem', width: '20rem' },
        header: 'Contect',
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
      // columnHelper.accessor('role', {
      //   header: 'Role',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       <Icon
      //         className={classnames('text-[22px]', userRoleObj[row.original.role].icon)}
      //         sx={{ color: `var(--mui-palette-${userRoleObj[row.original.role].color}-main)` }}
      //       />
      //       <Typography className='capitalize' color='text.primary'>
      //         {row.original.role}
      //       </Typography>
      //     </div>
      //   )
      // }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: ({ row }) => (
          <div className='flex items-center gap-3 overflow-auto  w-80 scroll-type-1 pb-1'>
            {(row?.original?.category ?? []).map((c, index) => (
              <Chip variant='tonal' key={index} label={c.name} size='small' color={'primary'} className='capitalize' />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('createdOn', {
        header: 'Registered On',
        enableSorting: true,
        cell: ({ row }) => convert_date(row?.original?.createdOn)
      })
      // columnHelper.accessor('status', {
      //   header: 'Status',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-3'>
      //       <Chip
      //         variant='tonal'
      //         label={row.original.status}
      //         size='small'
      //         color={userStatusObj[row.original.status]}
      //         className='capitalize'
      //       />
      //     </div>
      //   )
      // }),
      // columnHelper.accessor('action', {
      //   header: 'Action',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-0.5'>
      //       <IconButton size='small' onClick={() => setData(data?.filter(product => product.id !== row.original.id))}>
      //         <i className='ri-delete-bin-7-line text-textSecondary' />
      //       </IconButton>
      //       <IconButton size='small'>
      //         <Link href={getLocalizedUrl('/apps/user/view', locale)} className='flex'>
      //           <i className='ri-eye-line text-textSecondary' />
      //         </Link>
      //       </IconButton>
      //       <OptionMenu
      //         iconClassName='text-textSecondary'
      //         options={[
      //           {
      //             text: 'Download',
      //             icon: 'ri-download-line'
      //           },
      //           {
      //             text: 'Edit',
      //             icon: 'ri-edit-box-line'
      //           }
      //         ]}
      //       />
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
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
        <CardHeader title='Users List' className='pbe-4' />
        {/* <TableFilters setData={setFilteredData} tableData={data} /> */}
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
              placeholder='Search User'
              className='max-sm:is-full'
            />
            {/* <Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='max-sm:is-full'>
              Add New User
            </Button> */}
          </div>
        </div>

        <CommonTable
          data={data}
          columns={columns}
          loading={usersListActionLoader}
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

export default UserListTable
