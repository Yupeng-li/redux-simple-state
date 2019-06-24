const presets = [
    [
        "@babel/env",
        {
            targets: {
                browsers: ['ie >= 11']
            },
        },
    ],
];

module.exports = { presets };