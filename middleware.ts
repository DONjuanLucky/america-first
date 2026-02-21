import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/explorer/:path*",
    "/perspectives/:path*",
    "/admin/:path*",
    "/news/:path*",
    "/forum/:path*",
    "/action/:path*",
    "/assistant/:path*",
  ],
};
