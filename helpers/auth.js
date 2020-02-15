module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            req.flash('err_msg', 'Please login first')
            res.redirect('/users/login')
        }
    }
}