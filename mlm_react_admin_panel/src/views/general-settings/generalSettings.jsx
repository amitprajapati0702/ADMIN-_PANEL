import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import SubmitButton from "../../components/common/buttons/SubmitButton";
import { ApiHook } from "../../redux/hooks/apiHook";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setGeneralSettingsData } from "../../redux/reducers/generalSettingReducer";

const GeneralInfo = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generalSettingsData = useSelector(
    (state) => state.generalSettings?.generalSettingsData
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      systemEmail: generalSettingsData?.systemEmail,
      phoneNumber: generalSettingsData?.phoneNumber,
    },
  });
  const formValues = watch();
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // API
  const updateGeneralSettings = ApiHook.CallUpdateGeneralSettings();

  const toggleEditMode = () => {
    setIsEditModeEnabled(!isEditModeEnabled);
  };
  const onSubmit = async () => {
    if (isEditModeEnabled) {
      const data = {
        systemEmail: formValues.systemEmail,
        phoneNumber: formValues.phoneNumber,
      };
      try {
        await updateGeneralSettings.mutate(formValues, {
          onSuccess: (response) => {
            dispatch(setGeneralSettingsData(data));
          },
        });
        console.log("Settings updated successfully!");
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };
  useEffect(() => {
    if (generalSettingsData) {
      setValue("systemEmail", generalSettingsData.systemEmail);
      setValue("phoneNumber", generalSettingsData.phoneNumber);
    }
  }, [generalSettingsData, setValue]);
  return (
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
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div className="tabcontent_form_section">
        <div className="mb-3 row tabBlockClass">
          <label
            htmlFor="systemEmail"
            className="col-sm-3 col-form-label labelWidthClass"
          >
            {t("systemEmail")}:
          </label>
          <div className="col-md-9 col-sm-12 col-12">
            <input
              {...register("systemEmail", {
                required: t("thisFieldIsRequired"),
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: t("invalidFormat"),
                },
              })}
              defaultValue={generalSettingsData?.systemEmail}
              type="text"
              id="systemEmail"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.systemEmail && (
              <span className="validation-error-message">
                {errors.systemEmail.message}
              </span>
            )}
          </div>
        </div>
        <div className="mb-3 row tabBlockClass">
          <label
            htmlFor="phoneNumber"
            className="col-sm-3 col-form-label labelWidthClass"
          >
            {t("phoneNumber")}:
          </label>
          <div className="col-md-9 col-sm-12 col-12">
            <input
              {...register("phoneNumber", {
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: t("invalid_format"),
                },
              })}
              defaultValue={generalSettingsData?.phoneNumber}
              type="text"
              id="phoneNumber"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.phoneNumber && (
              <span className="validation-error-message">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
        </div>

        <div
          className={`generalSettingsUpdateBtn ${
            isEditModeEnabled ? "disabled" : ""
          }`}
        >
          <SubmitButton
            isSubmitting={updateGeneralSettings.isLoading || !isEditModeEnabled}
            className="btn"
            text={updateGeneralSettings.isLoading ? "Updating..." : "Update"}
            click={onSubmit}
          />
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

const SocialMediaLinks = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generalSettingsData = useSelector(
    (state) => state.generalSettings?.generalSettingsData
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      twitterLink: generalSettingsData?.twitterLink,
      youtubeLink: generalSettingsData?.youtubeLink,
    },
  });
  const formValues = watch();
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // API
  const updateGeneralSettings = ApiHook.CallUpdateGeneralSettings();

  const toggleEditMode = () => setIsEditModeEnabled(!isEditModeEnabled);
  const onSubmit = async () => {
    if (isEditModeEnabled) {
      const data = {
        twitterLink: formValues.twitterLink,
        youtubeLink: formValues.youtubeLink,
      };
      try {
        await updateGeneralSettings.mutate(formValues, {
          onSuccess: (response) => {
            dispatch(setGeneralSettingsData(data));
          },
        });
        console.log("Settings updated successfully!");
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };

  useEffect(() => {
    if (generalSettingsData) {
      setValue("twitterLink", generalSettingsData.twitterLink);
      setValue("youtubeLink", generalSettingsData.youtubeLink);
    }
  }, [generalSettingsData, setValue]);
  return (
    <div id="secondTab" className="tabcontent">
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
      <h3>{t("socialMediaLinks")}</h3>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div className="tabcontent_form_section">
        <div className="mb-3 row">
          <label htmlFor="twitter" className="col-sm-3 col-form-label">
            {t("Twitter")}:
          </label>
          <div className="col-md-9">
            <input
              {...register("twitterLink")}
              defaultValue={generalSettingsData?.twitterLink}
              type="text"
              id="twitterLink"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.twitterLink && (
              <span className="validation-error-message">
                {errors.twitterLink.message}
              </span>
            )}
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="youtubeLink" className="col-sm-3 col-form-label">
            {t("YouTube")}:
          </label>
          <div className="col-md-9">
            <input
              {...register("youtubeLink")}
              defaultValue={generalSettingsData?.youtubeLink}
              type="text"
              id="youtubeLink"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.youtubeLink && (
              <span className="validation-error-message">
                {errors.youtubeLink.message}
              </span>
            )}
          </div>
        </div>
        <div
          className={`generalSettingsUpdateBtn ${
            isEditModeEnabled ? "disabled" : ""
          }`}
        >
          <SubmitButton
            isSubmitting={updateGeneralSettings.isLoading || !isEditModeEnabled}
            className="btn"
            text={updateGeneralSettings.isLoading ? "Updating..." : "Update"}
            click={onSubmit}
          />
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

const AppLinks = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generalSettingsData = useSelector(
    (state) => state.generalSettings?.generalSettingsData
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      android: generalSettingsData?.androidAppLink,
      ios: generalSettingsData?.iosAppLink,
    },
  });
  const formValues = watch();
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // API
  const updateGeneralSettings = ApiHook.CallUpdateGeneralSettings();

  const toggleEditMode = () => setIsEditModeEnabled(!isEditModeEnabled);

  const onSubmit = async () => {
    if (isEditModeEnabled) {
      const data = {
        androidAppLink: formValues.android,
        iosAppLink: formValues.ios,
      };
      try {
        await updateGeneralSettings.mutate(formValues, {
          onSuccess: (response) => {
            dispatch(setGeneralSettingsData(data));
          },
        });
        console.log("Settings updated successfully!");
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };

  useEffect(() => {
    if (generalSettingsData) {
      setValue("android", generalSettingsData.androidAppLink);
      setValue("ios", generalSettingsData.iosAppLink);
    }
  }, [generalSettingsData, setValue]);

  return (
    <div id="thirdTab" className="tabcontent">
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
      <h3>{t("appLink")}</h3>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div className="tabcontent_form_section">
        <div className="mb-3 row">
          <label htmlFor="android" className="col-sm-3 col-form-label">
            {t("Android")}
          </label>
          <div className="col-md-9">
            <input
              {...register("android")}
              defaultValue={generalSettingsData?.androidAppLink}
              type="text"
              id="android"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.android && (
              <span className="validation-error-message">
                {errors.android.message}
              </span>
            )}
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ios" className="col-sm-3 col-form-label">
            {t("IOS")}:
          </label>
          <div className="col-md-9">
            <input
              {...register("ios")}
              defaultValue={generalSettingsData?.iosAppLink}
              type="text"
              id="ios"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.ios && (
              <span className="validation-error-message">
                {errors.ios.message}
              </span>
            )}
          </div>
        </div>
        <div
          className={`generalSettingsUpdateBtn ${
            isEditModeEnabled ? "disabled" : ""
          }`}
        >
          <SubmitButton
            isSubmitting={updateGeneralSettings.isLoading || !isEditModeEnabled}
            className="btn"
            text={updateGeneralSettings.isLoading ? "Updating..." : "Update"}
            click={onSubmit}
          />
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

const AppVersion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const generalSettingsData = useSelector(
    (state) => state.generalSettings?.generalSettingsData
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      androidVersion: generalSettingsData?.androidVersion,
      iosVersion: generalSettingsData?.iosVersion,
    },
  });
  const formValues = watch();
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  // API
  const updateGeneralSettings = ApiHook.CallUpdateGeneralSettings();

  const toggleEditMode = () => setIsEditModeEnabled(!isEditModeEnabled);

  const onSubmit = () => {
    if (isEditModeEnabled) {
      const data = {
        androidVersion: formValues.androidVersion,
        iosVersion: formValues.iosVersion,
      };
      updateGeneralSettings.mutate(data, {
        onSuccess: (response) => {
          dispatch(setGeneralSettingsData(data));
        },
      });
    }
  };

  useEffect(() => {
    if (generalSettingsData) {
      setValue("androidVersion", generalSettingsData.androidVersion);
      setValue("iosVersion", generalSettingsData.iosVersion);
    }
  }, [generalSettingsData, setValue]);

  return (
    <div id="fourthTab" className="tabcontent">
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
      <h3>{t("appVersion")}</h3>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <div className="tabcontent_form_section">
        <div className="mb-3 row">
          <label htmlFor="androidVersion" className="col-sm-6 col-form-label">
            {t("Android")} ["va1","val2","val3"]
          </label>
          <div className="col-md-9">
            <input
              {...register("androidVersion")}
              defaultValue={generalSettingsData?.androidVersion}
              type="text"
              id="androidVersion"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.androidVersion && (
              <span className="validation-error-message">
                {errors.androidVersion.message}
              </span>
            )}
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="iosVersion" className="col-sm-6 col-form-label">
            {t("IOS")} ["va1","val2","val3"]
          </label>
          <div className="col-md-9">
            <input
              {...register("iosVersion")}
              defaultValue={generalSettingsData?.iosVersion}
              type="text"
              id="iosVersion"
              className="form-control"
              disabled={!isEditModeEnabled}
            />
            {errors.iosVersion && (
              <span className="validation-error-message">
                {errors.iosVersion.message}
              </span>
            )}
          </div>
        </div>
        <div
          className={`generalSettingsUpdateBtn ${
            isEditModeEnabled ? "disabled" : ""
          }`}
        >
          <SubmitButton
            isSubmitting={updateGeneralSettings.isLoading || !isEditModeEnabled}
            className="btn"
            text={updateGeneralSettings.isLoading ? "Updating..." : "Update"}
            click={onSubmit}
          />
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

const GeneralSettings = () => {
  const [activeTab, setActiveTab] = useState("generalInfo");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const generalSettingsData = useSelector(
    (state) => state.generalSettings?.generalSettingsData
  );
  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const getGeneralSettings = ApiHook.CallGetGeneralSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGeneralSettings.mutateAsync();
        dispatch(setGeneralSettingsData(response.data.result));
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "generalInfo", name: "generalInfo" },
    { id: "socialMediaLinks", name: "socialMediaLinks" },
    { id: "appLink", name: "appLink" },
    { id: "appVersion", name: "appVersion" },
  ];
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="page_head_top">{t("generalSettings")}</div>
      <div className="center_content_head">
        <span>{t("manageGeneralSettings")}</span>
      </div>
      <div className="profileTabSec">
        <div className="profileTabBg">
          <div className="tab">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tablinks ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {t(tab.name)}
              </button>
            ))}
          </div>
          {activeTab === "generalInfo" && <GeneralInfo />}
          {activeTab === "socialMediaLinks" && <SocialMediaLinks />}
          {activeTab === "appLink" && <AppLinks />}
          {activeTab === "appVersion" && <AppVersion />}
        </div>
      </div>
    </>
  );
};

export default GeneralSettings;
