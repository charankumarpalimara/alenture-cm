export function getCmId() {
  const userDetails = JSON.parse(sessionStorage.getItem("CmDetails")) || {};
  console.log("cmid", userDetails.cmid);
  return userDetails.cmid || "";
}
