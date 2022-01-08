const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema(
    {
        portalId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            data: Buffer,
            contentType: String
        },
        cost: {
            type: Number,
            required: false,
            default: 0,
        },

    },
    {
        timestamps: true,
    }
);

const store = mongoose.model('store', storeSchema);

module.exports = store;