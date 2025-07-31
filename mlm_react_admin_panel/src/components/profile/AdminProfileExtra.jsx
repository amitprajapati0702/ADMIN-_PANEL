import React, { useEffect, useState } from "react";
import { Offcanvas, Form, InputGroup } from "react-bootstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import SubmitButton from "../common/buttons/SubmitButton";
import { toast } from "react-toastify";
import { ApiHook } from "../../redux/hooks/apiHook";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

const AdminProfileExtra = ({ profile }) => {
  const { t } = useTranslation();
  const [isShowResetPasswordModal, setIsShowResetPasswordModal] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPasswordModal = () => {
    setIsShowResetPasswordModal(!isShowResetPasswordModal);
  };

  const [resetPasswordData, setResetPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    password: null,
    confirmPassword: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setResetPasswordData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Validate the field and set error message
    if (value.trim() === "") {
      setErrorMessage((prevErrors) => ({
        ...prevErrors,
        [id]: `${t(id)} is required`,
      }));
    } else {
      setErrorMessage((prevErrors) => ({
        ...prevErrors,
        [id]: null,
      }));
    }
  };

  const CallResetPassword = ApiHook.CallResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(resetPasswordData).forEach((key) => {
      if (resetPasswordData[key].trim() === "") {
        newErrors[key] = `${t(key)} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrorMessage(newErrors);
      return;
    }
    const data = {
      password: resetPasswordData.password,
      confirmPassword: resetPasswordData.confirmPassword,
    };

    const response = await CallResetPassword.mutateAsync(data);
    if (response.success === 1) {
      toast.success(response.message);
      setIsShowResetPasswordModal(!isShowResetPasswordModal);
      setErrorMessage({
        password: null,
        confirmPassword: null,
      });
      setResetPasswordData({
        password: "",
        confirmPassword: "",
      });
    } else {
      toast.error(response.message);
    }
    return;
  };

  return (
    <>
      <div id="animation" className="col-lg-9 col-md-12 border-prf-left">
        <div className="profDetailuserDtl">
          <div>
            <h5>{t("email")}</h5>
            {profile?.email ? (
              <p>{profile?.email}</p>
            ) : (
              <Skeleton width={200} />
            )}
          </div>
          <div>
            <h5>{t("resetPassword")}</h5>
            <p>*************</p>
            <div className="chngPassBtn">
              <button
                type="button"
                className="btn btn-change"
                data-bs-toggle="modal"
                onClick={handleResetPasswordModal}
                style={{ padding: "0px" }}
              >
                {t("resetPassword")}
              </button>
            </div>
          </div>
        </div>
        <div className="packageTypesNames">
          <div className="row">
            <div className="col-md-6">
              <div className="packageNames">
                <div className="RoleType">
                  <h5>{t("Role")}</h5>
                  {profile ? (
                    <p>{profile?.roleId?.name || "-"}</p>
                  ) : (
                    <Skeleton width={175} />
                  )}
                </div>
                <div className="fullNameType">
                  <h5>{t("fullName")}</h5>
                  {profile ? (
                    <p>{profile?.firstName + " " + profile?.lastName || "-"}</p>
                  ) : (
                    <Skeleton width={175} />
                  )}
                </div>
                <div className="fullNameType">
                  <h5>{t("Address")}</h5>
                  {profile?.address ? <p>{profile?.address}</p> : <Skeleton />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isShowResetPasswordModal}
        toggle={() => {
          setIsShowResetPasswordModal(!isShowResetPasswordModal);
          setErrorMessage({
            password: null,
            confirmPassword: null,
          });
          setResetPasswordData({
            password: "",
            confirmPassword: "",
          });
        }}
        centered
      >
        <ModalHeader
          toggle={() => {
            setIsShowResetPasswordModal(!isShowResetPasswordModal);
            setErrorMessage({
              password: null,
              confirmPassword: null,
            });
            setResetPasswordData({
              password: "",
              confirmPassword: "",
            });
          }}
        >
          {t("resetPassword")}
        </ModalHeader>
        <ModalBody>
          {/* <Form> */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("password")} *</Form.Label>
              <InputGroup>
              <Form.Control
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={`Enter ${t("password")}`}
                onChange={handleChange}
                value={resetPasswordData.password}
                isInvalid={!!errorMessage.password}
              />
              <InputGroup.Text>
                <IconButton
                  onClick={handleShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errorMessage.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("confirmPassword")} *</Form.Label>
              <InputGroup>
                <Form.Control
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={`Enter ${t("confirmPassword")}`}
                  onChange={handleChange}
                  value={resetPasswordData.confirmPassword}
                  isInvalid={!!errorMessage.confirmPassword}
                />
                <InputGroup.Text>
                  <IconButton
                    onClick={handleShowConfirmPassword}
                    onMouseDown={(e) => e.preventDefault()}
                    size="small"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputGroup.Text>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errorMessage.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </ModalBody>
        <ModalFooter>
          <SubmitButton
            text="submit"
            className={"btn btn-primary submit_btn"}
            click={(e) => handleSubmit(e)}
          />
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminProfileExtra;
