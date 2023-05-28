const mongoose = require('mongoose');

let friendshipSchema = new mongoose.Schema({

    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Friendship = new mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;
