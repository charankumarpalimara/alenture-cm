function getUserDetails() {
  return (
    JSON.parse(sessionStorage.getItem("CmDetails")) ||
    JSON.parse(sessionStorage.getItem("CrmDetails")) ||
    JSON.parse(sessionStorage.getItem("hobDetails")) ||
    JSON.parse(sessionStorage.getItem("userDetails")) ||
    {}
  );
}

export function getCreaterId() {
  const userDetails = getUserDetails();
  return (
    userDetails.cmid ||
    userDetails.crmid ||
    userDetails.hobid ||
    userDetails.adminid ||
    ""
  );
}

export function getCreaterName() {
  const userDetails = getUserDetails();
  const first = userDetails.firstname || "";
  const last = userDetails.lastname || "";
  return (first + " " + last).trim();
}

export function getCreaterFirstName() {
  const userDetails = getUserDetails();
  return userDetails.firstname || "";
}

export function getCreaterRole() {
  const userDetails = getUserDetails();
  return userDetails.extraind10 || "";
}

export function getCreaterEmail() {
  const userDetails = getUserDetails();
  return userDetails.email || "";
}
export function getCmId() {
  const userDetails = JSON.parse(sessionStorage.getItem("CmDetails")) || {};
  console.log("cmid", userDetails.cmid);
  return userDetails.cmid || "";
}
export function getCrmId() {
  const userDetails = JSON.parse(sessionStorage.getItem("CrmDetails")) || {};
  return userDetails.crmid || "";
}

export function getCrmName() {
  const userDetails = JSON.parse(sessionStorage.getItem("CrmDetails")) || {};
  return userDetails.firstname + " " + userDetails.lastname || "";
}
