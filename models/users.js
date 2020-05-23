const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
	firstname: {type: String, required: true, min:3,},
	lastname: {type: String, required: true, min:3,},
	bio: {type: String, max:100},
	articles: {
		type: [Schema.Types.ObjectId],
		ref: 'Article'
	},
	email: {type: String, required: true},
	emailConfirmation: {type:Boolean, default: false},
	password: {type: String, min:8, required: true}
});

module.exports = mongoose.model('User', userSchema);