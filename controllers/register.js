const handleRegister = (req, res, db, bcrypt) => {
	// data validation
	const {email, name, password} = req.body;
	if(!email || !name || !password){
		return res.status(400).json('incorrect form submission');
	}

	// create a hash of your password. You can go from password to hash but can't go from hash to password. Secure.
	var hash = bcrypt.hashSync(password);

	// we'll update both the users and login table together and want either both to succeed or both to fail.
	// So we'll use transactions
	db.transaction(trx => {
		// Transaction 1: updating login table with email id and password hash
		trx.insert({
			hash : hash,
			email : email
		})
		.into('login')
		.returning('email')
		// email of the user is returned as loginEmail by the trx.insert part
		.then(loginEmail => {
			// Transaction2. Updating users table. Executed only if first one is successful.
			// Always remember to use the return statement here.
			return trx('users')
				.returning('*')
				.insert({
					email : loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('unable to register'));
	// we're not inserting id and entries because they have default values
	// id is autoincremented (serial)
	// The .returning * is to return all the columns of the entered row as a response
}

module.exports = {
	handleRegister: handleRegister
};