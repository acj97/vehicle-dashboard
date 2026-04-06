import type { NextRequestWithAuth } from "next-auth/middleware";

// Capture the inner middleware fn and authorized callback before proxy.ts runs
let innerMiddleware: (req: NextRequestWithAuth) => unknown;
let authorizedCallback: (params: { token: unknown }) => boolean;

jest.mock("next-auth/middleware", () => ({
  withAuth: (fn: (req: NextRequestWithAuth) => unknown, opts: { callbacks: { authorized: (p: { token: unknown }) => boolean } }) => {
    innerMiddleware = fn;
    authorizedCallback = opts.callbacks.authorized;
    return fn; // return the inner fn so the default export is directly callable
  },
}));

const redirectMock = jest.fn();
const nextMock = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    redirect: (url: URL) => redirectMock(url),
    next: () => nextMock(),
  },
}));

// Import after mocks are in place so withAuth is already captured
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require("@/proxy");
require("@/proxy"); // ensure module runs and captures the callbacks

function makeReq(pathname: string, role?: string): NextRequestWithAuth {
  return {
    nextUrl: new URL(`http://localhost:3000${pathname}`),
    url: `http://localhost:3000${pathname}`,
    nextauth: { token: role ? { role } : null },
  } as unknown as NextRequestWithAuth;
}

beforeEach(() => {
  redirectMock.mockClear();
  nextMock.mockClear();
});

// ─── authorized callback ────────────────────────────────────────────────────

describe("authorized callback", () => {
  it("returns false when there is no token (unauthenticated)", () => {
    expect(authorizedCallback({ token: null })).toBe(false);
  });

  it("returns true for an admin token", () => {
    expect(authorizedCallback({ token: { role: "admin" } })).toBe(true);
  });

  it("returns true for a viewer token", () => {
    expect(authorizedCallback({ token: { role: "viewer" } })).toBe(true);
  });
});

// ─── admin routing ──────────────────────────────────────────────────────────

describe("admin — /dashboard access", () => {
  it("passes through /dashboard", () => {
    innerMiddleware(makeReq("/dashboard", "admin"));
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
  });

  it("passes through /dashboard/sub-path", () => {
    innerMiddleware(makeReq("/dashboard/some-sub-page", "admin"));
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
  });

  it("passes through /makes", () => {
    innerMiddleware(makeReq("/makes", "admin"));
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
  });
});

// ─── viewer routing ─────────────────────────────────────────────────────────

describe("viewer — /dashboard is blocked", () => {
  it("redirects /dashboard to /makes", () => {
    innerMiddleware(makeReq("/dashboard", "viewer"));
    expect(redirectMock).toHaveBeenCalledTimes(1);
    const redirectedUrl: URL = redirectMock.mock.calls[0][0];
    expect(redirectedUrl.pathname).toBe("/makes");
  });

  it("redirects /dashboard/any-sub-path to /makes", () => {
    innerMiddleware(makeReq("/dashboard/settings", "viewer"));
    expect(redirectMock).toHaveBeenCalled();
    const redirectedUrl: URL = redirectMock.mock.calls[0][0];
    expect(redirectedUrl.pathname).toBe("/makes");
  });

  it("does NOT redirect /makes", () => {
    innerMiddleware(makeReq("/makes", "viewer"));
    expect(redirectMock).not.toHaveBeenCalled();
    expect(nextMock).toHaveBeenCalled();
  });
});

// ─── matcher config ─────────────────────────────────────────────────────────

describe("config.matcher", () => {
  it("covers /dashboard routes", () => {
    expect(config.matcher).toContain("/dashboard/:path*");
  });

  it("covers /makes routes", () => {
    expect(config.matcher).toContain("/makes/:path*");
  });

  it("does not cover /login (public route)", () => {
    const coversLogin = (config.matcher as string[]).some(
      (pattern) => pattern.startsWith("/login")
    );
    expect(coversLogin).toBe(false);
  });

  it("does not cover /api routes", () => {
    const coversApi = (config.matcher as string[]).some(
      (pattern) => pattern.startsWith("/api")
    );
    expect(coversApi).toBe(false);
  });
});
