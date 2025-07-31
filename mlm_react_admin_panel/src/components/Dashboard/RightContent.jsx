import React from "react";
import UserDropdown from "./DashboardUserDropdown";
import DoughnutChart from "./payoutOverviewChart";
import LinkSection from "./UserLinks";
import { useSelector } from "react-redux";

const RightContentSection = ({ props }) => {
    // const currency = useSelector(state=> state.admin?.selectedCurrency);
    const conversionFactor= useSelector((state) => state.admin?.conversionFactor);
    const userSelectedLanguage = useSelector(
      (state) => state.admin?.selectedLanguage
    );
  return (
    <>
      <UserDropdown props={props?.userProfile} />
      <DoughnutChart
        pending={props?.payoutDoughnut?.pending}
        approved={props?.payoutDoughnut?.approved}
        paid={props?.payoutDoughnut?.paid}
        payoutPaid={props?.payoutOverview?.payoutPaid}
        // currency={currency}
        conversionFactor={conversionFactor}
        userSelectedLanguage={userSelectedLanguage}
      />
      <LinkSection
        payoutTab={props?.payoutOverview}
        replicaLink={props?.replicaLink}
        leadCaptureLink={props?.leadCaptureLink}
        currency={currency}
        conversionFactor={conversionFactor}
      />
    </>
  );
};

export default RightContentSection;
