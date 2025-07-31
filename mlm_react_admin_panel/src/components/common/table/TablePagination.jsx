import React from "react";
import { useTranslation } from "react-i18next";

const TablePagination = ({
  startPage,
  currentPage,
  totalPages,
  limit,
  handlelimitChange,
  toFirstPage,
  toPreviousPage,
  toNextPage,
  toLastPage,
}) => {
  const { t } = useTranslation();
  const isLinkEnabled = currentPage !== startPage;
  const isLinkDisabled = currentPage !== totalPages;

  return (
    <div className="pagination_section_btm">
      <div className="row justify-content-between">
        <div className="col-lg-4 col-md-12 page_select_sec">
          {t("limit")}{" "}
          <select
            name="page"
            className="page_slect"
            onChange={handlelimitChange}
            value={limit}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="col-lg-6 col-md-12">
          <nav>
            <ul className="pagination d-flex justify-content-center flex-wrap pagination-rounded-flat pagination-success">
              <li className="page-item">
                <a
                  className={`page-link ${isLinkEnabled ? "" : "disabled"}`}
                  onClick={toFirstPage}
                  data-abc="true"
                >
                  <i className="fa fa-angle-double-left"></i>
                </a>
              </li>
              <li className="page-item">
                <a
                  className={`page-link ${isLinkEnabled ? "" : "disabled"}`}
                  onClick={toPreviousPage}
                  data-abc="true"
                >
                  <i className="fa fa-angle-left"></i>
                </a>
              </li>
              {currentPage !== startPage && (
                <li className="page-item">
                  <a
                    className="page-link"
                    onClick={toFirstPage}
                    data-abc="true"
                  >
                    {startPage}
                  </a>
                </li>
              )}
              {currentPage - startPage > 2 && (
                <li className="page-item">
                  <a className="page-link" data-abc="true">
                    ...
                  </a>
                </li>
              )}
              {currentPage - startPage === 2 && (
                <li className="page-item">
                  <a
                    className="page-link"
                    onClick={toPreviousPage}
                    data-abc="true"
                  >
                    {currentPage - 1}
                  </a>
                </li>
              )}
              <li className="page-item active">
                <a className="page-link" data-abc="true">
                  {currentPage ?? 0}
                </a>
              </li>
              {totalPages - currentPage > 2 && (
                <li className="page-item">
                  <a className="page-link" data-abc="true">
                    ...
                  </a>
                </li>
              )}
              {totalPages - currentPage === 2 && (
                <li className="page-item">
                  <a
                    className="page-link"
                    onClick={toNextPage}
                    data-abc="true"
                  >
                    {totalPages - 1}
                  </a>
                </li>
              )}
              {currentPage !== totalPages && (
                <li className="page-item">
                  <a
                    className="page-link"
                    onClick={toLastPage}
                    data-abc="true"
                  >
                    {totalPages}
                  </a>
                </li>
              )}
              <li className="page-item">
                <a
                  className={`page-link ${isLinkDisabled ? "" : "disabled"}`}
                  onClick={toNextPage}
                  data-abc="true"
                >
                  <i className="fa fa-angle-right"></i>
                </a>
              </li>
              <li className="page-item">
                <a
                  className={`page-link ${isLinkDisabled ? "" : "disabled"}`}
                  onClick={toLastPage}
                  data-abc="true"
                >
                  <i className="fa fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
