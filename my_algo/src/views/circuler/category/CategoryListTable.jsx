'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
import { createColumnHelper } from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import AddCategoryDrawer from './AddCategoryDrawer'
import { getCategory, manageCategory } from '@/utils/apiController'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, setLoader } from '@/redux-store/slices/circuler/common'
import { isValidUrl } from '@/utils/common'
import { DebouncedInput } from '@/components/commonComponents/DebouncedInput'
import CommonDialog from '@/components/commonComponents/CommonDialog'
import { DeleteForever } from '@mui/icons-material'
import CommonTable from '@/components/commonComponents/CommonTable'

// Column Definitions
const columnHelper = createColumnHelper()

const DeleteDialogContent = ({ categoryName = '' }) => {
  return (
    <div className='text-center px-4 py-2'>
      <p className='text-md font-semibold text-red-600 mb-2'>
        Are you sure you want to delete the category <span className='font-bold'>"{categoryName}"</span>?
      </p>
      <p className='text-sm text-gray-500'>
        You cannot access this category ID as it belongs to another user or workspace.
      </p>
    </div>
  )
}

const CategoryListTable = () => {
  const [addUpdateOpen, setAddUpdateOpen] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categoryList = useSelector(state => state.commonReducer.categoryList)
  const deleteActionLoader = useSelector(state => state.commonReducer.loader.deleteCategory)
  const categoryListActionLoader = useSelector(state => state.commonReducer.loader.categoryList)
  const dispatch = useDispatch()

  const getCategoryData = async () => {
    dispatch(setLoader({ categoryList: true }))
    const response = await getCategory()
    dispatch(addCategory(response?.data?.data ?? []))
    dispatch(setLoader({ categoryList: false }))
  }

  const onAddUpdatedRecord = data => {
    setSelectedCategory(data)
    setAddUpdateOpen(true)
  }

  const onDeleteRecord = data => {
    setSelectedCategory(data)
    setOpenDialog(true)
  }

  const handleDeleteRecord = async () => {
    dispatch(setLoader({ deleteCategory: true }))
    await manageCategory({
      data: JSON.stringify({
        categoryId: selectedCategory.categoryId,
        isDelete: 1
      }),
      successMessage: { text: 'Category deleted successfully', type: 'error' },
      successAction: getCategoryData
    })
    setOpenDialog(false)
    setSelectedCategory(null)
    dispatch(setLoader({ deleteCategory: false }))
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Category',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getLogo({ avatar: row.original.image, fullName: row.original.name })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        style: { width: '10rem' },
        cell: ({ row }) => (
          <div className='flex items-center gap-0.5'>
            <IconButton size='small' onClick={() => onDeleteRecord(row.original)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => onAddUpdatedRecord(row.original)}>
              <i className='ri-edit-line text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [categoryList]
  )

  const getLogo = params => {
    const { avatar, fullName } = params

    if (isValidUrl(avatar)) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {avatar}
        </CustomAvatar>
      )
    }
  }

  useEffect(() => {
    getCategoryData()
  }, [])

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <Divider />
        <div className='flex justify-between gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Category'
            className='max-sm:is-full'
          />
          <Button variant='contained' onClick={onAddUpdatedRecord} className='max-sm:is-full'>
            Add New Category
          </Button>
        </div>
        <CommonTable
          data={categoryList}
          columns={columns}
          loading={categoryListActionLoader}
          pageSize={10}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
        />
      </Card>
      <AddCategoryDrawer
        open={addUpdateOpen}
        handleClose={() => {
          setAddUpdateOpen(!addUpdateOpen), setSelectedCategory(null)
        }}
        data={selectedCategory}
        onSuccessAction={getCategoryData}
      />
      <CommonDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false), setSelectedCategory(null)
        }}
        title='Delete Category'
        size='xs'
        content={<DeleteDialogContent categoryName={selectedCategory?.name} deleteActionLoader={deleteActionLoader} />}
        actionFunction={handleDeleteRecord}
        actionName={'Delete'}
        actionIcon={<DeleteForever />}
        actionLoader={deleteActionLoader}
        actionButtonColor={'error'}
      />
    </>
  )
}

export default CategoryListTable
