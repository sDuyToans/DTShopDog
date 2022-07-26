const mongoose = require('mongoose');
const Dog = require('../models/dogs');
const dogExam = require('./dog');

mongoose.connect('mongodb://localhost:27017/shopDog');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seeDB = async() =>{
    await Dog.deleteMany({});
    for (let i = 0; i < 6; i++){
        const dog = new Dog({
            name: dogExam[i].name,
            type: dogExam[i].type,
            age: dogExam[i].age,
            location: dogExam[i].location,
            description: dogExam[i].description,
            images: [dogExam[i].images],
            price: dogExam[i].price,
            author: dogExam[i].author
        });
        await dog.save()
    }
};
seeDB().then(() =>{
    db.close();
});

