const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementsSchema = new Schema(
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

    },
    {
        timestamps: true,
    }
);

const announcements = mongoose.model('announcements', announcementsSchema);

module.exports = announcements;