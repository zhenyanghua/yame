export default {
    webpack(config, env, helpers, options) {
        const postCssLoaders = helpers.getLoadersByName(config, 'postcss-loader');
        postCssLoaders.forEach(( { loader }) => {
            loader.options.plugins = [
                require('tailwindcss')('./tailwind.config.js'),
                ...loader.options.plugins
            ];
        })
        return config;
    }
}