import "./main.css"

const username = document.getElementById( "username" )
const password = document.getElementById( "password" )
const email = document.getElementById( "email" )
const form = document.querySelector( "form" )

form.onsubmit = async e => {

	e.preventDefault()

	const body = {
		username: username.value,
		password: password.value,
		email: email.value,
	}

	console.log( body )

	try {
		const response = await fetch( "http://localhost:3000/join", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify( body ),
		} )

		const json = await response.json()

		console.log( json )
	}
	catch( error ) {

		console.error( error )
	}
}
