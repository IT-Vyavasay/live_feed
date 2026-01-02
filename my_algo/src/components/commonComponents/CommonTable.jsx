'use client'

import React, { useEffect, useState } from 'react'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel
} from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'

const CommonTable = ({
  data = [],
  columns = [],
  loading = false,
  pageSizeOptions = [10, 25, 50],
  globalFilter = '',
  onGlobalFilterChange = () => {},
  totalRecord,
  onPageChange = () => {},
  onRowChange = () => {},
  isBackendPagination,
  onHandleSort = () => {}
}) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange
    // onSortingChange: updater => {
    //   const newSorting = typeof updater === 'function' ? updater(sorting) : updater
    //   console.log({ newSorting })
    //   setSorting(newSorting)

    //   // Optional: Call your external sort handler if needed
    //   if (newSorting.length > 0) {
    //     const { id, desc } = newSorting[0]
    //     onHandleSort({ sortBy: id, sortType: desc ? 'desc' : 'asc' })
    //   }
    // }
  })

  const [curentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    const sortingState = table.getState().sorting
    if (sortingState.length > 0) {
      const sortData = {
        orderBy: sortingState[0].id,
        order: sortingState[0].desc ? 1 : 0
      }
      console.log('Sorting changed:', sortData)
      onHandleSort(sortData)
      // Optional: Send it to API or update state
      // fetchData({ ...filters, ...sortData })
    }
  }, [table.getState().sorting])

  return (
    <div>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th key={index} style={header?.column?.columnDef?.style ?? {}}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),

                          ...(header?.column?.columnDef?.enableSorting
                            ? { 'cursor-pointer select-none': header.column.getCanSort() }
                            : {})
                        })}
                        {...(header?.column?.columnDef?.enableSorting
                          ? { onClick: header.column.getToggleSortingHandler() }
                          : {})}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='ri-arrow-up-s-line text-xl' />,
                          desc: <i className='ri-arrow-down-s-line text-xl' />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-8'>
                  <CircularProgress />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center py-4'>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ 'bg-gray-50': row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='p-2 border-b'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        rowsPerPageOptions={pageSizeOptions}
        component='div'
        {...(isBackendPagination
          ? {
              count: totalRecord,
              rowsPerPage: rowsPerPage,
              page: curentPage,
              onPageChange: (_, page) => {
                setCurrentPage(page)
                onPageChange(page)
              },
              onRowsPerPageChange: e => {
                setRowsPerPage(Number(e.target.value))
                onRowChange(Number(e.target.value))
                table.setPageSize(Number(e.target.value))
              }
            }
          : {
              count: table.getFilteredRowModel().rows.length,
              rowsPerPage: table.getState().pagination.pageSize,
              page: table.getState().pagination.pageIndex,
              onPageChange: (_, page) => table.setPageIndex(page),
              onRowsPerPageChange: e => table.setPageSize(Number(e.target.value))
            })}
      />
    </div>
  )
}

export default CommonTable
