import React, { useState } from "react";
import ProfileAvatar from "../../components/profile/AdminProfileAvatar";
import AdminProfileExtra from "../../components/profile/AdminProfileExtra";
// import ChangePasswordModal from "../../components/common/modals/ChangePasswordModal";
// import ChangeTransPassModal from "../../components/common/modals/ChangeTransPassModal";
// import UserProfileTabs from "../../components/Profile/UserProfileTabs";
import { ApiHook } from "../../redux/hooks/apiHook";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AdminProfileDetailsForm from "../../components/profile/AdminProfileDetailsForm";
// import RankViewModal from "../../components/common/modals/RankViewModal";

const ProfileLayout = () => {
  const { t } = useTranslation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleClosePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };
  //------------------------------------ API ---------------------------------
  const getAdminProfileMutation = ApiHook.CallProfile();
  const Profile = useSelector((state) => state?.admin?.profile);

  return (
    <>
      <div className="page_head_top">{t("profileView")}</div>
      <div className="profileBgBox">
        <div className="row align-items-center">
          <ProfileAvatar profile={Profile} />
          <AdminProfileExtra profile={Profile} />
        </div>
      </div>
      <AdminProfileDetailsForm profile={Profile} />
    </>
  );
};

export default ProfileLayout;
