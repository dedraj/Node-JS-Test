const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema, authSchemaToDelete, authSchemaToUpdate, authSchemaForLogin } = require('../helpers/validations')
const {signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken} = require('../helpers/jwtHelper');

router.put('/add-user', verifyAccessToken, async (req, res, next) => {
    try {
        const userId = req.payload.aud;
        const isAdminUser = await User.findById(userId);
        if(!isAdminUser.isAdmin) throw next(createError.BadRequest("Only Admin has rights to add user"));
        
        const validateRequest = await authSchema.validateAsync(req.body); 
    
        if(!validateRequest.email || !validateRequest.password) throw next(createError.BadRequest("pass proper email or password"));
        
        const doesExist = await User.findOne({email: validateRequest.email});
        
        if(doesExist) throw next(createError.Conflict(`${validateRequest.email} already exists`));

        const user = new User(validateRequest);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);
        res.send({
            "id": savedUser.id,
            "userName": savedUser.name,
            "email": savedUser.email,   
            "phoneNumber": savedUser.phoneNumber,  
            "accessToken": accessToken, 
            "refreshToken": refreshToken,
            "message": "User successfully saved" 
        });
    } catch (error) {
        if(error?.isJoi === true) error.status = 422;
        next(error);
    }
})

router.delete('/delete-user/:id', verifyAccessToken,async (req, res, next) => {
    try {
        const userId = req.payload.aud;
        const isAdminUser = await User.findById(userId);
        if(!isAdminUser.isAdmin) throw next(createError.BadRequest("Only Admin has rights to delete user"));

        const validateRequest = await authSchemaToDelete.validateAsync(req.params); 
    
        if(!validateRequest.id ) throw next(createError.BadRequest("pass proper id to delete user"));
        
        const doesExist = await User.findOne({id: validateRequest.id});
        
        if(!doesExist) throw next(createError.Conflict(`No ${validateRequest.id} such user exists`));

        const deleteUser = await User.deleteOne({_id: validateRequest.id});
         
        if(deleteUser) {
            res.send({
                "message": "User successfully deleted" 
            });
        }
    } catch (error) {
        if(error?.isJoi === true) error.status = 422;
        next(error);
    }
})

router.patch('/update-user/:id', verifyAccessToken,async (req, res, next) => {
    try {
        const userId = req.payload.aud;
        const isAdminUser = await User.findById(userId);
        if(!isAdminUser.isAdmin) throw next(createError.BadRequest("Only Admin has rights to update user"));

        const validateRequest = await authSchemaToUpdate.validateAsync(req.body); 
    
        if(!validateRequest) throw next(createError.BadRequest("Pass proer values to update"));

        const doesExist = await User.findOne({id: validateRequest.id});
        
        if(!doesExist) throw next(createError.Conflict(`No ${validateRequest.id} such user exists`));

        const updateuser = await User.updateOne(validateRequest);
        
        if(updateuser) {
            res.send({
                "message": `User ${req.params.id} updated successfully` 
            });
        }
    } catch (error) {
        if(error?.isJoi === true) error.status = 422;
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await authSchemaForLogin.validateAsync(req.body);
        
        const user = await User.findOne({email: result.email});
        if(!user)  throw createError.NotFound("User not registered")
        
        const isMatch = await user.isValidPassword(result.password);
        if(!isMatch) throw createError.Unauthorized('Username/password not valid');
        
        await user.updateOne({loginTimeDate: Date.now(), loginTime: 0});
        
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        res.send({
            "username": user.name,
            "userId": user.email,
            "phoneNumber": user.phoneNumber,
            "accessToken": accessToken, 
            "refreshToken": refreshToken
        });
    } catch (error) {
        if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"));
        next(error);
    }
})

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);
        const accToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        res.send({accessToken: accToken, refreshToken : refToken});
    } catch (error) {
        next(error);
    }
})

module.exports = router;