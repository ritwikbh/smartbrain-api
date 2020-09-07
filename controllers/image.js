const Clarifai = require('clarifai');
const app = new Clarifai.App({
	apiKey: 'Your_API_Key_here'
});
const handlApiCall = (req, res) => {
	console.log('wrapper1');
	console.log(req.body.input);
	console.log('wrapper2');
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		console.log(data);
		res.json(data);
	})
	.catch(err => res.status(400).json('unable to call API'));
}

// this endpoint is used when a user searches for an image. We use this to update the user's search count
const handleImage = (req, res, db) => {
	const {id} = req.body;
	// updates the entries count
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => res.json(entries[0]))
		.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage: handleImage,
	handlApiCall: handlApiCall
};