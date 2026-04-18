import "./main.css"

const app = document.getElementById( "app" )

checkRoutes()

function checkRoutes() {

	if ( window.location.pathname === "/" ) {

		if ( !isLoggedIn() ) {

			return ( window.location.pathname = "/join" )
		}

		homePage()
	}
	else if ( window.location.pathname === "/join" ) {

		if ( isLoggedIn() ) {

			return ( window.location.pathname = "/" )
		}

		joinPage()
	}
}

function homePage() {

	const user = getUser()

	const innerHTML =  `
		<h1>Hi, @${ user.username }!</h1>
		<button id="logout">Logout</button>
	`

	app.innerHTML = innerHTML

	const logoutButton = document.getElementById( "logout" )

	logoutButton.onclick = () => {

		if ( logout() ) {

			window.location.pathname = "/"
		}
	}
}

function joinPage() {

	const innerHTML =  `
		<form class="auth">
			<div>
				<input id="username" type="text" autocomplete="username" placeholder="Username" required>
			</div>
			<div>
				<input id="email" type="email" placeholder="Email" />
			</div>
			<div>
				<input id="password" type="password" autocomplete="new-password" placeholder="Password" required>
			</div>
			<div>
				<button>Signup</button>
			</div>
			<div>
				<a href='/login'>Login</a>
			</div>
		</form>
	`

	app.innerHTML = innerHTML

	//

	const username = document.getElementById( "username" )
	const password = document.getElementById( "password" )
	const email = document.getElementById( "email" )
	const form = document.querySelector( "form" )

	//

	form.onsubmit = async e => {

		e.preventDefault()

		const body = {
			username: username.value,
			password: password.value,
			email: email.value,
		}

		try {
			const response = await fetch( "http://localhost:3000/join", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify( body ),
			} )

			const json = await response.json()

			localStorage.setItem( "auth_token", json.token )
			localStorage.setItem( "user", JSON.stringify( { username: json.username } ) )

			window.location.pathname = "/"
		}
		catch( error ) {

			console.error( error )
		}
	}
}

function isLoggedIn() {

	return !!localStorage.getItem( "auth_token" )
}

function getUser() {

	return JSON.parse( localStorage.getItem( "user" ) || "{}" )
}

function logout() {

	localStorage.removeItem( "auth_token" )
	localStorage.removeItem( "user" )

	return true
}
