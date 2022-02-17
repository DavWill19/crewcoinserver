const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const crewuserSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    newTransaction: {
        type: Boolean,
        default: false
    },
    newAnnouncement: {
        type: Boolean,
        default: false
    },
    newStoreItem: {
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
    pushToken: {
        type: String,
        default: '',
    },
    balance: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Crewuser', crewuserSchema);