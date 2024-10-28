const authConfig = {
    providers: [
      {
        domain: process.config.CLERK_JWT_ISSUER_DOMAIN,
        // domain: "https://unique-platypus-39.clerk.accounts.dev",
        applicationID: "convex",
      },
    ],
  };
export default authConfig; 