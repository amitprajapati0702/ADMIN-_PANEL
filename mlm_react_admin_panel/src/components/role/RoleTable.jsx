import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, Label } from "reactstrap";
import TableMain from "../common/table/TableMain";
import { ApiHook } from "../../redux/hooks/apiHook";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const headers = ["S.No", "Name", "Action"];

export const truncateText = (text, maxLength) => {
  if (typeof text !== "string" || text.length === 0) {
    return ""; // Return an empty string if the input is not a valid string
  }
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
};

const rowRenderer = (row) => {
  const roleName = truncateText(row.name, 15);

  return [roleName];
};

const FilterToggleComponent = ({
  search,
  setSearch,
  //   roleData,
  handleClearSearch,
}) => {
  const { search1, search2 } = search;
  return (
    <>
      <div className="filter-toggle">
        <div className="filter-toggle-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3">
              <Label htmlFor="search1" className="form-label">
                Name
              </Label>
              <Input
                type="text"
                className="form-control"
                id="search1"
                value={search1}
                placeholder="Enter Name"
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search1) {
                    setSearch((pre) => ({ ...pre, search1: trimmedValue }));
                  }
                }}
                maxLength={32}
              />
            </div>
            {/* </div> */}
            <div className="col-md-4 mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="search6"
                aria-label="Status"
                value={search2}
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search2) {
                    setSearch((pre) => ({ ...pre, search2: trimmedValue }));
                  }
                }}
              >
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">InActive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <button
              type="button"
              className="btn btn-dark text-white rounded-3"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const RoleTable = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();
  const nevigate = useNavigate();
  const [filterToggle, setFilterToggle] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [limit, setlimit] = useState(10);
  const [search, setSearch] = useState({
    search1: "",
    search2: "",
  });
  const [selectedRoleData, setSelectedRoleData] = useState(null);
  const { search1, search2 } = search;

  //------------------------------------------- API -------------------------------------------
  const roleData = ApiHook.CallRoleList(
    currentPage,
    limit,
    search1,
    search2,
    isSearch
  );
  const handleAdd = () => {
    nevigate("/role/add", { state: { isAdd: true, isEdit: false } });
  };
  const handleEdit = (row) => {
    nevigate("/role/edit", { state: { isEdit: true, isAdd: false, role: row } });
  };

  useEffect(() => {
    if (search1 || search2) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    if (isSearch === true) {
      setCurrentPage(1);
    }
    roleData.mutate({
      page: currentPage,
      limit,
      search1,
      search2,
      isSearch,
    });
  }, [currentPage, limit, search, isSearch]);

  const handleFilterToggle = () => {
    setFilterToggle((pre) => !pre);
  };
  const handleClearSearch = () => {
    // Reset all search states
    setSearch({
      search1: "",
      search2: "",
    });
    setIsSearch(false);
  };
  const callChangeRoleStatus = ApiHook.CallChangeRoleStatus();
  const setPageToFirst = () => setCurrentPage(1);
  const handleToggle = async (row) => {
    try {
      const updatedStatus = row.status === 1 ? 0 : 1;
      const data = { id: row._id, status: updatedStatus };
      const response = await callChangeRoleStatus.mutateAsync(data);
      row.status = updatedStatus;
      if (response?.success === 1) {
        toast.success(response?.message, {
          autoClose: 2000,
        });
      } else {
        toast.error(response?.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const actions = [
    { type: "edit", onClick: handleEdit },
    { type: "status", onClick: handleToggle },
  ];
  return (
    <>
      <div className="center_content_head">
        <span>{t("manageRole")}</span>
      </div>
      <div className="main_table_section">
        <div className="main_table_section_cnt">
          <div className="main_table_section_cnt_tab_head"></div>
        </div>
      </div>
      <div className="table-responsive min-hieght-table">
        <div className="align-items-center gy-3 p-3 row">
          <div className="col-sm"></div>
          <div className="col-sm-auto">
            <div className="d-flex gap-1 flex-wrap">
              <button
                type="button"
                className="add_record_btn"
                id="create-btn"
                onClick={handleAdd}
              >
                <i className="ri-add-line align-bottom me-1"></i> Add Role
              </button>
              <button
                type="button"
                className="btn btn-dark text-white float-end rounded-3"
                onClick={handleFilterToggle}
              >
                <i className="ri-equalizer-fill me-1 align-bottom"></i> Filter
              </button>{" "}
            </div>
          </div>
          {filterToggle && (
            <FilterToggleComponent
              //   roleData={roleData}
              search={search}
              setSearch={setSearch}
              handleClearSearch={handleClearSearch}
            />
          )}
        </div>
        <TableMain
          headers={headers}
          data={roleData?.data?.data?.result}
          startPage={1}
          currentPage={roleData?.data?.data?.currentPage}
          totalPages={roleData?.data?.data?.totalPages}
          setCurrentPage={setCurrentPage}
          limit={limit}
          setlimit={setlimit}
          actions={actions}
          rowRenderer={rowRenderer}
        />
      </div>
    </>
  );
};

export default RoleTable;
