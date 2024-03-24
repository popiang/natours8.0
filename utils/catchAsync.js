module.exports = (fn) => {
    return (req, res, next) => {
        fn().catch((error) => next(error));
    };
};
