# Laravel TanStack Pagination

[![npm version](https://img.shields.io/npm/v/@toniel/laravel-tanstack-pagination)](https://www.npmjs.com/package/@toniel/laravel-tanstack-pagination)
[![npm downloads](https://img.shields.io/npm/dm/@toniel/laravel-tanstack-pagination)](https://www.npmjs.com/package/@toniel/laravel-tanstack-pagination)
[![GitHub](https://img.shields.io/github/license/toniel/laravel-tanstack-pagination)](https://github.com/toniel/laravel-tanstack-pagination/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/toniel/laravel-tanstack-pagination)](https://github.com/toniel/laravel-tanstack-pagination)

Vue 3 composables untuk Laravel pagination dengan TanStack Query - **Headless & Framework Agnostic**.

> 💡 **Looking for ready-to-use UI components?** Check out [`@toniel/laravel-tanstack-datatable`](https://github.com/toniel/laravel-tanstack-datatable) - Pre-built DataTable components with this library.

## 📦 Installation

```bash
npm install @toniel/laravel-tanstack-pagination
# or
yarn add @toniel/laravel-tanstack-pagination
# or
pnpm add @toniel/laravel-tanstack-pagination
# or
bun add @toniel/laravel-tanstack-pagination
```

### Peer Dependencies

```bash
npm install vue @tanstack/vue-query
```

## 🚀 Quick Start

```typescript
import { usePagination } from '@toniel/laravel-tanstack-pagination'
import axios from 'axios'

const {
  tableData,
  pagination,
  search,
  currentPerPage,
  sortBy,
  sortDirection,
  isLoading,
  error,
  handlePageChange,
  handlePerPageChange,
  handleSearchChange,
  handleSortChange,
} = usePagination(
  (filters) => axios.get('/api/users', { params: filters }),
  {
    queryKey: 'users',
    defaultPerPage: 10
  }
)
```

## ✨ Features

- ✅ **Headless** - Bring your own UI components
- ✅ **Laravel pagination** support out of the box
- ✅ **TanStack Query** integration for caching & refetching
- ✅ **Search** with automatic debounce
- ✅ **Sorting** (server-side)
- ✅ **Filtering** with flexible API
- ✅ **Table numbering** helper for sequential row numbers
- ✅ **TypeScript** fully typed
- ✅ **Framework agnostic** - Works with any UI library

## 📖 API Reference

### `usePagination(fetchFn, options)`

Main composable for handling Laravel pagination.

**Parameters:**
- `fetchFn`: `(filters: PaginationFilters) => Promise<LaravelPaginationResponse<T>>`
  - Function that fetches data from Laravel API
- `options`: `UsePaginationOptions<T>`
  - `queryKey`: `string` - Unique key for the query (required)
  - `defaultPerPage`: `number` - Items per page (default: `10`)
  - `defaultSearch`: `string` - Default search query (default: `''`)
  - `defaultSort`: `SortState` - Default sort state (default: `null`)
  - ...all other TanStack Query options

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `tableData` | `Ref<T[]>` | Computed array of data items |
| `pagination` | `Ref<LaravelPaginationResponse \| null>` | Full Laravel pagination response |
| `currentPage` | `Ref<number>` | Current page number |
| `perPage` | `Ref<number>` | Items per page |
| `search` | `Ref<string>` | Current search query |
| `sortBy` | `Ref<string \| null>` | Current sort column |
| `sortDirection` | `Ref<'asc' \| 'desc'>` | Sort direction |
| `filters` | `ComputedRef<PaginationFilters>` | All active filters (including custom filters) |
| `customFilters` | `Ref<Record<string, any>>` | Custom filter state (for external use) |
| `isLoading` | `Ref<boolean>` | Loading state from TanStack Query |
| `error` | `Ref<Error \| null>` | Error state from TanStack Query |
| `handlePageChange` | `(page: number) => void` | Change page handler |
| `handlePerPageChange` | `(perPage: number) => void` | Change per page handler |
| `handleSearchChange` | `(search: string) => void` | Search change handler (debounced) |
| `handleSortChange` | `(column: string) => void` | Toggle sort on column |
| `handleFilterChange` | `(filters: Record<string, any>) => void` | Bulk update custom filters |
| `setFilter` | `(key: string, value: any) => void` | Add custom filter |
| `removeFilter` | `(key: string) => void` | Remove custom filter |
| `resetFilters` | `() => void` | Reset all filters to defaults |
| `getNumberingColumn` | `(options?) => ColumnDef` | Get numbering column for TanStack Table |
| `refetch` | TanStack Query refetch function |
| `...queryResult` | All other TanStack Query return values |

### `useTableNumbering()`

Helper composable for creating table row numbering columns.

**Returns:**
- `createNumberingColumn(pagination, perPage, options?)`: Function to create a numbering column definition for TanStack Table

**Example:**
```ts
const { createNumberingColumn } = useTableNumbering()

const numberingColumn = createNumberingColumn(
  pagination, // ref from usePagination
  perPage,    // ref from usePagination
  {
    header: '#',
    enableSorting: false
  }
)
```

## 🔗 TypeScript Types

```typescript
// Laravel Pagination Response
type LaravelPaginationResponse<T = any> = {
  data: T[]
  links: {
    first: string | null
    last: string | null
    next: string | null
    prev: string | null
  }[]
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

// Pagination Filters
interface PaginationFilters {
  page?: number
  per_page?: number
  search?: string
  [key: string]: any // Custom filters
}

// Sort State
interface SortState {
  column: string | null
  direction: 'asc' | 'desc'
}
```

## 🎯 Usage with UI Libraries

### With Custom Table Component

```vue
<template>
  <div>
    <!-- Search -->
    <input v-model="search" @input="handleSearchChange" />
    
    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th @click="handleSortChange('name')">Name</th>
          <th @click="handleSortChange('email')">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in tableData" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Pagination -->
    <button 
      :disabled="pagination?.meta.current_page === 1"
      @click="handlePageChange(pagination.meta.current_page - 1)"
    >
      Previous
    </button>
    <span>Page {{ pagination?.meta.current_page }} of {{ pagination?.meta.last_page }}</span>
    <button 
      :disabled="pagination?.meta.current_page === pagination?.meta.last_page"
      @click="handlePageChange(pagination.meta.current_page + 1)"
    >
      Next
    </button>
  </div>
</template>
```

### With TanStack Table

```vue
<script setup lang="ts">
import { usePagination } from '@toniel/laravel-tanstack-pagination'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'

const columnHelper = createColumnHelper<User>()

const {
  tableData,
  pagination,
  perPage,
  getNumberingColumn,
  // ... other returns
} = usePagination(fetchUsers, { queryKey: 'users' })

const columns = [
  getNumberingColumn({ header: '#' }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
]

const table = useVueTable({
  get data() { return tableData.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>
```

### With Shadcn-vue or Radix-vue

For ready-to-use DataTable component with shadcn-vue styling, use:

```bash
npm install @toniel/laravel-tanstack-datatable
```

See: https://www.npmjs.com/package/@toniel/laravel-tanstack-datatable

## 🔍 Filtering

The `usePagination` composable provides comprehensive filter management with proper state persistence across page changes.

### Single Filter Operations

```typescript
const {
  setFilter,
  removeFilter,
  customFilters,
  refetch,
} = usePagination(fetchFn, { queryKey: 'users' })

// Set a single filter
setFilter('status', 'active')
setFilter('category', 'A')

// Remove a filter
removeFilter('status')

// The query will automatically refetch when filters change
```

### Bulk Filter Operations

```typescript
const {
  handleFilterChange,
  customFilters,
  refetch,
} = usePagination(fetchFn, { queryKey: 'users' })

// Bulk update multiple filters at once
handleFilterChange({
  status: 'active',
  category: 'A',
  year: '2024'
})

// Or pass partial updates (will merge with existing)
handleFilterChange({
  ...customFilters.value,
  status: 'inactive'
})
```

### Filter State Persistence

Custom filters are properly included in the TanStack Query cache key, ensuring:
- Filters persist when changing pages
- Filters persist when changing per page
- Correct cache invalidation on filter changes
- Back/forward navigation works correctly

```typescript
// Filters are automatically included in queryKey
const { filters } = usePagination(fetchFn, { queryKey: 'users' })

// filters.value = { page: 1, per_page: 10, search: '', status: 'active', category: 'A' }
```

### Reset Filters

```typescript
const {
  resetFilters,
  customFilters,
  search,
  perPage,
} = usePagination(fetchFn, { queryKey: 'users', defaultPerPage: 20 })

// Reset all filters to defaults
resetFilters()

// After reset:
// - customFilters = {}
// - search = ''
// - perPage = 20
// - page = 1
```

### Example: Complex Filter Form

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePagination } from '@toniel/laravel-tanstack-pagination'

// Filter form state (separate from composable)
const filterForm = ref({
  status: '',
  category: '',
  year: new Date().getFullYear().toString(),
  month: '',
})

const {
  tableData,
  pagination,
  customFilters,
  setFilter,
  removeFilter,
  handlePageChange,
  refetch,
} = usePagination(
  (filters) => axios.get('/api/transactions', { params: filters }),
  { queryKey: 'transactions', defaultPerPage: 20 }
)

// Apply filters
const applyFilters = () => {
  // Clear existing custom filters first
  if (filterForm.value.status) {
    setFilter('status', filterForm.value.status)
  } else {
    removeFilter('status')
  }
  
  if (filterForm.value.category) {
    setFilter('category', filterForm.value.category)
  } else {
    removeFilter('category')
  }
  
  if (filterForm.value.year) {
    setFilter('year', filterForm.value.year)
  } else {
    removeFilter('year')
  }
  
  if (filterForm.value.month) {
    setFilter('month', filterForm.value.month)
  } else {
    removeFilter('month')
  }
  
  refetch()
}

// Clear all filters
const clearFilters = () => {
  filterForm.value = { status: '', category: '', year: new Date().getFullYear().toString(), month: '' }
  removeFilter('status')
  removeFilter('category')
  removeFilter('year')
  removeFilter('month')
  refetch()
}
</script>
```

## 🔧 Laravel Backend Setup

Your Laravel API should return paginated responses in this format:

```php
// UserController.php
public function index(Request $request)
{
    $query = User::query();
    
    // Search
    if ($request->has('search')) {
        $query->where('name', 'like', "%{$request->search}%")
              ->orWhere('email', 'like', "%{$request->search}%");
    }
    
    // Sorting (format: sort[column]=direction)
    foreach ($request->all() as $key => $value) {
        if (str_starts_with($key, 'sort[')) {
            preg_match('/sort\[(.*?)\]/', $key, $matches);
            $column = $matches[1] ?? null;
            if ($column) {
                $query->orderBy($column, $value);
            }
        }
    }
    
    // Paginate
    $perPage = $request->input('per_page', 10);
    return $query->paginate($perPage);
}
```

The response will automatically be in the correct format:
```json
{
  "data": [...],
  "links": {...},
  "meta": {
    "current_page": 1,
    "from": 1,
    "to": 10,
    "total": 100,
    "per_page": 10,
    "last_page": 10
  }
}
```

## 🔗 Related Packages

- [`@toniel/laravel-tanstack-datatable`](https://github.com/toniel/laravel-tanstack-datatable) - Pre-built DataTable components
- [`@tanstack/vue-query`](https://tanstack.com/query/latest/docs/vue/overview) - Data fetching & caching library
- [`@tanstack/vue-table`](https://tanstack.com/table/latest/docs/framework/vue/vue-table) - Headless table library

## 🌟 Show Your Support

If this package helped you, please consider:
- ⭐ Starring the [GitHub repository](https://github.com/toniel/laravel-tanstack-pagination)
- 🐛 [Reporting bugs](https://github.com/toniel/laravel-tanstack-pagination/issues)
- 💡 [Suggesting new features](https://github.com/toniel/laravel-tanstack-pagination/issues)
- 🔧 [Contributing code](https://github.com/toniel/laravel-tanstack-pagination/pulls)

## 📄 License

[MIT](https://github.com/toniel/laravel-tanstack-pagination/blob/main/LICENSE) © [Toniel](https://github.com/toniel)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📮 Contact

- GitHub: [@toniel](https://github.com/toniel)
- NPM: [@toniel](https://www.npmjs.com/~toniel)

## 🙏 Acknowledgments

Built with these amazing libraries:
- [Vue 3](https://vuejs.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Laravel](https://laravel.com/)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/toniel">Toniel</a>
</div>

