# Secure your API

There is no security on the API endpoints that we have created and once deployed they can be called by anyone. In this sectione we are going to fix that by using JSON Web Tokens.

Watch these 2 videos before your proceed:

* [What Is JWT and Why Should You Use JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM)
* [JWT Authentication Tutorial - Node.js](https://www.youtube.com/watch?v=mbsmsi7l3r4)

## Try our JSON web tokens

Create a new express app called `api-with-jwt-and-json-placeholder` that use the data from the `https://jsonplaceholder.typicode.com/users` API.

Create these roots:

API route    | Type | Parameters | Description
-------------|------|-------- | --------
`/api/login` | POST | `{username : 'username_to_login' }` | Create a JWT token - the token should store the username. The API should only create a token if the supplied username is a valid username in the [jsonplaceholder users API] (https://jsonplaceholder.typicode.com/)
`/api/posts` | GET  | none | Return all the posts for the username stored in the token. The end point is not accessible without a valid JWT token. Use the token created by the call to `/api/login`.

The token should be expire after 5 minutes. Experiment with different token expiration, times.

The token is to be sent in as a BEARER token in the header or the request.

Use:
	* ExpressJS with [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to create the tokens
	* [dotenv](https://www.npmjs.com/package/dotenv) to read the token secret from a `.env` file
	* axios to call the [jsonplaceholder API](https://jsonplaceholder.typicode.com/users)
	* Thunder Client in VSCode to test this API

Use these calls on the JSON placeholder API

 URL   | Description		
-------|-----
https://jsonplaceholder.typicode.com/users?username=UserNameHere| Find a user by username - create a token if this is a valid user.
https://jsonplaceholder.typicode.com/users/userIdHere/posts | Get the userId from the user that was looked up via the token. 

### Project setup

Run these commands to setup the project.

```
mkdir api-with-jwt-and-json-placeholder
cd api-with-jwt-and-json-placeholder 
npm init -y
npm install express dotenv jsonwebtoken axios
```

## Add a JWT token to Missy Tee

Add a JWT token to your Missy Tee API.

The token should expire after 24 hours.

Store your own GitHub username in the token.

```
{
	username : "Your GitHub username"
}
```

Your app should only be accessible using a JWT token that contains your GitHub `username`.

Read the `JWT` token from `localStorage`.

## Extra information

Send a token with axios as a query parameter or a [header](https://flaviocopes.com/axios-send-authorization-header/).

Article to read about [Authentication approaches](https://stackoverflow.com/questions/17000835/token-authentication-vs-cookies#:~:text=A%20Token%20can%20be%20given,browser%20(by%20the%20browser).).