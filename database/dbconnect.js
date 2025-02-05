const mongoose = require('mongoose')

// mongoose.connection('mongodb://localhost:27017')

const dbConnect = () => {
    mongoose.connect(
        "mongodb+srv://mishansavaliya843:cuKBKH6N4bp8MC6o@cluster0.7amtw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        {
            dbName: "practical",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then(() => console.log('database connected'));
}
module.exports = dbConnect
