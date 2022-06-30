const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const { getList, addItem, deleteItem, removeAll, updateItem } = require('../model/shoppinglistdb')

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
            resObj.success = true
            resObj.list = []
        }
    }
    res.json(resObj)
})

router.post('/', async (req, res) => {
    const accountId = req.headers.accountid
    const listItem = req.body

    const resObj = {
        success: false
    }

    if (listItem) {

        listItem.item = listItem.item.toLowerCase()
        if (listItem.amount === '-' || !listItem.amount) {
            listItem.amount = "1"
        }

        const shopperItem = {
            item: listItem.item,
            amount: listItem.amount,
            comment: listItem.comment,
            accountId: accountId,
            id: uuidv4()
        }

        if (!accountId) {
            resObj.message = 'Access denied'
        } else if (listItem) {
            const checkExisting = await getList(shopperItem.accountId)
            const filteredCheck = checkExisting.filter(item => item.item === shopperItem.item)
            if(filteredCheck.length === 0) {
                const added = await addItem(shopperItem)
                if (added) {
                    resObj.success = true
                    resObj.message = `${listItem.item} added`
                } else {
                    resObj.message = `Error adding item`
                }
            } else {
                resObj.success = true
                resObj.message = `${shopperItem.item} already exist`
            }
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
        const added = await deleteItem(listItem)
        if (added) {
            resObj.success = true
            resObj.message = `${listItem} removed`
        } else {
            resObj.message = `Error removing item`
        }
    }

    res.json(resObj)
})

router.delete('/all', async (req, res) => {
    const accountId = req.headers.accountid;

    const resObj = {
        success: false
    };

    if(accountId) {
        const deleteAmount = await removeAll(accountId)
        if(deleteAmount > 0) {
            resObj.success = true
            resObj.message = `${deleteAmount} items removed.`
        } else if(deleteAmount === 0) {
            resObj.success = true
            resObj.message = `No items removed.`
        } else {
            resObj.message = `Error`
        }
    }
       res.json(resObj) 
})

router.post('/:id', async (req, res) => {
    const itemId = req.params.id
    const item = req.body

    const resObj = {
        success : false
    }

    const updatedItem = await updateItem(itemId, item)
    if(updatedItem) {
        resObj.success = true
        resObj.message = `${updatedItem} updated`
    } else {
        resObj.message = 'Error'
    }

    res.json(resObj)
})

module.exports = router;