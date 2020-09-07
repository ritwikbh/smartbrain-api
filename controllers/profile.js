// :id means that the last part of the endpoint will be a param like www.facebook.com/user/12321, here 12321 can be a param if it is coded like :id and can be grabbed by browser as such
const handleProfileGet = (req, res, db) => {
	// grabbing the id from the params, destructuring
	const {id} = req.params;
	
	db.select('*').from('users').where({id : id})
		.then(user => {
			// array of users returned. can be empty too
			if(user.length){
				res.json(user[0])
			}
			else{
				res.status(400).json('not found');
			}
		})
		.catch(err => res.status(400).json('error getting user'));
}
module.exports = {
	handleProfileGet: handleProfileGet
};