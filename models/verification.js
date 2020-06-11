const mongoose = require('mongoose');
const crypto = require("crypto");

var Schema = mongoose.Schema;

var verificationSchema = new Schema({
	link: {
		type: String,
		required: true,
		default: crypto.randomBytes(15).toString('hex'),
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
});

module.exports = mongoose.model('Verification', verificationSchema);
