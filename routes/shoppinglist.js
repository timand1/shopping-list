const { Router } = require('express');
const router = Router();
const { getList, addItem, deleteItem } = require('../model/shoppinglistdb')

router.get('/', async (req, res) => {
    const accountId = req.headers.accountid
    const resObj = {
        success: false
    }
    if (!accountId) {
        resObj.message = 'Access denied'
    } else {
        const shoppinglist = await getList(accountId);

        if (shoppinglist.length > 0) {
            resObj.success = true
            resObj.list = shoppinglist
        } else {
            resObj.message = 'Empty list'
        }
    }
    res.json(resObj)
})

router.post('/', async (req, res) => {
    const accountId = req.headers.accountid
    const listItem = req.body
    if (listItem.antal === '-' || !listItem.antal) {
        listItem.antal = "1"
    }
    const resObj = {
        success: false
    }
    if (!accountId) {
        resObj.message = 'Access denied'
    } else if (listItem) {
        const added = await addItem(accountId, listItem)
        console.log(added)
        if (added) {
            resObj.success = true
            resObj.message = `${listItem} added`
        } else {
            resObj.message = `Error adding item`
        }
    }

    res.json(resObj)
})

router.delete('/', async (req, res) => {
    const accountId = req.headers.accountid
    const listItem = req.body
    const resObj = {
        success: false
    }
    if (!accountId) {
        resObj.message = 'Access denied'
    } else if (listItem) {
        const added = await deleteItem(accountId, listItem)
        console.log(added)
        if (added) {
            resObj.success = true
            resObj.message = `${listItem} removed`
        } else {
            resObj.message = `Error removing item`
        }
    }

    res.json(resObj)
})

module.exports = router;