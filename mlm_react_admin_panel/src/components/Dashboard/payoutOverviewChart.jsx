import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import CurrencyConverter from "../../Currency/CurrencyConverter";
import { useTranslation } from "react-i18next";
const DoughnutChart = ({
  pending,
  approved,
  paid,
  payoutPaid,
  currency,
  conversionFactor,
  userSelectedLanguage
}) => {
  const { t } = useTranslation();
  const chartRef = useRef(null);

  useEffect(() => {
    const chartOptions = {
      responsive: false,
      maintainAspectRatio: true,
      cutout: 80,
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    let chart = null; // Declare chart variable

    if (pending === 0 && approved === 0 && paid === 0) {
      const chartData = {
        datasets: [
          {
            data: [1], // A small value to create a placeholder
            backgroundColor: ["#cccccc"], 
          },
        ],
      };
      chartOptions.plugins.tooltip = { enabled: false }; // Disable tooltips for the message

      chart = new Chart(chartRef.current, {
        type: "doughnut",
        data: chartData,
        options: chartOptions,
      });
    } else {
      const chartData = {
        labels: [`${t("pending")}`, `${t("approved")}`, `${t("paid")}`],
        datasets: [
          {
            data: [pending, approved, paid],
            backgroundColor: ["#2c008a", "#954cea", "#03AD47"],
            hoverBackgroundColor: ["#49A9EA", "#B370CF", "#115129"],
            hoverOffset: 15,
            hoverBorderWidth: 2,
          },
        ],
      };

      chart = new Chart(chartRef.current, {
        type: "doughnut",
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: chartData,
        options: chartOptions,
      });
    }

    return () => {
      chart.destroy();
    };
  }, [pending, approved, paid, userSelectedLanguage]);

  return (
    <div className="payout_overview_sec">
      <h2>{t("payoutOverview")}</h2>
      <div className="payout_graph_sec">
        {}
        <canvas
          height="200"
          id="payout"
          ref={chartRef}
          style={{ display: "block", height: "100%", width: "90%" }}
        />
        <div className="payout_graph_overvew_total">
          <span>{t("paid")}</span>
          <strong>
            {currency?.symbolLeft}{" "}
            {CurrencyConverter(payoutPaid, conversionFactor)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
