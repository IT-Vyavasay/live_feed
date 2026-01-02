'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// THird-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { FormControl, InputLabel, MenuItem, Select, TablePagination } from '@mui/material'
import PickersRange from '@/components/form-component/DatePicker'
import useRevenueListColumnData from './useRevenuListCoumnData'
import CommonTable from '@/components/commonComponents/CommonTable'
import { useDispatch, useSelector } from 'react-redux'
import { getHistory, getProviders } from '@/utils/apiController'
import { addHistoryList, setLoader, updateProviderRevenueHistoryFilter } from '@/redux-store/slices/circuler/common'
import { useParams } from 'next/navigation'
import CommonButton from '@/components/commonComponents/CommonButton'
import { excludeKeys } from '@/utils/common'

const ProjectListTable = () => {
  // States
  const [selectedRevenueType, setSelectedRevenueType] = useState('Live Call')
  const isLiveCall = selectedRevenueType == 'Live Call'
  const params = useParams()
  const dispatch = useDispatch()
  const providerId = params?.providerId ?? null
  const columns = useRevenueListColumnData({ selectedRevenueType, isLiveCall })
  // Vars

  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sort, setSort] = useState({})

  const [dateRange, setDateRange] = useState([null, null])
  const historyList = useSelector(state => state.commonReducer.historyList)
  const filtereParams = useSelector(state => state.commonReducer.providerRevenueHistoryFilter)
  const historyListActionLoader = useSelector(state => state.commonReducer.loader.historyList)
  const setFiltereParams = params => dispatch(updateProviderRevenueHistoryFilter(params))
  const { recordCount, total, totalPage, data } = historyList ?? {}

  const getData = async () => {
    if (providerId) {
      dispatch(setLoader({ historyList: true }))
      const response = await getHistory({
        data: {
          providerId,
          pageLimit: rowsPerPage,
          page: curentPage,
          ...(['Video Call', 'Voice Call'].includes(selectedRevenueType)
            ? { isAudioCall: selectedRevenueType == 'Voice Call' ? 1 : 2 }
            : {}),
          ...sort,
          ...filtereParams
        },
        hitoryType: selectedRevenueType
      })

      dispatch(addHistoryList(response?.data?.data ?? {}))
      dispatch(setLoader({ historyList: false }))
    }
  }

  const onDateChage = value => {
    setDateRange(value)
  }

  const ApplyDateFilter = () => {
    setFiltereParams({ ...filtereParams, startDate: dateRange[0], endDate: dateRange[1] })
  }
  const ClearDateFilter = () => {
    let filterData = excludeKeys({ obj: filtereParams, keysToRemove: ['startDate', 'endDate'] })
    console.log({ filterData })
    setFiltereParams({ ...filterData })
    setDateRange([null, null])
  }
  useEffect(() => {
    if (providerId) getData()
  }, [curentPage, rowsPerPage, sort, filtereParams, selectedRevenueType])

  return (
    <Card>
      <CardHeader
        title='Revenue History'
        className='flex flex-wrap gap-4'
        action={
          <div className='flex gap-2'>
            <CommonButton onClick={ClearDateFilter} variant={'contained'}>
              Clear Filter
            </CommonButton>
            <CommonButton onClick={ApplyDateFilter} variant={'contained'}>
              Apply Filter
            </CommonButton>
            <PickersRange
              label='Time Duration'
              startDateRange={dateRange[0]}
              endDateRange={dateRange[1]}
              onChange={onDateChage}
            />
            <FormControl className='w-[14rem]'>
              <InputLabel id='role-select'>Select Revenue Type</InputLabel>
              <Select
                fullWidth
                id='select-role'
                value={selectedRevenueType}
                onChange={e => setSelectedRevenueType(e.target.value)}
                label='Select Revenue Type'
                labelId='role-select'
                inputProps={{ placeholder: 'Select Revenue Type' }}
              >
                <MenuItem value='Live Call'>Live Call</MenuItem>
                <MenuItem value='Video Call'>Video Call</MenuItem>
                <MenuItem value='Voice Call'>Voice Call</MenuItem>
                <MenuItem value='Chat'>Chat</MenuItem>
                <MenuItem value='Post'>Post</MenuItem>
              </Select>
            </FormControl>
          </div>
        }
      />

      <div className='overflow-x-auto'>
        <CommonTable
          data={data}
          columns={columns}
          loading={historyListActionLoader}
          pageSize={10}
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
      </div>
    </Card>
  )
}

export default ProjectListTable
