import React, { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { NavLink, useLocation } from "react-router-dom";
// import { ApiHook } from "../../redux/hooks/apiHook";
import Skeleton from "react-loading-skeleton";
// import { useSelector } from "react-redux";

const UserProfile = ({ profile }) => {
  // const { t } = useTranslation();
  // const progressBarRef = useRef(null);
  // const [selectedFile, setSelectedFile] = useState(null);

  //   const deleteProfileMutation = ApiHook.CallDeleteProfileAvatar();

  // useEffect(() => {
  //   const strokeDashOffsetValue =
  //     100 - (profile?.productValidity?.packageValidityPercentage ?? 100);
  //   progressBarRef.current.style.strokeDashoffset = strokeDashOffsetValue;
  // }, [profile?.productValidity?.packageValidityPercentage]);

  // const handleImageChange = (event) => {
  //   event.preventDefault(); // Prevent default behavior
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     //   updateAvatarMutation.mutate(selectedFile, {
  //     //     onSuccess: (res) => {
  //     //       if (res.status) {
  //     //         // Clear the value of the file input
  //     //         const fileInput = document.getElementById("fileInput");
  //     //         if (fileInput) {
  //     //           fileInput.value = null;
  //     //         }
  //     //       }
  //     //     }
  //     //   });
  //   }
  // };

  //   const deleteProfilePicture = () => {
  //     deleteProfileMutation.mutate();
  //   };

  return (
    <>
      <div className="col-lg-3 col-md-12 borderPofileStyle">
        <div className="rightSide_top_user_dropdown">
          <div className="rightSide_top_user_dropdown_avatar_sec">
            {/* <div className="profileEditBar">
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </button>
            </div>
            <div className="deletIcon" style={{}}>
              <div className="deletIcon" style={{}} onClick={deleteProfilePicture}>
              <a style={{ textDecoration: "none" }}>
                <i className="fa-solid fa-trash"></i>
                <input type="file" id="fileInput" style={{ display: "none" }} />
              </a>
            </div> */}
            {/* {moduleStatus?.kyc_status === 0 && (
            <div
              className="kyc_vrfd profileKycVerified"
              style={{ width: "25px" }}
            >
              <img src="/images/kyc_vrfd.svg" alt="" />
            </div>
          )}
          {moduleStatus?.kyc_status === 1 && (
            <div className="kyc_vrfd profileKycVerified">
              {userKyc ? (
                <img src="/images/kyc_vrfd.svg" alt="" />
              ) : (
                <img src="/images/kyc_not_vrfd.png" alt="" />
              )}
            </div>
          )} */}
            <div className="rightSide_top_user_dropdown_avatar_extra_padding avatarProfileStyle">
              <img
                src={require("../../assets/images/user-profile.png")}
                alt=""
              />
              <svg
                className="profile_progress avatarProfileProgress"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-1 -1 34 34"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="15.9155"
                  className="progress-bar__background"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="15.9155"
                  className="progress-bar__progress js-progress-bar"
                  // ref={progressBarRef}
                />
              </svg>
            </div>
          </div>
          <div className="profileAvatarnameSec">
            {profile ? (
              <>
                <h4>{profile?.firstName}</h4>
                <p>{profile?.phone}</p>
              </>
            ) : (
              <>
                <Skeleton width="70%" />
                <Skeleton count={0.5} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
