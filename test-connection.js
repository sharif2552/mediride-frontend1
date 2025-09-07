// Test API connection - Frontend to Backend
const testConnection = async () => {
  try {
    console.log("Testing backend connection...");

    // Test basic connection to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    console.log("Backend URL:", backendUrl);

    // Test hospitals endpoint (no auth required)
    const response = await fetch(`${backendUrl}/hospitals/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Backend connection successful!");
      console.log("Hospitals data:", data);
      return { success: true, data };
    } else {
      console.log("❌ Backend responded with error:", response.status);
      const errorText = await response.text();
      console.log("Error details:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

// For browser console testing
if (typeof window !== "undefined") {
  window.testConnection = testConnection;
}

export default testConnection;
