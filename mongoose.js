const mongoose = require('mongoose');
const env = require('./env');

const onConnect = async () => {
    const usersSchema = new mongoose.Schema({
        firstName: String,
        lastName: String
    });
    usersSchema.methods.printInfo = function () {
        console.log(this.firstName + ' ' + this.lastName);
    };
    const User = mongoose.model('User', usersSchema);

    const firstUser = new User({firstName: 'Jan', lastName: 'Kowalski'});
    firstUser.lastName = "Nowak";
    await firstUser.save();
    firstUser.printInfo();


};

const databaseUrl = `mongodb://${env.mongodbUser}:${env.mongodbPassword}@${env.mongodbHost}:${env.mongodbPort}/${env.mongodbDatabase}`;
mongoose.connect(databaseUrl, {autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
    .then(onConnect, console.log);

