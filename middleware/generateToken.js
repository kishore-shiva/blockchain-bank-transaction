const { generatePrime } = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.secretKey;

const generateAccessToken = (payload) => {
    const signedJWT = jwt.sign(payload, secretKey, { 
        expiresIn: '10m',
      });
    return signedJWT;
}

const generateTransactionToken = (payload) => {
    const signedJWT = jwt.sign(payload, secretKey, {
        expiresIn: '2m',
    });
    return signedJWT;
}

module.exports = {generateAccessToken, generateTransactionToken};