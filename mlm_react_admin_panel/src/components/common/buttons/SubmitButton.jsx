import React from "react";
import { useTranslation } from "react-i18next";
import Loader from "react-js-loader";

const SubmitButton = ({
  id,
  isSubmitting,
  click,
  text,
  className,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <button
        id={id}
        className={className}
        type="submit"
        disabled={isSubmitting}
        onClick={click}
      >
        {isLoading ? (
          <Loader
            type="bubble-scale"
            bgColor={"#ffffff"}
            color={"#954cea"}
            size={25}
          />
        ) : (
          <>{t(text)}</>
        )}
      </button>
    </>
  );
};

export default SubmitButton;
