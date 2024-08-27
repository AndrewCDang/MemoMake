// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// next.config.js
const path = require("path");

module.exports = {
    webpack(config) {
        config.resolve.alias["@"] = path.resolve(__dirname, "src");
        return config;
    },
};
