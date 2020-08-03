function redirectToProfileIfAuthenticated(req, res, next) {
    if(req.session.usuarioLogueado) {
        return res.redirect('/users/account')
    } else {
        next();
    }
}

module.exports = redirectToProfileIfAuthenticated;