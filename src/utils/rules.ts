import * as yup from "yup";

export const schemaRegister = yup.object().shape({
  name: yup.string().required("Tên là bắt buộc"),
  email: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)) // "" => null
    .email("Email không hợp lệ")
    .notRequired(),
  phone: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v)) // "" => null
    .matches(/^\d+$/, "Số điện thoại không hợp lệ")
    .notRequired(),
  password: yup.string().required("Mật khẩu là bắt buộc"),
}).test(
  "email-or-phone",
  "Cần nhập email hoặc số điện thoại",
  (value) => {
    return !!(value.email || value.phone);
  }
);


export type schemaRegister = yup.InferType<typeof schemaRegister>;

export const schemaLogin = yup.object({
  identifier: yup.string().required("Vui lòng nhập email hoặc số điện thoại"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export const schemaForgotPassword = yup.object({
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ")
    .min(5, "Email phải có ít nhất 5 ký tự")
    .max(160, "Email phải từ 5 - 160 ký tự"),
});

export const schemaOTP = yup.object({
  otp: yup.string().required("Mã OTP không được để trống"),
});

export const schemaResetPassword = yup.object({
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(160, "Mật khẩu phải từ 6 - 160 ký tự"),
  confirm_password: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(160, "Mật khẩu phải từ 6 - 160 ký tự")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

export const schemaChat = yup.object({
  userA: yup.string().required("Mã người dùng không được để trống").min(2, "Tên phải có ít nhất 2 ký tự"),
  chatName: yup.string().required("Tên nhóm chat không được để trống").min(2, "Tên nhóm chat phải có ít nhất 2 ký tự"),
  encryptedKey: yup.string().required("Khóa mã hóa không được để trống").min(2, "Khóa mã hóa phải có ít nhất 2 ký tự"),
});

export type SchemaRegister = yup.InferType<typeof schemaRegister>;
export type SchemaLogin = yup.InferType<typeof schemaLogin>;
export type SchemaForgotPassword = yup.InferType<typeof schemaForgotPassword>;
export type SchemaOTP = yup.InferType<typeof schemaOTP>;
export type SchemaResetPassword = yup.InferType<typeof schemaResetPassword>;
export type SchemaChat = yup.InferType<typeof schemaChat>;
