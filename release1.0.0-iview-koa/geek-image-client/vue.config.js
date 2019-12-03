module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        proxy: {
            '/api': {
                target: 'http://localhost:3000/api/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}