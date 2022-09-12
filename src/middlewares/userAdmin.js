function userAdmin (req, res, next){

    res.locals.isAdmin = false;

    if (req.session.usuarioLogueado){
        
        let user = req.session.usuarioLogueado

        if (user.CategoryId == 1) {
            
            res.locals.isAdmin = true;

        }
        
    }

    next();

} 

module.exports = userAdmin;