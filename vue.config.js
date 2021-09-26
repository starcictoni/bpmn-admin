function getPublicPath() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return '/admin/';
        default:
            return '';
    }
}

module.exports = {
    publicPath: getPublicPath(),
};

module.exports = {
    transpileDependencies: ['vuetify'],
};
