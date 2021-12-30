const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const crewuserSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    firstname: {
        type: String,
        default: '',
    },
    lastname: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    portalId: {
        type: String,
        default: '',
    },
    organization: {
        type: String,
        default: '',
    },
    balance: {
        type: Number
    },
    history: {
        type: Array,
        default: []
    },
}
    ,
    {
        timestamps: true,
    }
);

crewuserSchema.plugin(passportLocalMongoose);

const CrewUser = mongoose.model('Crewuser', crewuserSchema);

module.exports = CrewUser;