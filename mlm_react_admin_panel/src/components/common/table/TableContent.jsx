import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Input, UncontrolledTooltip } from "reactstrap";

const renderActionButton = (row, rowIndex, type, onClick) => {
  // const renderActionButton = (type, row, rowIndex, action) => {
  let iconClass = "";
  let buttonClass = "";
  let tooltipText = "";

  switch (type) {
    case "edit":
      iconClass = "ri-edit-2-line align-bottom me-1";
      buttonClass = "link-success fs-15";
      tooltipText = "Edit";
      break;
    case "delete":
      iconClass = "ri-delete-bin-line align-bottom me-1";
      buttonClass = "link-danger fs-15";
      tooltipText = "Delete";
      break;
    case "view":
      iconClass = "ri-eye-line align-bottom me-1";
      buttonClass = "link-secondary fs-15";
      tooltipText = "View";
      break;
    case "updatePassword":
      iconClass = "ri-refresh-line align-bottom me-1";
      buttonClass = "link-danger fs-15";
      tooltipText = "Update Password";
      break;
  }

  return (
    <button
      // key={`${type}`}
      key={`${row?.id || rowIndex}-${type}`}
      onClick={() => onClick(row)}
      className="btn btn-sm"
      disabled={row.firstName === "SuperAdmin" ? true : false}
    >
      {/* <div className={buttonClass} id={`tooltip-${type}`}> */}
      <div className={buttonClass} id={`tooltip-${type}-${rowIndex}`}>
        <i className={iconClass}></i>
        <UncontrolledTooltip
          placement="bottom"
          // target={`tooltip-${type}`}
          target={`tooltip-${type}-${rowIndex}`}
        >
          {tooltipText}
        </UncontrolledTooltip>
      </div>
    </button>
  );
};

const TableContent = ({ headers, data, actions, rowRenderer }) => {
  const { t } = useTranslation();
  return (
    <div className="table-container">
      <table className="striped" style={{ width: "100%" }}>
        <thead>
          <tr key={"header"}>
            {headers?.map((header, index) => {
              return (
                <>
                  <th key={index} style={{ paddingRight: "5px" }}>
                    {t(header)}
                  </th>
                </>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <span className="table-td">{rowIndex + 1}</span>
              </td>
              {rowRenderer(row).map((cell, cellIndex) => (
                <td style={{ verticalAlign: "middle" }} key={cellIndex}>
                  <span className="table-td">{cell}</span>
                </td>
              ))}
              <td>
                <span className="table-td">
                  <div className="hstack gap-3">
                    {actions.map((action) =>
                      action.type === "status" ? (
                        <div
                          class="form-check form-switch form-switch-custom form-switch-success"
                          id="tooltipBottomStatus"
                        >
                          <Input
                            class="form-check-input"
                            type="checkbox"
                            onChange={() => action.onClick(row)}
                            role="switch"
                            id="flexSwitchCheckChecked"
                            checked={row.status === 1 ? true : false}
                            disabled = {row.firstName === "SuperAdmin" ? true : false}
                          ></Input>
                          <UncontrolledTooltip
                            placement="bottom"
                            target="tooltipBottomStatus"
                          >
                            {"status"}
                          </UncontrolledTooltip>
                        </div>
                      ) : (
                        renderActionButton(
                          row,
                          rowIndex,
                          action.type,
                          action.onClick
                        )
                      )
                    )}
                  </div>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContent;
