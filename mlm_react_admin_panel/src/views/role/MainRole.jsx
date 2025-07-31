import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RoleTable from "../../components/role/RoleTable";
import RoleAddEditPage from "../../components/role/roleAddEditPage";

const RoleLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const pathName = window.location.pathname;
  return (
    <>
      <div className="page_head_top">{t("Role")}</div>
      {pathName === "/role" ? (
        <RoleTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
      ) : (
        <RoleAddEditPage />
      )}
      {/* <RoleTable currentPage={currentPage} setCurrentPage={setCurrentPage} /> */}
    </>
  );
};

export default RoleLayout;
