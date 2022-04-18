const { generatePrime } = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const generateAccessToken = (payload) => {
    const signedJWT = jwt.sign(payload, secretKey);
    return signedJWT;
}

module.exports = generateAccessToken;