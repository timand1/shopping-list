const nedb = require('nedb-promise');
const database = new nedb({ filename: 'favorites.db', autoload: true });

async function getFavorites(accountInfo) {
    const result = await database.find({ accountId: accountInfo })
    return result
}

async function addFavorite(item) {
    const result = await database.insert(item)
    return result
}

async function checkIfExist(item) {
    const accountId = item.accountId
    const favoriteItem = item.item
    let result = await database.find({accountId})
    const filteredArr = result.filter(e => e.item === favoriteItem)
    return filteredArr
}

async function removeFavorite(test) {
    let result;
    for(const item of test) {
        result = await database.remove({ id: item.id }) + result
    }
    return result;
}

async function removeAll(id) {
    const result = await database.remove({ accountId: id }, { multi: true });
    return result;
}


module.exports = { getFavorites, addFavorite, checkIfExist, removeFavorite, removeAll}