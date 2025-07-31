import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Popover, OverlayTrigger } from "react-bootstrap";
import { ApiHook } from "../../redux/hooks/apiHook";
import { useTranslation } from "react-i18next";
import logo_user from "../../assets/images/logo_user.png";
// import shopping_cart_white_old.svg from "../../assets/images/shopping-cart-white_old.svg";
import shopping_cart_white_old from "../../assets/images/shopping-cart-white_old.svg";

// import menuPlaceHolder from "../../examples/dashboardMenu.json";
const LeftSection = ({
  isLeftMenuVisible,
  handleLeftMenuToggle,
  menus,
  spclMenu,
  toggleMenuRef,
  logo,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(-1);
  const [registerLinkCheck, setRegisterLinkCheck] = useState(false);
  const [storeLinkCheck, setStoreLinkCheck] = useState(false);
  const location = useLocation();
  const menuItems = menus;

  const handleDropMenuClick = (index) => {
    if (activeSubMenuIndex === index) {
      setActiveSubMenuIndex(-1); // Close the submenu if it's already open
    } else {
      setActiveSubMenuIndex(index); // Open the clicked submenu
    }
  };
  const renderPopover = (
    content // popover the tilte in Menu
  ) => (
    <Popover>
      <Popover.Body>{content}</Popover.Body>
    </Popover>
  );
  const islinkActive = (link) => {
    if (link === "/networks") {
      return location.pathname === "/sponsor-tree" ||
        location.pathname === "/genealogy-tree" ||
        location.pathname === "/tree-view" ||
        location.pathname === "/downline-members" ||
        location.pathname === "/referral-members"
        ? "active"
        : "";
    } else if (location.pathname === link) {
      return "active";
    }
  };
  // ----------------------------- Api Call for Ecom Link ----------------------
  // const registerLink = ApiHook.CallRegisterLink(
  //   registerLinkCheck,
  //   setRegisterLinkCheck
  // );
  // if (registerLink.isFetched) {
  //   window.location.href = registerLink.data?.link;
  // }
  // const storeLink = ApiHook.CallStoreLink(storeLinkCheck, setStoreLinkCheck);
  // if (storeLink.isFetched) {
  //   window.location.href = storeLink.data?.link;
  // }
  const handleRegisterNavigation = (slug) => {
    if (slug === "register" && location.pathname.startsWith("/register")) {
      // Preserve the current query parameters      
      return `${location.pathname}${location.search}`;
    }
    
    // For other routes, navigate normally
    return `/${slug}`;
  };

  return (
    <aside className="left_sidebar">
      <div className="left_mn_toogle_btn" data-tut="expand-side-menu"></div>
      <div
        ref={toggleMenuRef}
        className={`left_navigation_full_hover ${
          isLeftMenuVisible ? "show_mn" : ""
        }`}
      >
        <div
          className="left_mn_toogle_btn"
          onClick={handleLeftMenuToggle}
        ></div>
        <div className="quick_balance_Box_left_logo">
          <img style={{ maxWidth:"200px", maxHeight:"44px"}} src={logo ?? logo_user} alt="" />
        </div>
        <div className="left_navigation_left_navigation">
          <ul>
            {menuItems?.map((item, index) => (
              <li
                key={index}
                className={`${
                  item.subMenu?.length > 0 ? "drop-menu" : ""
                } ${islinkActive(`/${item.slug}`)}`}
                onClick={() => handleDropMenuClick(index)}
              >
                {item?.subMenu?.length > 0 ? (
                  <>
                    <span className="navigation_ico">
                      <img src={require(`../../assets/images/${item.userIcon}`)} alt="" />
                    </span>
                    {t(`${item.slug}`)}
                    {item.subMenu?.length > 0 && (
                      <i className="fa fa-angle-down"></i>
                    )}
                  </>
                ) : !item.ecomLink ? (
                  <NavLink to={`/${item.slug}`}>
                    <span className="navigation_ico">
                      <img src={require(`../../assets/images/${item.userIcon}`)} alt="" />
                    </span>
                    {t(`${item.slug}`)}
                    {item.subMenu?.length > 0 && (
                      <i className="fa fa-angle-down"></i>
                    )}
                  </NavLink>
                ) : item.slug === "shopping" ? (
                  <Link onClick={() => setStoreLinkCheck(true)}>
                    <span className="navigation_ico">
                      <img src={require(`../../assets/images/${item.userIcon}`)} alt="" />
                    </span>
                    {t(`${item.slug}`)}
                  </Link>
                ) : (
                  <Link onClick={() => setRegisterLinkCheck(true)}>
                    <span className="navigation_ico">
                      <img src={require(`../../assets/images/${item.userIcon}`)} alt="" />
                    </span>
                    {t(`${item.slug}`)}
                  </Link>
                )}
                {item?.subMenu?.length > 0 && (
                  <ul
                    className={`sub-menu ${
                      activeSubMenuIndex === index ? "show_mn" : ""
                    }`}
                  >
                    {item?.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink to={`/${subItem.slug}`}>
                          {t(`${subItem.slug}`)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <nav className="left_navigation_section" data-tut="side-navbar" id="tuto2">
        <ul className="left_navigation">
          {menuItems?.map((menuItem, index) =>
            // menuItem.isMain && !menuItem.ecomLink ? (
              <li key={index}>
                <OverlayTrigger
                  key={menuItem.slug}
                  trigger={["hover", "focus"]}
                  placement="right"
                  overlay={renderPopover(t(`${menuItem.slug}`))}
                >
                  <NavLink
                    className={islinkActive(`/${menuItem.slug}`)}
                    to={handleRegisterNavigation(menuItem.slug)}
                  >
                    <i>
                      <img src={require(`../../assets/images/${menuItem.userIcon}`)} alt="" />
                    </i>
                    <span>{menuItem.title}</span>
                  </NavLink>
                </OverlayTrigger>
              </li>
            // ) : (
            //   menuItem.ecomLink &&
            //   menuItem.isMain && (
            //     <li key={index}>
            //       <OverlayTrigger
            //         key={menuItem.slug}
            //         trigger={["hover", "focus"]}
            //         placement="right"
            //         overlay={renderPopover(t(`${menuItem.slug}`))}
            //       >
            //         <Link onClick={() => setRegisterLinkCheck(true)}>
            //           <i>
            //             <img src={require(`../../assets/images/${menuItem.userIcon}`)} alt="" />
            //           </i>
            //           <span>{menuItem.title}</span>
            //         </Link>
            //       </OverlayTrigger>
            //     </li>
            //   )
            // )
          )}
        </ul>
        {/* {spclMenu &&
          (spclMenu?.ecomLink ? (
            <div
              className="support_menu_btn"
              onClick={() => setStoreLinkCheck(true)}
            >
              <img
                src={
                  spclMenu.slug === "shopping"
                    ? shopping_cart_white_old
                    : require(`../../assets/images/${spclMenu?.userIcon}`)
                }
                alt=""
              />
            </div>
          ) : (
            <div
              className="support_menu_btn"
              onClick={() => navigate("/shopping")}
            >
              <img
                src={
                  spclMenu.slug === "shopping"
                    ? shopping_cart_white_old
                    : require(`../../assets/images/${spclMenu?.userIcon}`)
                }
                alt=""
              />
            </div>
          ))} */}
      </nav>
    </aside>
  );
};

export default LeftSection;
