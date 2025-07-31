import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../common/buttons/SubmitButton";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { ApiHook } from "../../redux/hooks/apiHook";

const AdminProfileDetailsForm = ({ profile }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const profileData = useSelector((state) => state?.admin?.profile) || {};
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: profileData?.firstName,
      lastName: profileData?.lastName,
      address: profileData?.address,
    },
  });
  const formValues = watch();

  // states and variable declaration
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // API
  const updateMutation = ApiHook.CallUpdateAdminProfileDetails();

  // function
  const toggleEditMode = () => {
    setIsEditModeEnabled(!isEditModeEnabled);
  };
  const onSubmit = async () => {
    if (isEditModeEnabled) {
      try {
        await updateMutation.mutate(formValues, {
          onSuccess: (response) => {
            isEditModeEnabled && toggleEditMode();
          },
        });
        console.log("Settings updated successfully!");
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };

  useEffect(() => {
    if (profileData) {
      setValue("firstName", profileData.firstName);
      setValue("lastName", profileData.lastName);
      setValue("address", profileData.address);
    }
  }, [profileData, setValue]);

  return (
    <>
      <div className="profileTabSec">
        <div className="profileTabBg">
          <div ref={containerRef}></div>
          <div id="firstTab" className="tabcontent">
            <div className="editSec">
              <div className="editBg">
                <span
                  style={{ textDecoration: "none", cursor: "pointer" }}
                  onClick={toggleEditMode}
                >
                  <i
                    className="fa-solid fa-pen-to-square"
                    style={{ color: "#32009c" }}
                  ></i>
                </span>
              </div>
            </div>
            <h3>{t("personalDetails")}</h3>
            <div className="tabcontent_form_section">
              <div className="mb-3 row tabBlockClass">
                <label
                  htmlFor="firstName"
                  className="col-sm-3 col-form-label labelWidthClass"
                >
                  {t("firstName")}:
                </label>
                <div className="col-md-9 col-sm-12 col-12">
                  <input
                    {...register("firstName", {
                      required: t("thisFieldIsRequired"),
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: t("invalidFormat"),
                      },
                    })}
                    defaultValue={profileData?.firstName}
                    type="text"
                    id="firstName"
                    className="form-control"
                    disabled={!isEditModeEnabled}
                  />
                  {errors.firstName && (
                    <span className="validation-error-message">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3 row tabBlockClass">
                <label
                  htmlFor="lastName"
                  className="col-sm-3 col-form-label labelWidthClass"
                >
                  {t("lastName")}:
                </label>
                <div className="col-md-9 col-sm-12 col-12">
                  <input
                    {...register("lastName", {
                      // pattern: {
                      //   value: /^[A-Za-z0-9]+$/,
                      //   message: t("invalid_format"),
                      // },
                    })}
                    defaultValue={profileData?.lastName}
                    type="text"
                    id="lastName"
                    className="form-control"
                    disabled={!isEditModeEnabled}
                  />
                  {errors.lastName && (
                    <span className="validation-error-message">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3 row tabBlockClass">
                <label
                  htmlFor="address"
                  className="col-sm-3 col-form-label labelWidthClass"
                >
                  {t("Address")}:
                </label>
                <div className="col-md-9 col-sm-12 col-12">
                  <input
                    {...register("address", {
                      // pattern: {
                      //   value: /^[A-Za-z0-9]+$/,
                      //   message: t("invalid_format"),
                      // },
                    })}
                    defaultValue={profileData?.address}
                    type="text"
                    id="address"
                    className="form-control"
                    disabled={!isEditModeEnabled}
                  />
                  {errors.address && (
                    <span className="validation-error-message">
                      {errors.address.message}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`paymenytLinkBtn ${
                  isEditModeEnabled ? "disabled" : ""
                }`}
              >
                <SubmitButton
                  isSubmitting={updateMutation.isLoading || !isEditModeEnabled}
                  className="btn"
                  text={updateMutation.isLoading ? "updating..." : "Update"}
                  click={onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfileDetailsForm;
