const nedb = require('nedb-promise');
const database = new nedb({ filename: 'shoppinglist.db', autoload: true });

async function getList(accountId) {
    const result = await database.find({ accountId })
    return result
}

async function addItem(accountId, item) {
    let result = await database.find({ accountId })
    if (result.length > 0) {
        result = await database.update({ accountId: accountId }, { $push: { listItems: item } })
    } else {
        result = await database.insert({ accountId: accountId, listItems: [item] })
    }

    return result;
}

async function deleteItem(accountId, item) {
    console.log(item)
    const banana = await database.find({ "listItems.item": item })
    console.log(banana)
    const result = await database.update({ accountId: accountId }, { $pull: { "listItems": { "item": item } } }, { multi: true });
    return result;
}

module.exports = { getList, addItem, deleteItem }