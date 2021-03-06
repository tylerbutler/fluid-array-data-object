module.exports = {
    "extends": [
        "@fluidframework/eslint-config-fluid/eslint7"
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": "off", // requires strictNullChecks=true in tsconfig
        "react/prop-types": "off",
    }
}
