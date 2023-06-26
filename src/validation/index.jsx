import * as Yup from "yup";

export const CREATE_PESANAN_MASUK_VALIDATION = Yup.object().shape({
  name: Yup.string().max(50, 'maksimal panjang nama 50 huruf').required("nama harus diisi"),
  email: Yup.string().email("email harus valid").test(
    "domain",
    "Unsupported email provider",
    (value) => {
      if (value) {
        const supportedProviders = ["gmail.com", "yahoo.com", "yahoo.co.id", "hotmail.com"];
        const domain = value.split("@")[1];
        return supportedProviders.includes(domain);
      }
      return true;
    }
  ),
  phone: Yup.string()
    .required("nomer hp harus diisi")
    .matches(/^[0-9]+$/, "Harus berupa angka")
    .min(11, "minimal 11 digit")
    .max(13, "maksimal 13 digit"),
  address: Yup.string().required("alamat harus diisi"),
  status: Yup.string().required("Required")
});

export const UPDATE_PESANAN_MASUK_VALIDATION = Yup.object().shape({
  id: Yup.string().required("Required"),
  name: Yup.string().max(50, 'maksimal panjang nama 50 huruf').required("harus diisi"),
  email: Yup.string().email("email harus valid").test(
    "domain",
    "Unsupported email provider",
    (value) => {
      if (value) {
        const supportedProviders = ["gmail.com", "yahoo.com", "yahoo.co.id", "hotmail.com"];
        const domain = value.split("@")[1];
        return supportedProviders.includes(domain);
      }
      return true;
    }
  ),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Harus berupa angka")
    .min(11, "minimal 11 digit")
    .max(13, "maksimal 13 digit")
    .required("nomer hp harus diisi"),
  address: Yup.string().required("alamat harus diisi"),
});