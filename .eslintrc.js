module.exports = { // eslint-disable-line no-undef
    // Which files to not lint
    ignorePatterns: [
        "node_modules",
        "tests/**/*",
        ".eslintrc.js",
        "webpack.config.js"
    ],

    extends: [
        "plugin:vue/essential",
        "eslint:recommended"
    ],

    rules: {
        quotes: ["error", "double", { avoidEscape: true }],
        semi: "off"
    }
}
