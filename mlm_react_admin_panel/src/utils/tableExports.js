import * as XLSX from "xlsx";
import Papa from "papaparse";
import CurrencyConverter from "../Currency/CurrencyConverter";

export const exportToExcel = async (data, headers, type, currencySymbol, conversionFactor) => {
    const wsData = data.map(obj => {
        const formattedObj = { ...obj };
        if (formattedObj.totalAmount) {
            const convertedAmount = CurrencyConverter(formattedObj.totalAmount, conversionFactor);
            formattedObj.totalAmount = `${currencySymbol} ${convertedAmount}`;
        }
        if (formattedObj.amount) {
            const convertedAmount = CurrencyConverter(formattedObj.amount, conversionFactor);
            formattedObj.amount = `${currencySymbol} ${convertedAmount}`;
        }
        return Object.values(formattedObj);
    });
    const ws = XLSX.utils.aoa_to_sheet([headers, ...wsData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, `${type}.xlsx`);
};

export const exportToCSV = async (data, headers, type, currencySymbol, conversionFactor) => {
    const wsData = data.map(obj => {
        const formattedObj = { ...obj };
        if (formattedObj.totalAmount) {
            const convertedAmount = CurrencyConverter(formattedObj.totalAmount, conversionFactor);
            formattedObj.totalAmount = `${currencySymbol} ${convertedAmount}`;
        }
        if (formattedObj.amount) {
            const convertedAmount = CurrencyConverter(formattedObj.amount, conversionFactor);
            formattedObj.amount = `${currencySymbol} ${convertedAmount}`;
        }
        return Object.values(formattedObj);
    });
    const csvData = Papa.unparse([headers, ...wsData]);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};