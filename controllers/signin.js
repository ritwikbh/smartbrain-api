const handleSignin = (req, res, db, bcrypt) => {
	// validation
	const {email, password} = req.body;
	if(!email || !password){
		return res.status(400).json('incorrect form submission');
	}

	// Load hash from your password DB. What we do is compare the entered password of the user with the hash stored for that user
	// bcrypt will check whether on hashing this entered password we'll get the same hash as the one already stored in our DB, then we'll
	// let the user in, else not.
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
				.where('email', '=', email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials');
			}
		}).catch(err => res.status(400).json('wrong credentials'));
	// Note that res.send() was used earlier by us for sending json but res.json() is better.
}
module.exports = {
	handleSignin: handleSignin
};