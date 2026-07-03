import {
    clerkMiddleware,
    createRouteMatcher} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
    '/(.*)',
]);


export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth.protect();
});
export const config = {
    matcher: [
        '/((?!.\..|_next).)', // Exclude static files and Next.js internal paths
        '/', // Include the homepage
        '/(api|trpc)(.)' // Include API routes
        ],
};  