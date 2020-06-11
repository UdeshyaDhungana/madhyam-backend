const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
	title: {
		type:String, min:5, required: true
	},
	paragraphs: {
		type: [String], required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	edited: {type: Boolean, default: false}
},{
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
	id: false,
});

articleSchema.virtual('url').get(function(){
	return '/articles/'+this._id;
})

module.exports = mongoose.model('Article', articleSchema);
