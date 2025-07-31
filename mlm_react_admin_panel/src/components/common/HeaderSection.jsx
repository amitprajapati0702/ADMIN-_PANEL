import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setIsAuthenticated, setLoginResponse, updateConversionFactors } from "../../redux/reducers/adminReducer";
import { useDispatch, useSelector } from "react-redux";
import { ApiHook } from "../../redux/hooks/apiHook";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formateDate";
import Skeleton from "react-loading-skeleton";
import { useQueryClient } from "@tanstack/react-query";
import user_logo from "../../assets/images/logo_user.png";
import mail_icon from "../../assets/images/mail_ico.svg";
import notification_icon from "../../assets/images/notification_ico.svg";
import user_icon from "../../assets/images/user-profile.png";
import no_data_icon from "../../assets/images/nodata-image.png";

const HeaderSection = ({
  count,
  handleLeftMenuToggle,
  adminName,
  appLayout,
  toggleMobileRef,
}) => {
  // const queryClient = useQueryClient();
  // const [unreadCount, setUnreadCount] = useState(
  //   count !== undefined ? count : 0
  // );
  // const userSelectedCurrency = useSelector(
  //   (state) => state.user?.selectedCurrency
  // );
  // const userSelectedLanguage = useSelector(
  //   (state) => state.user?.selectedLanguage
  // );
  // const mailUnreadCount = useSelector((state) => state.mail.unReadCount);
  // const [notificationCheck, setNotificationCheck] = useState(false);
  // const moduleStatus = appLayout?.moduleStatus;
  const [dropdownOpen, setDropdownOpen] = useState({
    // currency: false,
    // country: false,
    // notification: false,
    admin: false,
  });
  // const [selectedCurrency, setSelectedCurrency] = useState({
  //   id: null,
  //   symbolLeft: null,
  //   code: null,
  //   value: null,
  // });
  // const [selectedLanguage, setSelectedLanguage] = useState({
  //   id: null,
  //   flagImage: null,
  //   code: null,
  //   name: null,
  // });

  // // API CALLS
  // // const logoutMutation = ApiHook.CallLogout();
  // const updateCurrencyMutation = ApiHook.CallCurrencyUpdation({
  //   selectedCurrency,
  // });
  // const updateLanguageMutation = ApiHook.CallLanguageUpdation({
  //   selectedLanguage,
  // });
  // const notificationData = ApiHook.CallNotificationData(
  //   notificationCheck,
  //   setNotificationCheck
  // );
  // const readAllNotification = ApiHook.CallReadAllNotification();
  // const readNotificationMutation = ApiHook.CallReadNotification();

  // const dropdownCurrencyRef = useRef(null);
  // const dropdownCountryRef = useRef(null);
  // const dropdownNotificationRef = useRef(null);
  const dropdownUserRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleDropdown = (dropdown) => {
    // if (dropdown === "notification") {
    //   setNotificationCheck(true);
    // }
    setDropdownOpen((prevState) => ({
      // currency: dropdown === "currency" ? !prevState.currency : false,
      // country: dropdown === "country" ? !prevState.country : false,
      // notification:
      //   dropdown === "notification" ? !prevState.notification : false,
      admin: dropdown === "admin" ? !prevState.admin : false,
    }));
  };
  useEffect(() => {
    if (location.pathname) {
      setDropdownOpen(false);
    }
    const handleOutsideClick = (event) => {
      const dropdownRefs = [
        // dropdownCurrencyRef,
        // dropdownCountryRef,
        // dropdownNotificationRef,
        dropdownUserRef,
      ];
      const isClickInsideDropdown = dropdownRefs.some(
        (ref) => ref.current && ref.current.contains(event.target)
      );
      if (!isClickInsideDropdown) {
        setDropdownOpen({
          // currency: false,
          // country: false,
          // notification: false,
          admin: false,
        });
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [location.pathname]);

  // const dropdownCurrencies = appLayout?.currencies;

  // const dropdownCountries = appLayout?.languages;

  const handleLogout = async () => {
    dispatch(setLoginResponse(null));
    dispatch(setIsAuthenticated(false));
    localStorage.clear();
    navigate("/login");
    // logoutMutation.mutate();
  };

  // const changeCurrency = (currency) => {
  //   const newCurrency = {
  //     currencyId: currency?.id.toString(),
  //   };
  //   setSelectedCurrency({
  //     id: currency?.id,
  //     symbolLeft: currency?.symbolLeft,
  //     value: currency?.value,
  //     code: currency?.code,
  //   });
  //   updateCurrencyMutation.mutateAsync(newCurrency);

  //   // update conversionFactor
  //   dispatch(updateConversionFactors(currency));
  //   setDropdownOpen({ currency: false });
  // };
  // const changeLanguage = (language) => {
  //   const newLanguage = { langId: language?.id.toString() };
  //   setSelectedLanguage({
  //     id: language?.id,
  //     flagImage: language?.flagImage,
  //     code: language?.code,
  //     name: language?.name,
  //   });
  //   updateLanguageMutation.mutateAsync(newLanguage);
  //   setDropdownOpen({ country: false });
  //   i18n.changeLanguage(language?.code);
  // };
  // const handleReadAll = () => {
  //   readAllNotification.mutateAsync(null, {
  //     onSuccess: (res) => {
  //       if (res?.status) {
  //         notificationData.data.data = [];
  //       }
  //     },
  //   });
  // };
  // const readSingleNotification = (id) => {
  //   // const payload = { id : id};
  //   readNotificationMutation.mutateAsync(id, {
  //     onSuccess: (res) => {
  //       if (res?.status) {
  //         setUnreadCount((prevCount) => prevCount - 1);
  //         setNotificationCheck(true);
  //         queryClient.invalidateQueries({ queryKey: ["notification-data"] });
  //       }
  //     },
  //   });
  // };
  // useEffect(() => {
  //   if (count !== undefined) {
  //     setUnreadCount(count);
  //   }
  // }, [count]);

  return (
    <header className="header_section">
      <div className="row">
        <div className="col-md-4 col-6">
          <div className="leftLogo_section">
            <div
              ref={toggleMobileRef}
              className="left_mn_toggle_btn left_mn_toogle_btn"
              onClick={handleLeftMenuToggle}
            >
              <i className="fa-solid fa-bars"></i>
            </div>
            <Link to={"/dashboard"}>
              <img
                src={appLayout?.companyProfile?.logo ?? user_logo}
                onClick={() => navigate("/dashboard")}
                alt=""
              />
            </Link>
          </div>
        </div>
        <div className="col-md-8 col-6">
          <div className="right_notiifcation_mail_ico_sec">
            {/* {moduleStatus?.multi_currency_status === 1 && (
              <div
                className={`right_notiifcation_mail_ico top_dropdown currency_dropdown ${
                  dropdownOpen.currency ? "show" : ""
                }`}
                ref={dropdownCurrencyRef}
              >
                <a
                  className="dropdown-toggle"
                  onClick={() => toggleDropdown("currency")}
                  data-bs-toggle="dropdown"
                  aria-expanded={dropdownOpen.currency}
                >
                  <span className="currency_top_slctd">
                    {userSelectedCurrency?.symbolLeft}
                  </span>
                </a>
                <div
                  className={`dropdown-menu usr_prfl right-0 animation slideDownIn ${
                    dropdownOpen.currency ? "show" : ""
                  }`}
                >
                  <div className="usr_prfl_setting">{t("currency")}</div>
                  <ul className="">
                    {dropdownCurrencies?.map((item, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          onClick={() => changeCurrency(item)}
                        >
                          <span>{item.symbolLeft}</span> {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {moduleStatus?.multilang_status === 1 && (
              <div
                className={`right_notiifcation_mail_ico top_dropdown country_dropdown ${
                  dropdownOpen.country ? "show" : ""
                }`}
                ref={dropdownCountryRef}
              >
                <a
                  className="dropdown-toggle"
                  onClick={() => toggleDropdown("country")}
                  data-bs-toggle="dropdown"
                  aria-expanded={dropdownOpen.country}
                >
                  <img src={`/${userSelectedLanguage?.flagImage}`} alt="" />
                </a>
                <div
                  className={`dropdown-menu usr_prfl right-0 animation slideDownIn ${
                    dropdownOpen.country ? "show" : ""
                  }`}
                >
                  <div className="usr_prfl_setting">{t("language")}</div>
                  <ul className="">
                    {dropdownCountries?.map((item, index) => (
                      <li key={index}>
                        <a
                          className="dropdown-item"
                          onClick={() => changeLanguage(item)}
                        >
                          <img src={`/${item?.flagImage}`} alt="" /> {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )} */}
            <div className="right_notiifcation_mail_ico">
              <Link to="/mailbox">
                <img src={mail_icon} alt="" />
              </Link>
              {/* {!!mailUnreadCount && mailUnreadCount !== 0 && (
                <div className="notification_count">{mailUnreadCount}</div>
              )} */}
            </div>
            {/* <div
              className={`right_notiifcation_mail_ico ${
                dropdownOpen.notification ? "show" : ""
              }`}
              ref={dropdownNotificationRef}
            >
              <a
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded={dropdownOpen.notification}
                onClick={() => toggleDropdown("notification")}
              >
                <img src={notification_icon} alt="" />
              </a>
              {count !== 0 && (
                <div className="notification_count">{unreadCount}</div>
              )}
              <div
                className={`dropdown-menu notification_list right-0 animation slideDownIn ${
                  dropdownOpen.notification ? "show" : ""
                }`}
              >
                <div className="notification_list_head">
                  {t("notifications")}
                  <i
                    className="fa-solid fa-check-double"
                    onClick={handleReadAll}
                  ></i>
                </div>
                <ul className="notification_list_box">
                  {!notificationData?.data?.data ? (
                    <div className="teammbrs_cnt_row">
                      <div className="teammbrs_cnt_img">
                        <Skeleton
                          circle
                          width="45px"
                          height="45px"
                          containerClassName="avatar-skeleton"
                          count={2}
                        />
                      </div>
                      <div className="teammbrs_cnt_name_dtl">
                        <div className="teammbrs_cnt_name">
                          <Skeleton count={4} />
                        </div>
                      </div>
                    </div>
                  ) : notificationData?.data?.data?.length === 0 ? (
                    <li className="no-data-div">
                      <div className="no-data-div-image">
                        <img src={no_data_icon} alt="" />
                      </div>
                      <p>{t("noDataFound")}</p>
                    </li>
                  ) : (
                    notificationData?.data?.data.map((notification) => (
                      <li
                        key={notification.request_id}
                        onClick={() => {
                          readSingleNotification(notification.id);
                        }}
                      >
                        <Link className="dropdown-item" href="#">
                          <span className="notifc_module">
                            <img src={notification?.image} alt="" />
                          </span>
                          {t(notification?.title)}
                          <span>{formatDate(notification?.date)}</span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div> */}
            <div
              className={`right_notiifcation_mail_ico user_avatar ${
                dropdownOpen.admin ? "show" : ""
              }`}
              ref={dropdownUserRef}
            >
              <a
                data-tut="profile"
                className="dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded={dropdownOpen.admin}
                onClick={() => toggleDropdown("admin")}
              >
                <img
                  src={
                    appLayout?.admin?.image ? appLayout?.admin?.image : user_icon
                  }
                  alt=""
                />
              </a>
              <div
                className={`dropdown-menu usr_prfl right-0 animation slideDownIn ${
                  dropdownOpen.admin ? "show" : ""
                }`}
              >
                <div className="usr_prfl_setting">{adminName}</div>
                <ul className="">
                  <li key="profile">
                    <Link to={"/profile"} className="dropdown-item">
                      {t("profile")}
                    </Link>
                  </li>
                  <li key="logout">
                    <Link className="dropdown-item" onClick={handleLogout}>
                      {t("logout")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
