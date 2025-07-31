import { format } from "date-fns";
import dayjs from "dayjs";


export const formatDate = (dateString) => {
  if (!dateString) {
    return ""; // Handle empty or null values gracefully.
  }
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy HH:mm:ss');
  return formattedDate;
};

export const formatDateWithoutTime = (dateString) => {
  if (!dateString) {
    return ""; // Handle empty or null values gracefully.
  }
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy');
  return formattedDate;
}

export const ticketFormatDate = (dateString) => {
  if (!dateString) {
    return ""; // Handle empty or null values gracefully.
  }
  const formattedDate = format(new Date(dateString), 'dd/MMM/yyyy  HH:mm');
  return formattedDate;
};

export const crmFormateDate = (dateString) => {
  if (!dateString) {
    return ""; // Handle empty or null values gracefully.
  }
  const formattedDate = format(new Date(dateString), 'MM-dd-yyyy');
  return formattedDate;
}

export const maxAgeValidation = (selectedDate, ageLimit) => {
  if (selectedDate) {
    const today = dayjs();
    const maxAge = today.subtract(ageLimit, "year");
    return !selectedDate.isAfter(maxAge);
  }
  return false;
};

export const minAgeValidation = (selectedDate, ageLimit) => {
  if (selectedDate) {
    const today = dayjs();
    const minAge = today.subtract(ageLimit, "year");
    return selectedDate.isBefore(minAge) || selectedDate.isSame(minAge);
  }
  return false;
};

export const validateDateOfBirth = (newDate, minAgeLimit, maxAgeLimit = 120) => {
  if (!newDate) {
    return { isValid: false, error: null };
  }

  const formattedDate = newDate.format("YYYY-MM-DD");
  const isMinAge = minAgeValidation(newDate, minAgeLimit);
  const isMaxAge = maxAgeValidation(newDate, maxAgeLimit);

  let isValid = true;
  let error = null;

  if (!isMinAge) {
    error = { message: "ageValidation", age: minAgeLimit };
    isValid = false;
  } else if (isMaxAge) {
    error = { message: "maxAgeLimit", age: maxAgeLimit };
    isValid = false;
  }

  return {
    isValid,
    error,
    formattedDate,
    isMinAge: { status: isMinAge, ageLimit: minAgeLimit },
    isMaxAge: { status: isMaxAge, ageLimit: maxAgeLimit }
  };
};