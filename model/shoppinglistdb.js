const nedb = require('nedb-promise');
const database = new nedb({ filename: 'shoppinglist.db', autoload: true });

async function getList(accountId) {
    const result = await database.find({ accountId })
    return result
}

async function addItem(shopperItem) {
    const result = await database.insert(shopperItem)
    return result;
}

async function deleteItem(test) {
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

async function updateItem(itemId, item) {    
    const result = await database.update({id: itemId}, {$set: {amount: item.amount, itemIsDone: item.itemIsDone}})
    return result
}


module.exports = { getList, addItem, deleteItem, removeAll, updateItem }