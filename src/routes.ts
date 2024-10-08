/**
 * Private API routes
 */

export const apiPrivateRoutes = ["/dashboard", "/friends"];

/**
 * Public API Routes
 */

export const apiPublicRoutes = [
    "/",
    "/about",
    "/search",
    "/auth/verify",
    "/auth/resetPassword",
    "/study",
    "/discover",
    "/discover/sets",
    "/discover/collections",
    "/discover/popular",
    "/api/fetch/fetchStudyFlashCards",
];

/**
 * Api routes used for authentication purposes
 */

export const apiVerifyEmail = "/api/auth/verify";

export const apiAuthPrefix = "/api/auth";

/**
 * API redirect when logged in!
 */
export const defaultLogInRedirect = "/dashboard";
