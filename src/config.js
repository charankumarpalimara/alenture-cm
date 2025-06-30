export function getCmId() {
  const userDetails = JSON.parse(sessionStorage.getItem("cmDetails")) || {};
  return userDetails.cmid || "";
}
