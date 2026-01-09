// Minimal CJS mock for better-auth integration used by @thallesp packages
function toNodeHandler() { return () => {}; }
function prismaAdapter() { return () => {}; }
function betterAuth() { return {}; }

module.exports = { __esModule: true, toNodeHandler, prismaAdapter, betterAuth };
module.exports.default = module.exports;