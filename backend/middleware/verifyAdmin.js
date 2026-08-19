const verifyAdmin = (
    req,
    res,
    next
) => {

    if(req.user.role_type !== 'admin'){

        return res.status(403).json({
            message:'Admin access required'
        });

    }

    next();

};

module.exports = verifyAdmin;