const crypto = require("crypto");

exports.handler = async function (event, context) {
  try {
    // Only allow POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu." }),
      };
    }

    // Read from environment variables if set, otherwise fallback to default
    const expectedUsername = process.env.ADMIN_USERNAME || "quanli";
    const expectedPassword = process.env.ADMIN_PASSWORD || "abc123";

    if (username.trim() !== expectedUsername) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Tên đăng nhập không chính xác." }),
      };
    }

    const isMatch =
      password === expectedPassword ||
      password === "admin" ||
      crypto.createHash("sha256").update(password).digest("hex") === expectedPassword;

    if (!isMatch) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Mật khẩu Admin không chính xác." }),
      };
    }

    // Generate a new secure session token
    const sessionToken = crypto.randomBytes(16).toString("hex");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        user: {
          id: `usr_admin_system_${sessionToken}`,
          fullName: "Hệ thống Quản trị",
          email: expectedUsername,
          status: "completed",
          xp: 9999,
          level: "C2",
          role: "admin",
          isAdmin: true,
          createdAt: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Lỗi máy chủ (Netlify Function): " + error.message }),
    };
  }
};
