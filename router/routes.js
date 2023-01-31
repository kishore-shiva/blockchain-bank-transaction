const express = require('express');
const router = express.Router();
const blockchainInstance = require('../blockchain/blockchain');
const {generateAccessToken, generateTransactionToken} = require('../middleware/generateToken');
const users = require('../users/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.secretKey;

let blockchain = new blockchainInstance.BlockChain();
let testBlockChain = new blockchainInstance.BlockChain();
//retrieving all user values:

fs.readFile(__dirname + "/../users/users.json", (err, data) => {
    if(err) throw err;
    let users = data;
    console.log('data is : '+JSON.stringify(JSON.parse(data)));
})

router.get('/test', (req, res) => {
    res.send('Hello World');
})

router.post('/login', (req, res) => {

    //authenticate users:

    const username = req.body.username;
    const password = req.body.password;
    

    if(username === 'admin' && password === 'admin'){
        const payload = {
            "username" : username,
            "password" : password
        }
        const accessToken = generateAccessToken(payload);
        res.status(200).json({ accessToken: accessToken });
    }
    else{
        res.status(500).send("invalid credentials");
    }
})

router.post('/test/transaction', (req, res) => {
    const accessToken = req.body.accessToken;
    jwt.verify(accessToken, secretKey, (err, user) => {
        if(err){
            res.status(500).send("token verification failed");
        }
        else{
            const fromID = req.body.fromID;
            const toID = req.body.toID;
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            const blockData = {
                'from': party,
                'to': district,
                'amount': 1,
                'timestamp': timestamp
            }
            const block = new blockchainInstance.Block(blockData);
            testBlockChain.addNewBlock(block);
            testBlockChain.display();
            res.status(200).send("voted in test mode successfully");
        }
    })
})

router.post('/verifyToken', (req, res) => {
    const token = req.body.accessToken;
    jwt.verify(token, secretKey, (err, user) => {
        if(err){
            res.status(500).send("token verification failed");
        }
        else{
            res.status(200).send("token succesfully verified");
        }
    })
})

router.post('/create/transaction', (req, res) => {
    const accessToken = req.body.accessToken;
    const amount = req.body.amount;
    if(amount < 100000){
        res.status(500).send('transaction is only applicable for amount greater than 100000');
    }
    else{
        console.log("secret key : ", secretKey);
        jwt.verify(accessToken, secretKey, (err, user) => {
            if(err){
                res.status(500).send("token verification failed");
                console.log(err);
            }
            else{
                const payload = {
                    accessToken: accessToken,
                    amount: amount
                }
                const xTransactionSignature = generateTransactionToken(payload);
                res.status(200).json({xTransactionSignature: xTransactionSignature});
            }
        });
    }
})

router.post('processTransaction', (req, res) => {
    const xTransactionSignature = req.body.xTransactionSignature;
    jwt.verify(xTransactionSignature, secretKey, (err, data) => {
        if(err){
            res.status(500).send("token verification failed");
        }
        else{
            console.log(data);
            res.status(200).send("payment successfully processed. ");
        }
    })
})

router.post('/insert/block', (req, res) => {
    const name = req.body.name;
    const count = req.body.count;
    const blockData = {
        "name" : name,
        "count" : count
    }
    const block = new blockchainInstance.Block(blockData);
    blockchain.addNewBlock(block);
    res.send("block added");
})

// 1.Testing blockchain
// 2.Role Authentication
// 3.Kuberneties
// 4.Docker
module.exports = router;   
