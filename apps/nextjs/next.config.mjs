/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ["@acme/api", "@acme/auth", "@acme/db"],
    /** We already do linting and typechecking as separate tasks in CI */
    eslint: { ignoreDuringBuilds: !!process.env.CI },
    typescript: { ignoreBuildErrors: !!process.env.CI },
    webpack: (config, opts) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (!opts.isServer) return config;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
            ...config,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            module: {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ...config.module,
                rules: [
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    ...config.module.rules,
                    {
                        test: /\.node$/,
                        loader: "node-loader",
                    },
                ],
            },
        };
    },
};

export default config;
