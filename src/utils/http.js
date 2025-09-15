const api_url = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/v1/` : "https://alantur-api.softplix.com/v1/";

export async function getAdminNotifications() {
  try {
    const response = await fetch(`${api_url}get-admin-notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getCrmNotifications({ crmId }) {
  try {
    const response = await fetch(`${api_url}get-crm-notifications/${crmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getCrmNotificationsDetails({ id }) {
  try {
    const response = await fetch(`${api_url}get-experience-details/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getCrmDetailsById({ crmId }) {
  try {
    const response = await fetch(`${api_url}get-crm-details/${crmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function markNotificationRead({ id }) {
  try {
    const response = await fetch(`${api_url}mark-notification-read/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getCmNotifications({ cmId }) {
  try {
    const response = await fetch(`${api_url}get-cm-notifications/${cmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getCmDetailsById({ cmId }) {
  try {
    const response = await fetch(`${api_url}get-cm-details/${cmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}

export async function getNotificationsDetails({ id }) {
  try {
    const response = await fetch(`${api_url}get-experience-details/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
export async function getHobNotifications() {
  try {
    const response = await fetch(`${api_url}get-hob-notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
