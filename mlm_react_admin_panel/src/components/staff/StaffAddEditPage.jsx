import React, { useEffect, useState } from "react";
import { Offcanvas, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SubmitButton from "../common/buttons/SubmitButton";
import { ApiHook } from "../../redux/hooks/apiHook";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const StaffAddEditPage = ({
  show,
  setShow,
  roles,
  currentAction,
  selectedStaffData,
  setPageToFirst,
}) => {
  const { t } = useTranslation();
  const [staffData, setStaffData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: roles.length > 0 ? roles[0].id : "",
    password: "",
    confirmPassword: "",
  });
  const [updatePasswordData, setUpdatePasswordData] = useState({
    originalPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    role: null,
    password: null,
    confirmPassword: null,
    originalPassword: null,
  });

  const roleOptions = roles.map((value, index) => {
    return (
      <option
        key={index}
        value={value._id}
        selected={
          currentAction === "edit" &&
          value._id === selectedStaffData.roleData[0]._id
        }
      >
        {value.name.length > 20
          ? `${value.name.substring(0, 20)}...`
          : value.name}
      </option>
    );
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleShowOriginalPassword = () => {
    setShowOriginalPassword(!showOriginalPassword);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (currentAction === "updatePassword") {
      setUpdatePasswordData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
      return;
    } else {
      setStaffData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

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

  const CallAddStaff = ApiHook.CallAddStaff();
  const CallEditStaff = ApiHook.CallEditStaff();
  const CallUpdatePassword = ApiHook.CallUpdatePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentAction === "updatePassword") {
      const newErrors = {};
      Object.keys(updatePasswordData).forEach((key) => {
        if (updatePasswordData[key].trim() === "") {
          newErrors[key] = `${t(key)} is required`;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrorMessage(newErrors);
        return;
      }
      const data = {
        originalPassword: updatePasswordData.originalPassword,
        password: updatePasswordData.password,
        confirmPassword: updatePasswordData.confirmPassword,
        adminId: selectedStaffData._id,
      };

      const response = await CallUpdatePassword.mutateAsync(data);
      if (response.success === 1) {
        toast.success(response.message);
        setShow(!show);
        setErrorMessage({
          password: null,
          confirmPassword: null,
          originalPassword: null,
        });
        setUpdatePasswordData({
          originalPassword: "",
          password: "",
          confirmPassword: "",
        });
        setPageToFirst();
      } else {
        toast.error(response.message);
      }
      return;
    }

    if (currentAction === "add" || currentAction === "edit") {
      // Validate all fields
      const newErrors = {};
      Object.keys(staffData).forEach((key) => {
        if (staffData[key].trim() === "") {
          newErrors[key] = `${t(key)} is required`;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrorMessage(newErrors);
        return;
      }

      let payload = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
      };

      if (currentAction === "add") {
        payload = {
          ...payload,
          phone: staffData.phone,
          email: staffData.email,
          role: staffData.role,
          password: staffData.password,
          confirmPassword: staffData.confirmPassword,
        };
      } else if (currentAction === "edit") {
        payload = {
          ...payload,
          roleId: staffData.role,
          adminId: selectedStaffData._id,
        };
      }

      // If no errors, submit the form
      const response =
        currentAction === "add"
          ? await CallAddStaff.mutateAsync(payload)
          : await CallEditStaff.mutateAsync(payload);
      if (response.success === 1) {
        toast.success(response.message);
        setShow(!show);
        setErrorMessage({
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
          role: null,
          password: null,
          confirmPassword: null,
        });
        setStaffData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: roles.length > 0 ? roles[0].id : "",
          password: "",
          confirmPassword: "",
        });
        setPageToFirst();
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    if (currentAction === "edit" || currentAction === "view") {
      if (selectedStaffData) {
        const newStaffData = {
          firstName: selectedStaffData.firstName,
          lastName: selectedStaffData.lastName,
          email: selectedStaffData.email,
          phone: selectedStaffData.phone,
          role: selectedStaffData.roleData[0]._id,
        };
        setStaffData(newStaffData);
      }
    }
  }, [selectedStaffData, currentAction]);

  return (
    <>
      {currentAction !== "updatePassword" ? (
        <Offcanvas
          show={show}
          onHide={() => {
            setShow(!show);
            setErrorMessage({
              firstName: null,
              lastName: null,
              email: null,
              phone: null,
              role: null,
              password: null,
              confirmPassword: null,
            });
            setStaffData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              role: roles.length > 0 ? roles[0].id : "",
              password: "",
              confirmPassword: "",
            });
          }}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {t(`${currentAction || "add"}Staff`)}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t("firstName")} *</Form.Label>
                <Form.Control
                  id="firstName"
                  type="text"
                  placeholder={`Enter ${t("firstName")}`}
                  onChange={handleChange}
                  value={staffData.firstName}
                  isInvalid={!!errorMessage.firstName}
                  disabled={currentAction === "view"}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("lastName")} *</Form.Label>
                <Form.Control
                  id="lastName"
                  type="text"
                  placeholder={`Enter ${t("lastName")}`}
                  onChange={handleChange}
                  value={staffData.lastName}
                  isInvalid={!!errorMessage.lastName}
                  disabled={currentAction === "view"}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.lastName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("email")} *</Form.Label>
                <Form.Control
                  id="email"
                  type="text"
                  placeholder={`Enter ${t("email")}`}
                  onChange={handleChange}
                  value={staffData.email}
                  isInvalid={!!errorMessage.email}
                  disabled={currentAction === "view"}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("phone")} *</Form.Label>
                <Form.Control
                  id="phone"
                  type="text"
                  placeholder={`Enter ${t("phone")}`}
                  onChange={handleChange}
                  maxLength="10"
                  value={staffData.phone}
                  isInvalid={!!errorMessage.phone}
                  disabled={currentAction === "view"}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessage.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("role")} *</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setStaffData({ ...staffData, role: e.target.value })
                  }
                  isInvalid={!!errorMessage.role}
                  disabled={currentAction === "view"}
                >
                  {currentAction === "view" ? (
                    <option
                      value={selectedStaffData?.roleData[0]?._id || ""}
                      selected
                    >
                      {selectedStaffData?.roleData[0]?.name || ""}
                    </option>
                  ) : (
                    <>
                      <option value="" defaultChecked>
                        Select
                      </option>
                      {roleOptions}
                    </>
                  )}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errorMessage.role}
                </Form.Control.Feedback>
              </Form.Group>
              {currentAction === "add" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("password")} *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={`Enter ${t("password")}`}
                        onChange={handleChange}
                        value={staffData.password}
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
                        type={showPassword ? "text" : "password"}
                        placeholder={`Enter ${t("confirmPassword")}`}
                        onChange={handleChange}
                        value={staffData.confirmPassword}
                        isInvalid={!!errorMessage.confirmPassword}
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
                      {errorMessage.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
              {currentAction === "view" ? null : (
                <SubmitButton
                  text="submit"
                  className={"btn btn-primary submit_btn"}
                />
              )}
            </Form>
          </Offcanvas.Body>
        </Offcanvas>
      ) : (
        <Modal
          isOpen={show}
          toggle={() => {
            setShow(!show);
            setErrorMessage({
              password: null,
              confirmPassword: null,
              originalPassword: null,
            });
            setUpdatePasswordData({
              originalPassword: "",
              password: "",
              confirmPassword: "",
            });
          }}
          centered
        >
          <ModalHeader
            toggle={() => {
              setShow(!show);
              setErrorMessage({
                password: null,
                confirmPassword: null,
                originalPassword: null,
              });
              setUpdatePasswordData({
                originalPassword: "",
                password: "",
                confirmPassword: "",
              });
            }}
          >
            {t("updatePassword")}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t("originalPassword")} *</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="originalPassword"
                    type={showOriginalPassword ? "text" : "password"}
                    placeholder={`Enter ${t("originalPassword")}`}
                    onChange={handleChange}
                    value={updatePasswordData.originalPassword}
                    isInvalid={!!errorMessage.originalPassword}
                  />
                  <InputGroup.Text>
                    <IconButton
                      onClick={handleShowOriginalPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showOriginalPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errorMessage.originalPassword}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("password")} *</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={`Enter ${t("password")}`}
                    onChange={handleChange}
                    value={updatePasswordData.password}
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
                    value={updatePasswordData.confirmPassword}
                    isInvalid={!!errorMessage.confirmPassword}
                  />
                  <InputGroup.Text>
                    <IconButton
                      onClick={handleShowConfirmPassword}
                      onMouseDown={(e) => e.preventDefault()}
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
      )}
    </>
  );
};

export default StaffAddEditPage;
