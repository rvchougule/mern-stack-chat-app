import * as Yup from "yup";

export const signUpValidation = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  profile_img: Yup.mixed()
    .required("Profile photo is required")
    .test(
      "fileType",
      "Unsupported file format. Only JPG, PNG, and GIF are allowed",
      (value) =>
        value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
    )
    .test(
      "fileSize",
      "File size too large. Max size is 2MB",
      (value) => value && value.size <= 2 * 1024 * 1024
    ),
});

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
});
