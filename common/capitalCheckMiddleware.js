module.exports = (req, res, next) => {
    req.body.name =
    req.body.name
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
    .join(' ');
    next()
}