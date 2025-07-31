import React, { useEffect, useState } from "react";
// import QuickBalance from "../../components/Dashboard/DashboardTiles";
// import JoiningChart from "../../components/Dashboard/JoiningChart";
// import TeamMembers from "../../components/Dashboard/TeamMembers";
// import TeamMembersEarningSection from "../../components/Dashboard/TeamPerformance";
// import EarningsExpenses from "../../components/Dashboard/Earnings";
// import { ApiHook } from "../../redux/hooks/apiHook";
// import { useDispatch, useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import RankComponent from "../../components/Dashboard/RankComponent";
// import { updateTourOpen } from "../../redux/reducers/adminReducer";
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";

const Dashboard = () => {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const user = useSelector(
  //   (state) => state.dashboard?.appLayout?.user
  // );
  // const joiningChartData = useSelector(
  //   (state) => state.dashboard?.dashboardOne
  // );
  // const userSelectedCurrency = useSelector(
  //   (state) => state.user?.selectedCurrency
  // );
  // const conversionFactor = useSelector(
  //   (state) => state?.user?.conversionFactor
  // );
  // const moduleStatus = useSelector(
  //   (state) => state.dashboard?.appLayout?.moduleStatus
  // );
  // const isTourOpen = useSelector(
  //   (state) => state.user?.isTourOpen
  // );
  // const isDemoVisitor = useSelector(
  //   (state) => state.user?.isDemoVisitor
  // );
  // const [isMobileView, setIsMobileView] = useState(false);
  // const [isTourClosed, setIsTourClosed] = useState(false);
  // // --------------------------------------------- API -------------------------------------------------
  // const dashboard = ApiHook.CallDashboardTiles();
  // const dashboardDetails = ApiHook.CallDashboardDetails();
  // const endTutorialMutation = ApiHook.CallEndTutorial(setIsTourClosed);

  // const closeTour = () => {
  //   driverObj.destroy();
  //   localStorage.setItem("tutorial","1");
  //   dispatch(updateTourOpen(false));
  //   if (!isTourClosed) {
  //     endTutorialMutation.mutateAsync();
  //   }
  // };

  // useEffect(() => {
  //   // Function to check if mobile view
  //   const checkMobileView = () => {
  //     setIsMobileView(window.innerWidth <= 768); // Assuming 768px as mobile breakpoint
  //   };

  //   // Call the function on initial load
  //   checkMobileView();

  //   // Add event listener to update view on window resize
  //   window.addEventListener("resize", checkMobileView);

  //   // Cleanup the event listener on component unmount
  //   return () => window.removeEventListener("resize", checkMobileView);
  // }, []);

  // useEffect(() => {
  //   if (isTourOpen.status && isDemoVisitor && localStorage?.getItem("tutorial") === "0") {
  //     setTimeout(() => {
  //       driverObj.drive();
  //     }, 1000)
  //   }
  // }, [isTourOpen, isDemoVisitor])

  // const steps = [
  //   {
  //     element: '[data-tut="dashboardTiles"]',
  //     popover: {
  //       description: t('tutorialStep1'),
  //       side: "right"
  //     }
  //   },
  //   {
  //     element: '[data-tut="rightSection"]',
  //     popover: {
  //       description: t('tutorialStep2'),
  //       side: "left"
  //     }
  //   },
  //   {
  //     element: isMobileView ? '[data-tut="mobile-navbar"]' : '[data-tut="side-navbar"]',
  //     popover: {
  //       description: t('tutorialStep3'),
  //       side: "right"
  //     }
  //   },
  //   ...(isMobileView ? [] : [
  //     {
  //       element: '[data-tut="expand-side-menu"]',
  //       popover: {
  //         description: t('tutorialStep4'),
  //         side: "right"
  //       }
  //     }
  //   ]),
  //   {
  //     element: '[data-tut="profile"]',
  //     popover: {
  //       description: t('tutorialStep5'),
  //       side: "bottom"
  //     }
  //   },
  //   // {
  //   //   popover: {
  //   //     description: t('tutorialStep6'),
  //   //     side:"top"
  //   //   }
  //   // }
  // ];

  // const driverObj = driver({
  //   nextBtnText: '→',
  //   prevBtnText: '←',
  //   doneBtnText: t('close'),
  //   allowClose: false,
  //   animate: false,
  //   showProgress: true,
  //   progressText: "{{current}}",
  //   onDestroyed: closeTour,
  //   onPopoverRender: (popover, { config, state }) => {
  //     const isLastStep = state.activeIndex === config.steps.length - 1;
  //     const popoverElements = document.getElementsByClassName('driver-popover');
  //     const expandIcon = document.getElementsByClassName('driver-popover-footer');

  //     if (state.activeIndex === 1 && popoverElements.length > 0) {
  //       const popoverElement = popoverElements[0];
  //       popoverElement.style.marginTop = '20px';
  //     }
  //     if (state.activeIndex === 3 && expandIcon.length > 0) {
  //       const expandElement = expandIcon[0];
  //       expandElement.style.marginBottom = '12px';
  //     }
  //     if (!isLastStep) {
  //       const skipButton = document.createElement("button");
  //       skipButton.innerText = "skip";
  //       popover.footerButtons.appendChild(skipButton);

  //       skipButton.addEventListener("click", () => {
  //         driverObj.destroy();
  //       });
  //     }
  //   },
  //   showButtons: ["next", "previous", "close"],
  //   steps: steps
  // });



  return (
    <>
      {/* <div data-tut="dashboard" className="page_head_top">{t("dashboard")}</div>
      <div className="center_content_head">
        <span>
          {t("welcome")} {user?.name}{" "}
        </span>
      </div>
      <QuickBalance
        tiles={dashboard?.data}
        currency={userSelectedCurrency}
        conversionFactor={conversionFactor}
      />
      <div className="joining_Teammbr_section">
        <div className="row">
          <JoiningChart charts={joiningChartData} />
          <TeamMembers members={dashboardDetails?.data?.newMembers} />
        </div>
      </div>
      <div className="team_members_earning_section">
        <div className="row">
          <TeamMembersEarningSection
            topEarners={dashboardDetails?.data?.topEarners}
            currency={userSelectedCurrency}
            conversionFactor={conversionFactor}
            userProductId={dashboardDetails?.data?.userProductId}
          />
          {!!moduleStatus?.rank_status && dashboardDetails?.data?.ranks && (
            <RankComponent
              ranks={dashboardDetails?.data?.ranks}
              currentRank={dashboardDetails?.data?.currentRank}
            />
          )}
          <EarningsExpenses
            earnings={dashboardDetails?.data?.earnings}
            currency={userSelectedCurrency}
            conversionFactor={conversionFactor}
          />
        </div>
      </div> */}
    </>
  );
};

export default Dashboard;
