/**
 * Normalizes list API responses: either a raw array (legacy) or { data, pagination, ... }.
 */
export function listItemsFromResponse(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.data)) return d.data;
  return [];
}

export function paginationFromResponse(res) {
  const d = res?.data;
  if (d && d.pagination) return d.pagination;
  return null;
}

/** Total docs in scope (e.g. all PACKAGE) vs current filtered page total */
export function scopeTotalFromPagination(pagination) {
  if (!pagination) return 0;
  if (typeof pagination.scopeTotal === 'number') return pagination.scopeTotal;
  return pagination.total ?? 0;
}

export function workflowCountsFromResponse(res) {
  const d = res?.data;
  if (d && d.workflowCounts && typeof d.workflowCounts === 'object') return d.workflowCounts;
  return null;
}
