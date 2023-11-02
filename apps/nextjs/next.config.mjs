import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    output: "standalone",
    experimental: {
        outputFileTracingRoot: path.join(__dirname, "../../"),
    }
};

export default config;
