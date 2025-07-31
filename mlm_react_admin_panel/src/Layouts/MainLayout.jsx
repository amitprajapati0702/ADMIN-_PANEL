import { React, useEffect, useRef, useState } from "react";
import FooterSection from "../components/common/Footer";
import LeftSection from "../components/common/LeftSection";
import HeaderSection from "../components/common/HeaderSection";
import { Outlet, useLocation } from "react-router";
// import RightContentSection from "../components/Dashboard/RightContent";
import layoutAnimation from "../utils/layoutAnimation";
import { NavLink } from "react-router-dom";
// import ShoppingCart from "../components/shopping/ShoppingCart";
import { ApiHook } from "../redux/hooks/apiHook";
// import VisitersForm from "../components/common/modals/VisitersForm";
// import Cookies from "js-cookie";
import '../styles/custom.css'
import { useDispatch, useSelector } from "react-redux";
import MobileFooter from "../components/common/MobileFooter";
import { useTranslation } from "react-i18next";
// import { demoVisitorAdded } from "../redux/reducers/adminReducer";
import i18n from "../i18n";

const MainLayout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLeftMenuVisible, setIsLeftMenuVisible] = useState(false);
  
  const dropdownRef = useRef(null);
  const toggleMenuRef = useRef(null);
  const toggleMobileRef = useRef(null);
  const containerRef = useRef(null);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [demoFormVisible, setDemoFormVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [dashboardCheck, setDashboardCheck] = useState(false);
  const location = useLocation();

  const appLayout = ApiHook.CallAppLayout();
  // const rightSection = ApiHook.CallDashboardRight(
  //   dashboardCheck,
  //   setDashboardCheck
  // );
  // const checkDemoUser = ApiHook.CallCheckIsPresent();
  const adminData = useSelector((state)=> state?.admin?.profile?.data);
  // const adminData = localStorage.getItem("admin");
  const userLang = useSelector((state)=> state.admin?.selectedLanguage)

  useEffect(() => {
    // Update i18n language if savedLanguage exists
    if (userLang && userLang.code) {
      i18n.changeLanguage(userLang.code);
    }
  }, [userLang]);

  const handleLeftMenuToggle = () => {
    setIsLeftMenuVisible(!isLeftMenuVisible);
  };
  const handleQuickMenuToggle = () => {
    setIsQuickMenuOpen(!isQuickMenuOpen);
  };
  useEffect(() => {
    if (location.pathname) {
      setIsQuickMenuOpen(false);
      setIsLeftMenuVisible(false);
    }
    if (location.pathname === "/dashboard") {
      setDashboardCheck(true);
    }
    layoutAnimation(location, containerRef);
    // const handleOutsideClick = (event) => {
    //   if (!dropdownRef.current.contains(event.target)) {
    //     setIsQuickMenuOpen(false);
    //   }
    //   if (
    //     !(
    //       toggleMenuRef.current.contains(event.target) ||
    //       toggleMobileRef.current.contains(event.target)
    //     )
    //   ) {
    //     setIsLeftMenuVisible(false);
    //   }
    // };

    // document.addEventListener("click", handleOutsideClick);

    // return () => {
    //   document.removeEventListener("click", handleOutsideClick);
    // };
  }, [location.pathname]);
  
 
  return (
    <>
      <div className={`${isLeftMenuVisible ? "left_menu_show" : ""}`}>
        <main
          className={
            location.pathname === "/dashboard" ? "dashboard_main_dv" : "main_dv"
          }
        >
          <section className="left_content_section">
            <HeaderSection
              // count={appLayout?.data?.notificationCount}
              handleLeftMenuToggle={handleLeftMenuToggle}
              adminName={adminData?.firstName}
              appLayout={appLayout?.data}
              toggleMobileRef={toggleMobileRef}
            />
            <LeftSection
              isLeftMenuVisible={isLeftMenuVisible}
              handleLeftMenuToggle={handleLeftMenuToggle}
              menus={appLayout?.data?.menu?.sideMenus}
              spclMenu={appLayout?.data?.menu?.spclMenu}
              toggleMenuRef={toggleMenuRef}
              logo={appLayout?.data?.companyProfile?.logo}
            />
            <div
              ref={containerRef}
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div data-tut="main-layout" className="center_Content_section">
                <Outlet />
              </div>
            </div>
            {location.pathname === "/dashboard" && <FooterSection />}
          </section>
          {/* {location.pathname === "/dashboard" && (
            <section data-tut="rightSection" className="right_content_section">
              <RightContentSection props={rightSection?.data} />
            </section>
          )} */}
        </main>
        {location.pathname !== "/dashboard" && <FooterSection />}
        <div className="float_menu_btm" ref={dropdownRef}>
          <button
            className={`dropdown-toggle ${isQuickMenuOpen ? "show" : ""}`}
            onClick={handleQuickMenuToggle}
            aria-expanded={isQuickMenuOpen}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          {isQuickMenuOpen && (
            <div
              className="dropdown-menu usr_prfl right-0 show"
              style={{
                position: "fixed",
                inset: "auto 0px 0px auto",
                margin: "0px",
                transform: "translate(-50px, -102px)",
              }}
              data-popper-placement="top-end"
            >
              <ul>
                {appLayout?.data?.menu?.quickMenus.map((menuItem, index) => (
                  <li key={index}>
                    <NavLink
                      to={`/${menuItem.slug}`}
                      className={`dropdown-item ${({ isActive }) =>
                        isActive ? "active" : ""}`}
                    >
                      <i className={`${menuItem.quickIcon}`}></i>{" "}
                      {t(menuItem.slug)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* {(location.pathname === "/shopping" ||
          location.pathname === "/product-details") && <ShoppingCart isLeftMenuVisible={isLeftMenuVisible}/>} */}
      </div>
      <MobileFooter
        menus={appLayout?.data?.menu?.sideMenus}
      />
      {/* <VisitersForm
        isVisible={demoFormVisible}
        setIsVisible={setDemoFormVisible}
        countries={countries}
      /> */}
    </>
  );
};

export default MainLayout;
