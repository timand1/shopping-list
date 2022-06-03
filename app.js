const express = require('express')
const app = express();
const PORT = process.env.PORT || 8000;
const { v4: uuidv4 } = require('uuid');
const { accountCheck, createAccount, compareCredentials, checkIfAccountExist } = require('./model/accountdb')
app.use(express.json());

const shoppingRouter = require('./routes/shoppinglist')
app.use('/api/shoppinglist', auth, shoppingRouter)

async function auth(req, res, next) {
    const accountInfo = req.headers.accountid
    const checkAccount = await accountCheck(accountInfo)
    if (accountInfo && checkAccount.length === 1) {
        next();
    } else {
        const resObj = {
            error: 'Access denied'
        }
        res.json(resObj)
    }
}


app.post('/api/login', async (req, res) => {
    const credentials = req.body;
    const result = await compareCredentials(credentials)

    const resObj = {
        success: false
    }
    if (result.length === 1) {
        resObj.success = true
        resObj.message = 'Logged in'
    } else {
        resObj.message = 'Wrong username and/or password'
    }
    res.json(resObj)
})

app.post('/api/signup', async (req, res) => {
    const credentials = req.body;

    const checkIfExist = await checkIfAccountExist(credentials)

    const resObj = {
        success: false
    }

    if (checkIfExist.length > 0) {
        resObj.message = 'Account already exist.'
    } else {
        credentials.accountId = uuidv4();
        const result = await createAccount(credentials)

        if (result) {
            resObj.success = true;
            resObj.message = `Account ${credentials.username} created.`;
        }
    }

    res.json(resObj)
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} `);
})
