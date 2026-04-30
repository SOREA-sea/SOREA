#!/usr/bin/env node

/**
 * Test API Directe - SOREA (port 3000)
 * Lance des tests via fetch sur le serveur en cours d'exécution
 *
 * Usage: node quick-test-3000.js
 */

const BASE_URL = "http://localhost:3000"; // Next.js dev server (port 3000)

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

async function request(method, endpoint, body = null, cookie = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (cookie) {
    options.headers["Cookie"] = `sorea_session=${cookie}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Extract cookie if present
    const setCookie = response.headers.get("set-cookie");
    let sessionCookie = null;
    if (setCookie) {
      const match = setCookie.match(/sorea_session=([^;]+)/);
      if (match) {
        sessionCookie = match[1];
      }
    }

    return {
      status: response.status,
      data,
      cookie: sessionCookie,
      ok: response.ok,
    };
  } catch (error) {
    return { error: error.message, status: 0 };
  }
}

function testResult(title, result, expectedStatus = 200) {
  const success = result.status === expectedStatus;
  const statusText = success ? "PASS" : "FAIL";
  const color = success ? colors.green : colors.red;

  console.log(
    `  ${color}${statusText} ${title}${colors.reset} [${result.status}]`,
  );

  if (!success && result.data?.error) {
    console.log(`    Error: ${result.data.error}`);
  }

  return success;
}

async function main() {
  console.log(
    `\n${colors.bold}${colors.cyan}Tests API - SOREA (Direct Project Test)${colors.reset}\n`,
  );

  let passed = 0;
  let failed = 0;

  // Test 1: Health
  console.log(`${colors.blue}━━ 1. HEALTH CHECK (PUBLIC) ━━${colors.reset}`);
  let result = await request("GET", "/api/health");
  if (testResult("GET /api/health", result, 200)) passed++;
  else failed++;

  // Test 2: API Index
  console.log(`\n${colors.blue}━━ 2. API INDEX (PUBLIC) ━━${colors.reset}`);
  result = await request("GET", "/api");
  if (testResult("GET /api", result, 200)) passed++;
  else failed++;

  // Test 3: Get Products
  console.log(`\n${colors.blue}━━ 3. GET PRODUCTS (PUBLIC) ━━${colors.reset}`);
  result = await request("GET", "/api/products");
  if (testResult("GET /api/products", result, 200)) {
    passed++;
    console.log(`    Found: ${result.data.data?.length || 0} products`);
  } else {
    failed++;
  }

  // Test 4: Get Sessions
  console.log(`\n${colors.blue}━━ 4. GET SESSIONS (PUBLIC) ━━${colors.reset}`);
  result = await request("GET", "/api/sessions");
  if (testResult("GET /api/sessions", result, 200)) {
    passed++;
    console.log(`    Found: ${result.data.data?.length || 0} sessions`);
  } else {
    failed++;
  }

  // Test 5: Get Testimonials
  console.log(
    `\n${colors.blue}━━ 5. GET TESTIMONIALS (PUBLIC) ━━${colors.reset}`,
  );
  result = await request("GET", "/api/testimonials");
  if (testResult("GET /api/testimonials", result, 200)) passed++;
  else failed++;

  // Test 6: Register User
  console.log(`\n${colors.blue}━━ 6. REGISTER USER (PUBLIC) ━━${colors.reset}`);
  const timestamp = Date.now();
  const testEmail = `test_${timestamp}@example.com`;
  result = await request("POST", "/api/auth/register", {
    firstName: "Test",
    lastName: "User",
    email: testEmail,
    password: "TestPassword123!",
    isCoach: false,
  });
  if (testResult("POST /api/auth/register", result, 201)) {
    passed++;
    console.log(`    User created: ${testEmail}`);
  } else {
    failed++;
  }

  // Test 7: Login
  console.log(`\n${colors.blue}━━ 7. LOGIN USER (PUBLIC) ━━${colors.reset}`);
  result = await request("POST", "/api/auth/login", {
    email: testEmail,
    password: "TestPassword123!",
  });
  if (testResult("POST /api/auth/login", result, 200)) {
    passed++;
    console.log(`    Session: ${result.cookie?.substring(0, 15)}...`);
  } else {
    failed++;
  }
  const userCookie = result.cookie;

  // Test 8: Get Current User
  console.log(
    `\n${colors.blue}━━ 8. GET CURRENT USER (PROTECTED) ━━${colors.reset}`,
  );
  result = await request("GET", "/api/auth/me", null, userCookie);
  if (testResult("GET /api/auth/me", result, 200)) {
    passed++;
    // Check password not leaked
    if (!result.data.user?.password) {
      console.log(
        `    ${colors.green}Password correctly excluded${colors.reset}`,
      );
    } else {
      console.log(`    ${colors.red}WARNING: Password leaked!${colors.reset}`);
    }
  } else {
    failed++;
  }

  // Test 9: Security - Unauthenticated
  console.log(
    `\n${colors.blue}━━ 9. SECURITY - UNAUTHORIZED ━━${colors.reset}`,
  );
  result = await request("GET", "/api/users");
  if (testResult("GET /api/users (no auth, should fail)", result, 401)) {
    passed++;
  } else {
    failed++;
  }

  // Test 10: Weak Password
  console.log(
    `\n${colors.blue}━━ 10. SECURITY - WEAK PASSWORD ━━${colors.reset}`,
  );
  result = await request("POST", "/api/auth/register", {
    firstName: "Weak",
    lastName: "Password",
    email: `weak_${timestamp}@example.com`,
    password: "123", // Too short
  });
  if (
    testResult(
      "POST /api/auth/register (weak password, should fail)",
      result,
      400,
    )
  ) {
    passed++;
    console.log(`    Error msg: "${result.data.error}"`);
  } else {
    failed++;
  }

  // Test 11: Duplicate Email
  console.log(
    `\n${colors.blue}━━ 11. SECURITY - DUPLICATE EMAIL ━━${colors.reset}`,
  );
  result = await request("POST", "/api/auth/register", {
    firstName: "Duplicate",
    lastName: "Test",
    email: testEmail,
    password: "AnotherPassword123!",
  });
  if (
    testResult(
      "POST /api/auth/register (duplicate email, should fail)",
      result,
      409,
    )
  ) {
    passed++;
  } else {
    failed++;
  }

  // Test 12: Logout
  console.log(`\n${colors.blue}━━ 12. LOGOUT (PROTECTED) ━━${colors.reset}`);
  result = await request("POST", "/api/auth/logout", null, userCookie);
  if (testResult("POST /api/auth/logout", result, 200)) passed++;
  else failed++;

  // Test 13: Verify Session Invalidated
  console.log(
    `\n${colors.blue}━━ 13. VERIFY SESSION INVALIDATED ━━${colors.reset}`,
  );
  result = await request("GET", "/api/auth/me", null, userCookie);
  if (testResult("GET /api/auth/me (after logout, should fail)", result, 401)) {
    passed++;
  } else {
    failed++;
  }

  // Summary
  console.log(
    `\n${colors.cyan}${colors.bold}════════════════════════════════════${colors.reset}`,
  );
  console.log(
    `${colors.green}Passed: ${passed}${colors.reset} | ${colors.red}Failed: ${failed}${colors.reset}`,
  );
  console.log(
    `${colors.cyan}${colors.bold}════════════════════════════════════${colors.reset}\n`,
  );

  if (failed === 0) {
    console.log(
      `${colors.green}${colors.bold}All tests passed. API is secure.${colors.reset}\n`,
    );
  } else {
    console.log(`${colors.yellow}${failed} test(s) failed${colors.reset}\n`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
console.log(`${colors.yellow}Connecting to ${BASE_URL}...${colors.reset}`);

fetch(`${BASE_URL}/api/health`)
  .then(() => main())
  .catch(() => {
    console.error(
      `${colors.red}✗ Cannot connect to ${BASE_URL}${colors.reset}`,
    );
    console.error(
      `${colors.yellow}Make sure the server is running: npm run dev${colors.reset}\n`,
    );
    process.exit(1);
  });
