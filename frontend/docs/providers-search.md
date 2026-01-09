# Providers Search & Refinement

## Basic Search
- **Endpoint**: `GET /providers?query={term}`
- **Behavior**: Searches against Provider Name, Service Category, and City.
- **Debounce**: 500ms on frontend.

## Advanced Filters
- **Category**: Exact match on service category.
- **Price Range**: `minPrice` and `maxPrice` filters on `hourlyRate`.
- **Rating**: `minRating` filter (e.g. 4+ stars).
- **Location Radius**:
    1. Frontend captures user coordinates (mocked or via browser API).
    2. Sends `lat`, `lng`, and `radius` (km) to backend.
    3. Backend filters providers within haversine distance.

## Sort Options
- `listing_order` (Default: Promoted/Featured first)
- `rating` (Highest first)
- `price_asc` (Lowest price first)
- `price_desc` (Highest price first)
- `distance` (Nearest first - requires user location)
