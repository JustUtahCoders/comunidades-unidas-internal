import { useEffect } from "react";

/**
 *
 * @param apiState
 * @param ApiStateStatus
 * @param ActionTypes
 * @param dispatchApiState
 */
export function useAlwaysValidPage(
  apiState,
  ApiStateStatus,
  ActionTypes,
  dispatchApiState
) {
  useEffect(() => {
    if (apiState.status !== ApiStateStatus.fetched) {
      // wait for data first
      return;
    }

    const lastPage = Math.ceil(
      apiState.apiData.pagination.numClients /
        apiState.apiData.pagination.pageSize
    );

    let newPage;

    if (
      typeof apiState.page !== "number" ||
      isNaN(apiState.page) ||
      isNaN(lastPage)
    ) {
      newPage = 1;
    } else if (apiState.page <= 0) {
      newPage = 1;
    } else if (lastPage === 0) {
      newPage = 1;
    } else if (apiState.page > lastPage) {
      newPage = lastPage;
    }

    if (newPage && newPage !== apiState.page) {
      dispatchApiState({
        type: ActionTypes.newPage,
        page: newPage,
      });
    }
  }, [apiState]);
}
