
import { useTableNumbering } from './useTableNumbering'
import type { LaravelPaginationResponse, PaginationFilters, SortState } from '../types/pagination'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'

export interface UsePaginationOptions<T>
  extends Omit<UseQueryOptions<LaravelPaginationResponse<T>>, 'queryKey' | 'queryFn'> {
  queryKey: string
  defaultPerPage?: number
  defaultSearch?: string
  defaultSort?: SortState
}

export function usePagination<T = any>(
  fetchFn: (filters: PaginationFilters) => Promise<LaravelPaginationResponse<T>>,
  options: UsePaginationOptions<T>
) {
  // State
  const currentPage = ref(1)
  const perPage = ref(options.defaultPerPage || 10)
  const search = ref(options.defaultSearch || '')
  const sortBy = ref(options.defaultSort?.column || null)
  const sortDirection = ref<'asc' | 'desc'>(options.defaultSort?.direction || 'asc')

  // Computed filters
  const filters = computed<PaginationFilters>(() => {
    const baseFilters: PaginationFilters = {
      page: currentPage.value,
      per_page: perPage.value,
      search: search.value
    }

    // Add Laravel-style sorting: sort[column]=direction
    if (sortBy.value) {
      baseFilters[`sort[${sortBy.value}]`] = sortDirection.value
    }

    return baseFilters
  })
  // Query
  const queryResult = useQuery({
    ...options,
    queryKey: [options.queryKey, filters],
    queryFn: () => fetchFn(filters.value),
    refetchOnWindowFocus: false
  })

  // Computed properties
  const tableData = computed(() => queryResult.data.value?.data || [])
  const pagination = computed(() => queryResult.data.value || null)

  // Actions
  const handlePageChange = (page: number) => {
    currentPage.value = page
  }

  const handlePerPageChange = (newPerPage: number) => {
    perPage.value = newPerPage
    currentPage.value = 1 // Reset to first page when changing per page
  }

  const handleSearchChange = (newSearch: string) => {
    search.value = newSearch
    currentPage.value = 1 // Reset to first page when searching
  }

  const handleSortChange = (column: string) => {
    if (sortBy.value === column) {
      // Toggle direction if same column
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      // New column, default to asc
      sortBy.value = column
      sortDirection.value = 'asc'
    }
    currentPage.value = 1 // Reset to first page when sorting
  }

  const setFilter = (key: string, value: any) => {
    filters.value[key] = value
    currentPage.value = 1
  }

  const removeFilter = (key: string) => {
    delete filters.value[key]
    currentPage.value = 1
  }

  const resetFilters = () => {
    currentPage.value = 1
    perPage.value = options.defaultPerPage || 10
    search.value = options.defaultSearch || ''
    sortBy.value = options.defaultSort?.column || null
    sortDirection.value = options.defaultSort?.direction || 'asc'
  }

  // Watch search with debounce
  let searchTimeout: number
  watch(search, () => {
    clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(() => {
      currentPage.value = 1
    }, 300)
  })

  const { createNumberingColumn } = useTableNumbering()

  /**
   * Creates a numbering column with current pagination context
   * @param options - Optional configuration for the column
   * @returns Column definition object
   */
  const getNumberingColumn = (options: any = {}) => {
    return createNumberingColumn(pagination, perPage, options)
  }

  return {
    // State
    currentPage,
    perPage,
    search,
    sortBy,
    sortDirection,
    filters,

    // Query result
    ...queryResult,

    // Computed
    tableData,
    pagination,

    // Actions
    handlePageChange,
    handlePerPageChange,
    handleSearchChange,
    handleSortChange,
    resetFilters,
    setFilter,
    removeFilter,

    // Helpers
    getNumberingColumn
  }
}
