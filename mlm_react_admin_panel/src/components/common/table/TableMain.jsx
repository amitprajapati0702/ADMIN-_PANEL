import React, { useState } from "react";
import TableContent from "./TableContent";
import TablePagination from "./TablePagination";

const TableMain = ({
  headers,
  data,
  startPage,
  currentPage,
  totalPages,
  setCurrentPage,
  limit,
  setlimit,
  actions,
  rowRenderer
}) => {
  
  const toNextPage = () => {
    // setIsFetchable(true);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toLastPage = () => {
    setCurrentPage(totalPages);
  };

  const toPreviousPage = () => {
    if (currentPage > startPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toFirstPage = () => {
    setCurrentPage(startPage);
  };

  const handlelimitChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setlimit(selectedValue);
    setCurrentPage(1);
  };

  return (
    <>
      <TableContent
        headers={headers}
        data={data}
        actions={actions}
        rowRenderer={rowRenderer}
      />
      {data && data?.length !== 0 && (
        <TablePagination
          startPage={startPage}
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          setlimit={setlimit}
          toNextPage={toNextPage}
          toLastPage={toLastPage}
          toPreviousPage={toPreviousPage}
          toFirstPage={toFirstPage}
          handlelimitChange={handlelimitChange}
        />
      )}
    </>
  );
};

export default TableMain;
