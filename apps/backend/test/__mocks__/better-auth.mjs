// Comprehensive ESM mock for better-auth integration used by @thallesp packages
export function toNodeHandler() { return () => {}; }
export function prismaAdapter() { return () => {}; }
export function betterAuth() { return {}; }

const mock = { toNodeHandler, prismaAdapter, betterAuth };
export default mock;