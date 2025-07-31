import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Form, Input, Label, Row, Table } from "reactstrap";
import { ApiHook } from "../../redux/hooks/apiHook";
import SubmitButton from "../common/buttons/SubmitButton";
import { toast } from "react-toastify";

const features = ["List", "Add", "Edit", "View", "Status", "Delete"];

const formatString = (input) => {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

const RoleAddEditPage = () => {
  const { t } = useTranslation();
  const nevigate = useNavigate();
  const location = useLocation();
  const { isEdit, role } = location?.state || { isEdit: false, role: null };
  const handleBack = () => {
    nevigate("/role");
  };
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState();
  const [permissionsGrouped, setPermissionsGrouped] = useState({});
  const [permissionFeatureMatrix, setPermissionFeatureMatrix] = useState({});
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

  // API
  const getAllPermissionMutation = ApiHook.CallGetAllPermissions();
  const addRoleMutation = ApiHook.CallAddRole();
  const editRoleMutation = ApiHook.CallEditRole();

  useEffect(() => {
    if (getAllPermissionMutation.isSuccess) {
      setPermissions(getAllPermissionMutation?.data?.data?.result);
    }
  }, [getAllPermissionMutation.isSuccess]);

  useEffect(() => {
    if (permissions?.length > 0) {
      const grouped = {};
      permissions.forEach((perm) => {
        // Split codename into entity and action (default to "list" if no action)
        let [entity, action] = perm.codename.split("_");
        if (!action) {
          action = "list";
        }
        const actionLower = action.toLowerCase();
        if (!grouped[entity]) grouped[entity] = {};
        grouped[entity][actionLower] = perm.codename;
      });
      setPermissionsGrouped(grouped);
    }

    if (isEdit && role) {
      setRoleName(role.name);
      setDescription(role.description);
      const initialMatrix = {};
      const ids = [];
      role.permissions.forEach((perm) => {
        let [entity, action] = perm.codeName.split("_");
        if (!action) {
          action = "list";
        }
        const key = `${entity}-${action}`;
        initialMatrix[key] = true;
        ids.push(perm._id);
      });
      setPermissionFeatureMatrix(initialMatrix);
      setSelectedPermissionIds(ids);
    }
  }, [permissions, isEdit, role]);

  const toggleFeatureForPermission = (entity, action) => {
    const key = `${entity}-${action}`;
    const newMatrix = {
      ...permissionFeatureMatrix,
      [key]: !permissionFeatureMatrix[key],
    };
    setPermissionFeatureMatrix(newMatrix);

    // Find the permission object by codename
    const permissionObj = permissions?.find((perm) => {
      return perm?.codename === permissionsGrouped[entity]?.[action];
    });
    if (permissionObj) {
      if (newMatrix[key]) {
        setSelectedPermissionIds((prev) => [...prev, permissionObj._id]);
      } else {
        setSelectedPermissionIds((prev) =>
          prev.filter((id) => id !== permissionObj._id)
        );
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let data = {
        name: roleName,
        description: description,
        access: selectedPermissionIds,
      };

      if (isEdit) {
        data.id = role._id;
      }
      const response = isEdit
        ? await editRoleMutation.mutateAsync(data)
        : await addRoleMutation.mutateAsync(data);
      if (response?.success) {
        toast.success(response?.message, {
          autoClose: 2000,
        });
        nevigate("/role");
      } else {
        toast.error(response?.message, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(error?.message, {
        autoClose: 2000,
      });
      console.log("error", error);
    }
  };

  return (
    <>
      <Container fluid>
        <div className="center_content_head">
          <span>{t("addRole")}</span>
        </div>
        <div className="mainBodySection">
          <Row>
            <Col>
              <div className="mainRoleForm">
                <div>
                  <Row md={2} className="mb-3">
                    <div className="sm-6">
                      <Label htmlFor="roleName" className="form-label">
                        {t("roleName")}
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Enter Role Name"
                      />
                    </div>
                    <div className="sm-6">
                      <Label htmlFor="description" className="form-label">
                        {t("description")}
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                      />
                    </div>
                  </Row>
                  <div className="">
                    <Table className="fixed-header-table">
                      <thead style={{ backgroundColor: "#954cea" }}>
                        <tr style={{ color: "white" }}>
                          <th>Permission</th>
                          {features.map((feature) => (
                            <th key={feature}>{feature}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(permissionsGrouped).map(
                          ([entity, actions]) => (
                            <tr key={entity}>
                              <td>{formatString(`${entity}`)}</td>
                              {features.map((feature) => (
                                <td key={`${entity}-${feature}`}>
                                  {actions[feature.toLowerCase()] ? (
                                    <div className="form-check form-switch form-switch-success">
                                      <Input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                          permissionFeatureMatrix[
                                            `${entity}-${feature.toLowerCase()}`
                                          ] || false
                                        }
                                        onChange={() =>
                                          toggleFeatureForPermission(
                                            entity,
                                            feature.toLowerCase()
                                          )
                                        }
                                        role="switch"
                                        id={`flexSwitchCheckDefault-${entity}-${feature}`}
                                      />
                                    </div>
                                  ) : null}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex gap-2">
                    <div className={`submitBtn`}>
                      <SubmitButton
                        // isSubmitting={
                        //   updateGeneralSettings.isLoading || !isEditModeEnabled
                        // }
                        className="btn"
                        text={"Submit"}
                        click={handleSubmit}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-dark text-white rounded-3"
                      onClick={handleBack}
                    >
                      {t("back")}
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default RoleAddEditPage;
