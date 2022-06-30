const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
const {getFavorites, addFavorite, checkIfExist, removeFavorite, removeAll} = require('../model/favoritesdb');

router.get('/', async (req, res) => {
    const accountId = req.headers.accountid

    const resObj = {
        success : false
    };

    const favoritesList = await getFavorites(accountId)

    if(favoritesList.length > 0) {
        resObj.success = true
        resObj.favorites = favoritesList
    } else {
        resObj.success = true
        resObj.favorites = 'No favorites'
    }

    res.json(resObj)

})

router.post('/', async (req, res) => {
    const accountId = req.headers.accountid
    const itemBody = req.body
    const resObj = {
        success : false
    };
    
    if(accountId && itemBody) {
        let favoriteObj = {}
        if(itemBody.id) {
            favoriteObj = {
                item:itemBody.item,
                accountId: accountId,
                id:itemBody.id
            }
        } else {
            favoriteObj = {
                item: itemBody.item.toLowerCase(),
                accountId: accountId,
                id: uuidv4()
            }
        }
        const checkFavorite = await checkIfExist(favoriteObj)
        if(checkFavorite.length === 0) {
            const result = await addFavorite(favoriteObj)
            if(result) {
                resObj.success = true
                resObj.message = `${favoriteObj.item} added to favorites`
            }
        } else {
            resObj.success = true
            resObj.message = `${favoriteObj.item} is already a favorite`
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
        const added = await removeFavorite(listItem)
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

module.exports = router;