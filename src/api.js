
export const API_URL = import.meta.env.VITE_API_URL;

export async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const req_url=API_URL+url;

  const headers = {
    ...(options.headers || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(req_url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMsg=text;
      try {
        const json = JSON.parse(text);
        errorMsg = json.error || json.message || text;
      } catch (err) {
        // text was not JSON
      }
      
      // Special case: token expired
      if (errorMsg.includes("expired")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}
export async function downloadFile(mode, filename,options={}) {
  const token = localStorage.getItem("token");
  const query = buildQuery(options);   // convert to URL query string

  const url = query
    ? `${mode}?${query}`
    : `${mode}`;

  const req_url = API_URL + url;

  try {
    const response = await fetch(req_url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Read text to detect token expiration
      const text = await response.text();

      if (text.includes("expired")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      throw new Error("Download failed");
    }

    // Read as Blob (very important)
    const blob = await response.blob();

    // Create download link
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean blob URL
    window.URL.revokeObjectURL(urlBlob);

  } catch (err) {
    throw err;
  }
}
function buildQuery(options) {
  const params = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  return params.toString();  // ex: "sale_id=2&product_id=5"
}
export function apiGet(mode, options = {}) {
  const query = buildQuery(options);   // convert to URL query string

  const url = query
    ? `${mode}?${query}`
    : `${mode}`;

  return request(url);
}

// Login example
export function login(formData) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ login:formData.login, 
     password:formData.password,}),
  }
);
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
// Register example
export function register(formData) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
     username:formData.username,
     email:formData.email, 
     password:formData.password,
    }),
  }
);
}
