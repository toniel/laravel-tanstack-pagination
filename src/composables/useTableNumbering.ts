
import type { LaravelPaginationResponse } from '../types/pagination'
import { h, type ComputedRef, type Ref } from 'vue'

interface NumberingOptions {
  header?: string
  className?: string
  width?: string
  enableSorting?: boolean
}

export function useTableNumbering() {
  /**
   * Creates a numbering column for data tables with Laravel pagination
   * @param pagination - Reactive Laravel pagination object
   * @param perPage - Reactive per page value
   * @param options - Optional configuration for the column
   * @returns Column definition object
   */
  const createNumberingColumn = <T = any>(
    pagination: Ref<LaravelPaginationResponse<T> | null> | ComputedRef<LaravelPaginationResponse<T> | null>,
    perPage: Ref<number>,
    options: NumberingOptions = {}
  ) => {
    const {
      header = 'No.',
      className = 'text-center text-ubd-ocean-700 dark:text-ubd-ocean-200 font-medium',
      width = '60px',
      enableSorting = false
    } = options

    return {
      accessorKey: 'no',
      header,
      enableSorting,
      meta: {
        style: { width }
      },
      cell: ({ row }: any) => {
        const currentPage = pagination.value?.meta?.current_page || 1
        const perPageValue = perPage.value || 10
        const rowIndex = row.index
        const sequentialNumber = (currentPage - 1) * perPageValue + rowIndex + 1

        return h('span', { class: className }, sequentialNumber.toString())
      }
    }
  }

  /**
   * Calculates the sequential number for a specific row
   * @param rowIndex - Index of the row (0-based)
   * @param currentPage - Current page number
   * @param perPageValue - Number of items per page
   * @returns Sequential number
   */
  const calculateSequentialNumber = (rowIndex: number, currentPage: number, perPageValue: number): number => {
    return (currentPage - 1) * perPageValue + rowIndex + 1
  }

  /**
   * Gets the starting number for the current page
   * @param currentPage - Current page number
   * @param perPageValue - Number of items per page
   * @returns Starting number for the page
   */
  const getPageStartNumber = (currentPage: number, perPageValue: number): number => {
    return (currentPage - 1) * perPageValue + 1
  }

  /**
   * Gets the ending number for the current page based on Laravel pagination
   * @param pagination - Laravel pagination response
   * @returns Ending number for the page
   */
  const getPageEndNumber = <T = any>(pagination: LaravelPaginationResponse<T>): number => {
    return pagination.meta.from + pagination.data.length - 1
  }

  /**
   * Gets pagination info text like "Showing 1 to 10 of 50 results"
   * @param pagination - Laravel pagination response
   * @returns Formatted pagination info string
   */
  const getPaginationInfo = <T = any>(pagination: LaravelPaginationResponse<T>): string => {
    if (!pagination.data.length) {
      return 'No results found'
    }

    const { from, to, total } = pagination.meta
    return `Showing ${from} to ${to} of ${total} results`
  }

  /**
   * Checks if a specific page has results
   * @param pagination - Laravel pagination response
   * @param page - Page number to check
   * @returns Boolean indicating if page has results
   */
  const hasPage = <T = any>(pagination: LaravelPaginationResponse<T>, page: number): boolean => {
    return page >= 1 && page <= pagination.meta.last_page
  }

  /**
   * Gets the range of page numbers to display in pagination
   * @param pagination - Laravel pagination response
   * @param maxPages - Maximum number of page buttons to show
   * @returns Array of page numbers
   */
  const getPageRange = <T = any>(pagination: LaravelPaginationResponse<T>, maxPages: number = 5): number[] => {
    const { current_page, last_page } = pagination.meta
    const pages: number[] = []

    let start = Math.max(1, current_page - Math.floor(maxPages / 2))
    const end = Math.min(last_page, start + maxPages - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return {
    createNumberingColumn,
    calculateSequentialNumber,
    getPageStartNumber,
    getPageEndNumber,
    getPaginationInfo,
    hasPage,
    getPageRange
  }
}
