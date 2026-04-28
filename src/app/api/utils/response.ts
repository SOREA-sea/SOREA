const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; img-src * data:; script-src 'self' 'unsafe-inline'; connect-src 'self'",
};

// Helper function to send success response
export const successResponse = (data: any, message = "Success", status = 200) => {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
      headers: securityHeaders,
    }
  );
};

// Helper function to send error response
export const errorResponse = (message = "Error", status = 400, error?: any) => {
  return Response.json(
    {
      success: false,
      message,
      error: error || null,
    },
    {
      status,
      headers: securityHeaders,
    }
  );
};
