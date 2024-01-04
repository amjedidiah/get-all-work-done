import { NextRequest } from "next/server";
import {
  DOB,
  FirstAndLastNames,
  FullName,
} from "@/app/api/stripe/account/route";

export const validateRequest = async (request: NextRequest) => {
  // Check if request is valid JSON
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw {
      message: "Invalid content type",
      statusCode: 400,
    };
};

export const extractNames = (nameObject: FirstAndLastNames | FullName) => {
  let first_name, last_name;

  // Extract first and last name from account details
  if ("first_name" in nameObject) {
    first_name = nameObject.first_name;
    last_name = nameObject.last_name;
  } else if ("name" in nameObject) {
    const names = nameObject.name.split(" ");

    first_name = names[0];
    last_name = names[1];
  } else {
    //throw error with status code
    throw {
      message: "Invalid account details",
      statusCode: 400,
    };
  }

  return { first_name, last_name };
};

export const validateName = (name: string) => {
  if (name.length < 2 || name.length > 50)
    throw {
      message: "Name must be between 2 and 50 characters",
      statusCode: 400,
    };
};

export const validateDOB = (birthdayObject: DOB) => {
  // Extract day, month, and year from the birthdayObject
  const { day, month, year } = birthdayObject;

  // Create a Date object from the birthday
  const birthday = new Date(`${year}-${month}-${day}`);

  // Calculate the user's age
  const today = new Date();
  const age = today.getFullYear() - birthday.getFullYear();

  // Check if the user has already had their birthday this year
  const isBirthDateNotPassed =
    today.getMonth() === birthday.getMonth() &&
    today.getDate() < birthday.getDate();

  // Subtract 1 from age if birthday hasn't occurred yet this year
  const isAbove18 =
    today.getMonth() < birthday.getMonth() || isBirthDateNotPassed
      ? age - 1 >= 18
      : age >= 18;

  if (!isAbove18)
    throw {
      message: "You must be 18 years or older to open an account",
      statusCode: 400,
    };
};
