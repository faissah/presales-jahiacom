module.exports = {
    plugins: [
        require('cssnano')({
            preset: ['advanced', {
                autoprefixer: {
                    remove: false,
                }
            }]
        }),
        require('autoprefixer'),
        require('postcss-mq-optimize'),
        require('postcss-merge-rules'),
        require("css-mqpacker")

    ],
};
