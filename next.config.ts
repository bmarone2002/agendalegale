import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.cwd();
const generatedPrisma = path.resolve(projectRoot, "src/generated/prisma");

const nextConfig: NextConfig = {
  // Evita che Next usi la root della cartella padre (multi lockfile) e riduce errori Server Action
  outputFileTracingRoot: projectRoot,
  experimental: {
    serverActions: {
      // PDF allegati via Server Action: evita errore generico in produzione per payload troppo grande.
      bodySizeLimit: "15mb",
    },
  },
  turbopack: {
    resolveAlias: {
      // Use our generated Prisma client (with macroType, etc.) instead of node_modules
      "@prisma/client": generatedPrisma,
    },
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["@prisma/client"] = generatedPrisma;
    return config;
  },
};

export default nextConfig;
