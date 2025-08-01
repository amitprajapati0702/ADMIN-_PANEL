import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const OptionsButtton = ({
  title,
  handleOpen,
  style,
  type,
  handleRequest,
  handleTransfer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const handleListOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <>
      <div
        className="dropdown btn-group top_right_pop_btn_position"
        ref={dropdownRef}
      >
        <Link
          className="top_righ_pop_btn"
          aria-controls="ewalletTrnsfer"
          onClick={handleOpen}
        >
          {t(title)}
        </Link>

        <div
          className={`dropdown-menu usr_prfl ${isOpen ? "show" : ""}`}
          style={style}
        ></div>
      </div>
    </>
  );
};

export default OptionsButtton;
