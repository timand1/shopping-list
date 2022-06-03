const { Router } = require('express');
const router = Router();
const { getList, addItem, deleteItem } = require('../model/shoppinglistdb')

router.get('/', async (req, res) => {
    const shoppinglist = await getList();
    const resObj = {
        success: false
    }

    if (shoppinglist.length > 0) {
        resObj.success = true
        resObj.list = shoppinglist
    } else {
        resObj.message = 'Empty list'
    }
    res.json(resObj)
})

router.post('/', async (req, res) => {
    const listItem = req.body.item
    const resObj = {
        success: false
    }
    if (listItem) {
        const added = await addItem(listItem)
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
    const listItem = req.body.item
    const resObj = {
        success: false
    }
    if (listItem) {
        const added = await deleteItem(listItem)
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