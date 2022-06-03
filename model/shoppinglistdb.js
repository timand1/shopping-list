const nedb = require('nedb-promise');
const database = new nedb({ filename: 'shoppinglist.db', autoload: true });

async function getList() {
    const result = await database.find({})
    return result
}

async function addItem(item) {
    const result = await database.insert({ item });
    return result;
}

async function deleteItem(item) {
    const result = await database.remove({ item });
    return result;
}

module.exports = { getList, addItem, deleteItem }