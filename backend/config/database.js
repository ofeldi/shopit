const mongoose = require ('mongoose');



module.exports ={
    mongoURI:'mongodb+srv://shopituser:Oren12345@vacations.n7go5.mongodb.net/shopit?retryWrites=true&w=majority',
    secretOrKey:'secret'
}

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then(con =>{
        console.log(`MongoDB database is connected with HOST: ${con.connection.host}`)
    })

}


/*const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true
    }).then(con =>{
        console.log(`MongoDB database is connected with HOST: ${con.connection.host}`)
    })
}

*/
module.exports = connectDatabase
