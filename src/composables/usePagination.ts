import { useTableNumbering } from './useTableNumbering'
import type { LaravelPaginationResponse, PaginationFilters, SortState } from '../types/pagination'
import { useQuery, keepPreviousData, type UseQueryOptions } from '@tanstack/vue-query'
import { computed, onScopeDispose, ref, watch } from 'vue'

export interface UsePaginationOptions<T>
  extends Omit<UseQueryOptions<LaravelPaginationResponse<T>>, 'queryKey' | 'queryFn'> {
  queryKey: string
  defaultPerPage?: number
  defaultSearch?: string
  defaultSort?: SortState
  debounceMs?: number
}

// Only allow alphanumeric, underscores, dots for sort column names
const VALID_SORT_COLUMN = /^[a-zA-Z0-9_.]+$/

export function usePagination<T = any>(
  fetchFn: (filters: PaginationFilters) => Promise<LaravelPaginationResponse<T>>,
  options: UsePaginationOptions<T>
) {
  // State
  const currentPage = ref(1)
  const perPage = ref(options.defaultPerPage || 10)
  const search = ref(options.defaultSearch || '')
  const debouncedSearch = ref(options.defaultSearch || '')
  const sortBy = ref<string | null>(options.defaultSort?.column || null)
  const sortDirection = ref<'asc' | 'desc'>(options.defaultSort?.direction || 'asc')
  const customFilters = ref<Record<string, any>>({})

  // Debounce search
  let searchTimeout: ReturnType<typeof setTimeout>
  watch(search, (newValue) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      debouncedSearch.value = newValue
      currentPage.value = 1
    }, options.debounceMs ?? 300)
  })
  onScopeDispose(() => clearTimeout(searchTimeout))

  // Computed filters
  const filters = computed<PaginationFilters>(() => {
    const baseFilters: PaginationFilters = {
      page: currentPage.value,
      per_page: perPage.value,
      search: debouncedSearch.value,
      ...customFilters.value
    }

    if (sortBy.value && VALID_SORT_COLUMN.test(sortBy.value)) {
      baseFilters[`sort[${sortBy.value}]`] = sortDirection.value
    }

    return baseFilters
  })

  // Query
  const queryResult = useQuery({
    ...options,
    queryKey: [options.queryKey, filters],
    queryFn: () => fetchFn(filters.value),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false
  })

  // Computed properties
  const tableData = computed(() => queryResult.data.value?.data || [])
  const pagination = computed(() => queryResult.data.value || null)

  // Actions
  const handlePageChange = (page: number) => {
    const lastPage = pagination.value?.meta?.last_page ?? Infinity
    currentPage.value = Math.min(Math.max(1, Math.floor(page)), lastPage)
  }

  const handlePerPageChange = (newPerPage: number) => {
    perPage.value = Math.max(1, Math.floor(newPerPage))
    currentPage.value = 1
  }

  const handleSearchChange = (newSearch: string) => {
    search.value = newSearch
  }

  const handleSortChange = (column: string) => {
    if (!VALID_SORT_COLUMN.test(column)) return

    if (sortBy.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = column
      sortDirection.value = 'asc'
    }
    currentPage.value = 1
  }

  const setFilter = (key: string, value: any) => {
    customFilters.value = { ...customFilters.value, [key]: value }
    currentPage.value = 1
  }

  const removeFilter = (key: string) => {
    const { [key]: _, ...rest } = customFilters.value
    customFilters.value = rest
    currentPage.value = 1
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    customFilters.value = { ...newFilters }
    currentPage.value = 1
  }

  const resetFilters = () => {
    currentPage.value = 1
    perPage.value = options.defaultPerPage || 10
    search.value = options.defaultSearch || ''
    debouncedSearch.value = options.defaultSearch || ''
    sortBy.value = options.defaultSort?.column || null
    sortDirection.value = options.defaultSort?.direction || 'asc'
    customFilters.value = {}
  }

  const { createNumberingColumn } = useTableNumbering()

  const getNumberingColumn = (columnOptions: any = {}) => {
    return createNumberingColumn(pagination, perPage, columnOptions)
  }

  return {
    // State
    currentPage,
    perPage,
    currentPerPage: perPage,
    search,
    sortBy,
    sortDirection,
    filters,
    customFilters,

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
    handleFilterChange,
    resetFilters,
    setFilter,
    removeFilter,

    // Helpers
    getNumberingColumn
  }
}
