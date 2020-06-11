const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
	firstname: {type: String, required: true, min:3,},
	lastname: {type: String, required: true, min:3,},
	bio: {type: String, max:100},
	articles:[{
		type: Schema.Types.ObjectId,
		ref: 'Article'
		}
	],
	email: {type: String, required: true},
	emailConfirmation: {type:Boolean, default: false},
	password: {type: String, min:8, required: true}
}, {
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
	id: false,
});

//virtual schema 'fullname' for userSchema
userSchema.virtual('fullname').get(function(){
	return (this.firstname + " " + this.lastname);
});

//url parameter for user
userSchema.virtual('url').get(function(){
	return '/users/'+this._id;
});

module.exports = mongoose.model('User', userSchema);
