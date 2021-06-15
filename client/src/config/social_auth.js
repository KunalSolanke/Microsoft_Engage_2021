import { env } from "../http/api";
const google = {
  clientId: "414598802816-c314i7pb50poh5hgcpvq2donan9hotfq.apps.googleusercontent.com",
  cookiePolicy: "single_host_origin",
};
const outlook = {
  clientId: "4b50ad11-ad70-42d7-8a61-1f640f386f82",
  validateAuthority: false,
  redirectUri: env == "dev" ? "http://localhost:5000/" : "https://interview-tracker.netlify.app/",
  tenantUrl: "https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c",
};
const github = {
  clientId: "187f3798df075872dd03",
  redirectUri: "",
};
export default {
  google,
  outlook,
  github,
};
