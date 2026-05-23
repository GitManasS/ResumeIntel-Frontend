/** Extract list payload from paginated API responses */
export function extractPaginatedList(response) {
  const body = response?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}
