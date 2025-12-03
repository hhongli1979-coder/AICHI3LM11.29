export const ValidatePhoneNumber = (phone: string, t?: Function) => {
  const cleanPhone = phone.replace(/[^\d]/g, "");

  if (!phone) {
    return t?.("error.phoneNo") || "Phone Number is Required";
  }

  if (cleanPhone.length < 6) {
    return "Phone Number must be at Least 6 Digits";
  }

  if (cleanPhone.length > 15) {
    return "Phone Number must be 15 Digits";
  }
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{6,15}$/;
  if (!phoneRegex.test(phone)) {
    return "Invalid Phone Number Format";
  }

  return "";
};

export const validateEmail = (value: string, t?: Function) => {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!value) {
    return 'Please Enter Email';
  } else if (!emailRegex.test(value)) {
    return 'Please Enter Valid Email';
  }
  return "";
};