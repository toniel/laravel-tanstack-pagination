export type LaravelPaginationResponse<T = any> = {
  data: T[]
  links: Array<{
    first: string | null
    last: string | null
    next: string | null
    prev: string | null
  }>
  meta: {
    current_page: number
    from: number
    last_page: number
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface PaginationFilters {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  [key: string]: any
}

export interface SortState {
  column: string | null
  direction: 'asc' | 'desc'
}
