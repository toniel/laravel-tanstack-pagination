# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2026-05-30

### Fixed
- Fixed debounce not working — search query now properly debounced before triggering refetch
- Fixed `removeFilter` not triggering Vue reactivity (used `delete` on ref object)
- Fixed `LaravelPaginationResponse.links` type to match actual Laravel response (object, not array)
- Fixed timer type mismatch (`number` vs `ReturnType<typeof setTimeout>`)
- Fixed parameter shadowing in `getNumberingColumn`

### Added
- `onScopeDispose` cleanup for search debounce timeout (prevents memory leaks)
- `keepPreviousData` as default `placeholderData` (no flash of empty table on page change)
- Page validation: `handlePageChange` now clamps to `1..last_page`
- `handlePerPageChange` validates positive integer
- Sort column name sanitization (rejects special characters to prevent parameter injection)
- Configurable `debounceMs` option (default: 300)
- `currentPerPage` alias in return values

### Changed
- Removed hardcoded project-specific className from `useTableNumbering` (now defaults to empty string)

## [0.1.2] - 2026-04-08

### Fixed
- Fixed custom filters not persisting when changing pages - filters now correctly maintained during pagination
- Custom filters now properly included in the queryKey for correct cache invalidation

### Added
- `customFilters` ref for storing custom filter state externally
- `handleFilterChange` function for bulk filter updates
- Filter state now preserved across page changes

## [0.1.1] - 2025-01-11

### Changed
- Updated README with NPM and GitHub badges
- Added multiple package manager installation options (npm, yarn, pnpm, bun)
- Enhanced documentation with better structure and formatting
- Updated package.json metadata (repository URLs, homepage, bugs)

### Added
- LICENSE file (MIT License)
- Comprehensive CHANGELOG.md
- Community section in README (contributing, support, contact)
- "Show Your Support" section
- Acknowledgments section

### Documentation
- Improved installation instructions
- Added peer dependencies section
- Added contact information
- Added related packages section
- Better API documentation formatting

## [0.1.0] - 2025-01-11

### Added
- Initial release of Laravel TanStack Pagination
- `usePagination()` composable for Laravel pagination
- `useTableNumbering()` composable for sequential row numbers
- Search with automatic debounce (300ms)
- Server-side sorting support
- Custom filter management
- TypeScript support with full type definitions
- TanStack Query integration
- Headless architecture for framework-agnostic usage

### Features
- ✅ Laravel pagination support
- ✅ TanStack Query integration for caching & refetching
- ✅ Search with debounce
- ✅ Server-side sorting
- ✅ Custom filters
- ✅ Table numbering helper
- ✅ TypeScript fully typed
- ✅ Framework agnostic

### Documentation
- Complete README with usage examples
- API documentation
- Laravel backend setup guide
- TypeScript type definitions

[Unreleased]: https://github.com/toniel/laravel-tanstack-pagination/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/toniel/laravel-tanstack-pagination/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/toniel/laravel-tanstack-pagination/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/toniel/laravel-tanstack-pagination/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/toniel/laravel-tanstack-pagination/releases/tag/v0.1.0
