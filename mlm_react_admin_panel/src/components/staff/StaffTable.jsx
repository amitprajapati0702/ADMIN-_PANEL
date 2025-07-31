import React, { useEffect, useState } from "react";
import TableMain from "../common/table/TableMain";
import { ApiHook } from "../../redux/hooks/apiHook";
import { useSelector } from "react-redux";
import { Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StaffAddEditPage from "./StaffAddEditPage.jsx";
import { toast } from "react-toastify";

const FilterToggleComponent = ({
  search,
  setSearch,
  roleData,
  handleClearSearch,
}) => {
  const { search1, search2, search3, search4, search5, search6 } = search;
  return (
    <>
      <div className="filter-toggle">
        <div className="filter-toggle-body">
          <div className="row align-items-center">
            <div className="col-md-4 mb-3">
              <label htmlFor="search1" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="search1"
                value={search1}
                placeholder="Enter First Name"
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search1) {
                    setSearch((pre) => ({ ...pre, search1: trimmedValue }));
                  }
                }}
                maxLength={32}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Label for="search2">Last Name</Label>
              <Input
                type="text"
                id="search2"
                placeholder="Enter Last Name"
                value={search2}
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search2) {
                    setSearch((pre) => ({ ...pre, search2: trimmedValue }));
                  }
                }}
                maxLength={32}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="search4" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="search4"
                value={search4}
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search4) {
                    setSearch((pre) => ({ ...pre, search4: trimmedValue }));
                  }
                }}
                maxLength={32}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="search3" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="search3"
                value={search3}
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search3) {
                    setSearch((pre) => ({ ...pre, search3: trimmedValue }));
                  }
                }}
                maxLength={32}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-select"
                id="search5"
                aria-label="Role"
                value={search5}
                onChange={(e) => {
                  const trimmedValue = e.target.value?.trimStart();
                  if (trimmedValue !== search5) {
                    setSearch((pre) => ({ ...pre, search5: trimmedValue }));
                  }
                }}
              >
                <option value="" defaultChecked>
                  Select
                </option>
                {roleData.map((value, index) => (
                  <option key={index} value={value._id}>
                    {value.name.length > 20
                      ? `${value.name.substring(0, 20)}...`
                      : value.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="search6"
              aria-label="Status"
              value={search6}
              onChange={(e) => {
                const trimmedValue = e.target.value?.trimStart();
                if (trimmedValue !== search6) {
                  setSearch((pre) => ({ ...pre, search6: trimmedValue }));
                }
              }}
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">InActive</option>
            </select>
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

const headers = [
  "S.No",
  "First Name",
  "Last Name",
  "Email",
  "Role",
  "Phone",
  "Actions",
];
export const truncateText = (text, maxLength) => {
  if (typeof text !== "string" || text.length === 0) {
    return ""; // Return an empty string if the input is not a valid string
  }
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
};

const rowRenderer = (row) => {
  const firstName = truncateText(row.firstName, 15);
  const lastName = truncateText(row.lastName, 15);
  const role = truncateText(row?.roleData[0]?.name, 52);

  return [firstName, lastName, row.email, role, row.phone];
};

const StaffTable = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();
  const nevigate = useNavigate();
  const [isAddPage, setIsAddPage] = useState(false);
  const [isEditPage, setIsEditPage] = useState(false);
  const [isViewPage, setIsViewPage] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [search, setSearch] = useState({
    search1: "",
    search2: "",
    search3: "",
    search4: "",
    search5: "",
    search6: "",
  });
  const [isSearch, setIsSearch] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState(null);
  const [limit, setlimit] = useState(10);
  const { search1, search2, search3, search4, search5, search6 } = search;

  //------------------------------------------- API -------------------------------------------
  const staffData = ApiHook.CallAdminList(
    currentPage,
    limit,
    search1,
    search2,
    search3,
    search4,
    search5,
    search6,
    isSearch
  );
  const changePasswordMutation = ApiHook.CallChangeStaffStatus();
  const setPageToFirst = () => setCurrentPage(1);
  const handleToggle = async (row) => {
    try {
      const updatedStatus = row.status === 1 ? 0 : 1;
      const data = { id: row._id, status: updatedStatus };
      const response = await changePasswordMutation.mutateAsync(data);
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
  const handleView = async (row) => {
    setIsShowForm(true);
    setIsViewPage(true);
    setIsEditPage(false);
    setIsAddPage(false);
    setIsUpdatePassword(false);
    setSelectedStaffData(row);
  };
  const handleEdit = async (row) => {
    setIsShowForm(true);
    setIsEditPage(true);
    setIsViewPage(false);
    setIsAddPage(false);
    setIsUpdatePassword(false);
    setSelectedStaffData(row);
  };

  const handleUpdatePassword = async (row) => {
    setIsShowForm(true);
    setIsEditPage(false);
    setIsViewPage(false);
    setIsAddPage(false);
    setIsUpdatePassword(true);
    setSelectedStaffData(row);
  };

  const handleAdd = async () => {
    setIsAddPage(true);
    setIsEditPage(false);
    setIsViewPage(false);
    setIsUpdatePassword(false);
    setSelectedStaffData(null);
    setIsShowForm(true);
  };

  const actions = [
    { type: "edit", onClick: handleEdit },
    { type: "view", onClick: handleView },
    { type: "updatePassword", onClick: handleUpdatePassword },
    { type: "status", onClick: handleToggle },
  ];

  // Fetch role data and update state
  useEffect(() => {
    if (staffData?.data?.data?.roleData) {
      setRoleData(staffData.data.data.roleData);
    }
  }, [staffData?.data?.data?.roleData]);

  useEffect(() => {
    if (search1 || search2 || search3 || search4 || search5 || search6) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
    if (isSearch === true) {
      setCurrentPage(1);
    }
    staffData.mutate({
      page: currentPage,
      limit,
      search1,
      search2,
      search3,
      search4,
      search5,
      search6,
      isSearch,
    });
  }, [
    currentPage,
    limit,
    search,
    isSearch,
  ]);

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  const handleClearSearch = () => {
    // Reset all search states
    setSearch({
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      search6: "",
    });
    setIsSearch(false);
  };

  return (
    <>
      <div className="center_content_head">
        <span>{t("manageStaff")}</span>
      </div>
      <div className="staff_table_section">
        <div className="staff_table_section_cnt">
          <div className="staff_table_section_cnt_tab_head"></div>
        </div>
        <div className="table-responsive min-hieght-table">
          <div className="align-items-center gy-3 p-3 row">
            <div className="col-sm">
              {/* <h5 className="card-title mb-0">Manage Staff</h5> */}
            </div>
            <div className="col-sm-auto">
              <div className="d-flex gap-1 flex-wrap">
                <button
                  type="button"
                  className="add_record_btn"
                  id="create-btn"
                  onClick={handleAdd}
                >
                  <i className="ri-add-line align-bottom me-1"></i> Add Staff
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
                roleData={roleData}
                search={search}
                setSearch={setSearch}
                handleClearSearch={handleClearSearch}
              />
            )}
          </div>
          <TableMain
            headers={headers}
            data={staffData?.data?.data?.result}
            startPage={1}
            currentPage={staffData?.data?.data?.currentPage}
            totalPages={staffData?.data?.data?.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setlimit={setlimit}
            actions={actions}
            rowRenderer={rowRenderer}
          />
        </div>
      </div>
      <StaffAddEditPage
        show={isShowForm}
        setShow={setIsShowForm}
        roles={roleData}
        currentAction={isAddPage ? "add" : isEditPage ? "edit" : isUpdatePassword ? "updatePassword" : "view"}
        selectedStaffData={selectedStaffData}
        setPageToFirst= {setPageToFirst}
      />
    </>
  );
};

export default StaffTable;
