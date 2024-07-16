import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { auth } from "./auth";
import {
    apiAuthPrefix,
    defaultLogInRedirect,
    apiPrivateRoutes,
    apiPublicRoutes,
} from "./routes";

export default auth((req) => {
    console.log(req.nextUrl.pathname);
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuth = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = apiPublicRoutes.includes(nextUrl.pathname);

    if (isApiAuth) {
        // if (isLoggedIn) {
        //     // url as second argument turns it into absolute url e.g. - localHost:3000/settings...
        //     return Response.redirect(new URL(defaultLogInRedirect, nextUrl));
        // }
        return;
    }
    if (!isPublicRoute && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
    }
});

export const config = {
    // Regex matches all paths for middleware execution
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
