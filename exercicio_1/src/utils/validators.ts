export function isValidName(name: string) {
	return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

export function isValidEmail(email: string) {
	return email.match(/^(.+)@(.+)$/);
}

export function isValidCarPlate(plate: string) {
	return plate.match(/[A-Z]{3}[0-9]{4}/);
}