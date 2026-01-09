# Laravel TanStack Pagination

Vue 3 composables untuk Laravel pagination dengan TanStack Query.

## Installation

```bash
npm install @toniel/laravel-tanstack-pagination
```

## Usage

```typescript
import { usePagination } from '@toniel/laravel-tanstack-pagination'

const {
  tableData,
  pagination,
  handlePageChange,
  handleSearchChange
} = usePagination(
  (filters) => axios.get('/api/users', { params: filters }),
  {
    queryKey: 'users',
    defaultPerPage: 10
  }
)
```

## Features

- ✅ Laravel pagination support
- ✅ TanStack Query integration
- ✅ Search with debounce
- ✅ Sorting
- ✅ Table numbering helper
- ✅ TypeScript support

## API

### `usePagination(fetchFn, options)`

Main composable for handling Laravel pagination.

**Parameters:**
- `fetchFn`: Function that fetches data from Laravel API
- `options`: Configuration options
  - `queryKey`: Unique key for the query
  - `defaultPerPage`: Items per page (default: 10)

**Returns:**
- `tableData`: Computed array of data items
- `pagination`: Reactive pagination state
- `handlePageChange`: Function to change page
- `handleSearchChange`: Function to handle search input
- `handleSortChange`: Function to handle sorting
- `isLoading`: Loading state
- `error`: Error state

### `useTableNumbering(currentPage, perPage)`

Helper composable for table row numbering.

**Parameters:**
- `currentPage`: Current page number
- `perPage`: Items per page

**Returns:**
- `getRowNumber(index)`: Function to get row number for index

## License

MIT
