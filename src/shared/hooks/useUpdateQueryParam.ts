import { useSearchParams } from "react-router";

export const useUpdateQueryParam = (tablePrefix?: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParam = (key: string, value: string | null) => {
    // Create a prefixed key if tablePrefix is provided
    const prefixedKey = tablePrefix ? `${tablePrefix}_${key}` : key;

    if (value) {
      searchParams.set(prefixedKey, value);
    } else {
      searchParams.delete(prefixedKey);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const getQueryParam = (key: string) => {
    const prefixedKey = tablePrefix ? `${tablePrefix}_${key}` : key;
    return searchParams.get(prefixedKey) || "";
  };

  const clearTableParams = () => {
    if (!tablePrefix) return;

    const paramsToDelete: string[] = [];
    searchParams.forEach((_, key) => {
      if (key.startsWith(`${tablePrefix}_`)) {
        paramsToDelete.push(key);
      }
    });

    paramsToDelete.forEach((param) => searchParams.delete(param));
    setSearchParams(searchParams, { replace: true });
  };

  return {
    updateQueryParam,
    getQueryParam,
    clearTableParams,
    tablePrefix,
  };
};

// Helper hook for creating table-specific parameter management
export const useTableQueryParams = (tableId: string) => {
  const { updateQueryParam, getQueryParam, clearTableParams } =
    useUpdateQueryParam(tableId);

  const params = {
    keyword: getQueryParam("keyword"),
    page: parseInt(getQueryParam("page") || "0"),
    limit: parseInt(getQueryParam("limit") || "10"),
    sortBy: getQueryParam("sortBy"),
    sortOrder: getQueryParam("sortOrder") as "asc" | "desc" | "",
  };

  const updateParams = {
    setKeyword: (value: string) => updateQueryParam("keyword", value || null),
    setPage: (value: number) => updateQueryParam("page", value.toString()),
    setLimit: (value: number) => updateQueryParam("limit", value.toString()),
    setSortBy: (value: string) => updateQueryParam("sortBy", value || null),
    setSortOrder: (value: "asc" | "desc" | null) =>
      updateQueryParam("sortOrder", value),
    resetSearch: () => {
      updateQueryParam("keyword", null);
      updateQueryParam("page", "0");
    },
    clearAll: clearTableParams,
  };

  return {
    params,
    updateParams,
    tableId,
  };
};
