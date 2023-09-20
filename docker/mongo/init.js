db = db.getSiblingDB('mongo');

db.createCollection('tasks');
db.createCollection('users');
db.createCollection('blacklists');
