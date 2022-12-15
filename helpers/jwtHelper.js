const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../Models/User.model');
require("dotenv").config();

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payLoad = {
                aud: userId
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "20m",
                issuer: "Node Test"
            };
            jwt.sign(payLoad, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        })
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unathorized' : err.message;
                return next(createError.Unauthorized(err.message));
            }
            req.payload = payload;
            next();
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payLoad = {}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "Our wesite name", 
                audience: userId
            }; 
            jwt.sign(payLoad, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        })
    }, 
    verifyRefreshToken: (refreshtoken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, payLoad) => {
                if(err) return reject(createError.Unauthorized())
                const userId = payLoad.aud;
                resolve(userId);
            })
        })
    }
}