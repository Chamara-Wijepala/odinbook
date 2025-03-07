import bcrypt from 'bcryptjs';

export const userData = {
	firstName: 'John',
	lastName: 'Doe',
	username: 'JohnDoe1990',
	password: 'helloworld',
};

export const hash = bcrypt.hashSync(userData.password, 10);

export const jwtRegex =
	/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/;
