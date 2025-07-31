import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StaffTable from "../../components/staff/StaffTable";
// import StaffAddEditPage from "../../components/staff/StaffAddEditPage";

const StaffLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  return (
    <>
      <div className="page_head_top">{t("Staff")}</div>
      {/* {pathName === "/staff" ? (
        <StaffTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
      ) : (
        <StaffAddEditPage />
      )} */}
      <StaffTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  );
};

export default StaffLayout;
