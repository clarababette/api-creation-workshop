# Create an API with a SQL database

In this section the garments will be stored in a PostgreSQL database.

You will need to have PostgreSQL installed on your PC.

## Database setup

### Installing Postgres on Windows

Download Postgesql from [this link](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) and install it.

Specify a password of `pg123` when prompted - this is for the `postgres` user.

### Installing Postgres on Linux

To install postgres on Linux use these commands:

```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### Create the user role & database

Now in the terminal or the Windows command line run these commans

```
sudo -u postgres psql;
```

Create a database and a user to access the databae by running this command

```ddl
create database missy_tee_app;
create role missy_tee login password 'missy123';
grant all privileges on database missy_tee_app to missy_tee;
```

### Create table for the garments

Login as the `missy_tee` database use with `psql`:


```
psql -U missy_tee -D missy_tee_app -P
```

Type in the password of `missy123` if prompted.

And then run this command in psql (copy and paste it) to create the `garment` table:

```ddl
create table garment(
	id serial not null primary key,
	description text,
	img text,
	season text,
	gender text,
	price decimal(10,2)
);
```

To add entries to the `garment` table run the sql commands in the `sql/insert_garments.sql` file

```ddl
\i sql/insert_garments.sql
```

### Change the code to use the database

The next step is to change the code to use the database instead of the `.json` file.

Start by installing the postgresql driver

```
npm install pg
```

Next set a database connection up in the `index.js` file

Add this code to the `index.js` file:

```js

const GarmentManager = require('./shop/garment-manager');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://missy_tee:missy123@localhost:5432/missy_tee_app';

const pool = new Pool({
	connectionString,
});

const garmentManager = GarmentManager(pool);
```

Change the `/api/garments` route to use the database by using the `filter` method on the `garmetManager` Factor Function.

```js
app.get('/api/garments', async function(req, res){

	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = await garmentManager.filter({
		gender,
		season
	});

	res.json({ 
		garments : filteredGarments
	});
});

res.json();
```

If all worked well you should be able to see all the garments on the screen. And you should be able to filter data.

Also change the price filter route `/api/garments/price/:price` to use the `filterByPrice` method on the Factory Function

```js
app.get('/api/garments/price/:price', async function(req, res){

	const maxPrice = Number(req.params.price);
	const filteredGarments = await garmentManager.filterByPrice(maxPrice);

	res.json({ 
		garments : filteredGarments
	});
});
```

Please make sure to study the code in the `shop/garment-manager.js` file. Ask if you have any questions about the code.

> **Note the use** of `async` & `await` in the above routes. You can [read more here](https://exploringjs.com/impatient-js/ch_async-js.html#a-roadmap-for-asynchronous-programming-in-javascript) and [here](https://exploringjs.com/impatient-js/ch_async-functions.html) if you need to refresh on async programming in JavaScript.

## Adding garments to the database

The next step is to add support to store garments in the database.


## Create a user table

Next we need to add a some user support to our online shop to allow each user to buy what they need.

Create a user table in PostgreSQL using this script.

```ddl
create table system_user(
	id serial not null primary key,
	first_name text,
	last_name text,
	password text,
	email text,
	username text,
	user_role text
);
```

Supported roles are: `client` & `admin`.

Store password hashed using [bcrypt](https://www.npmjs.com/package/bcrypt).

Next we need to create these API routes to list, create & update system users

* `/api/users` a `get` route to return a list of users
* `/api/users/:id` a `get` route to show details for a given user
* `/api/users` a `post` route to create a new user for all the given information
* `/api/users/:id` a `post` route that update the details of the given user
* `/api/login/` - that checks the supplied username and password and return a JWT token. The token should contains `username` & `role`.

The user JSON file looks like this

```json
{
	"first_name" : '',
	"last_name" : '',
	"password" : '',
	"email" : '',
	"username" : '',
	"user_role" : ''
}
```

### Test the API end points

Create the above routes in `index.js` and create the database code in `shop/user-manager.js` and test them with `Thunder Client`.

And create some `mocha` tests to make sure the APIs are working. Call the API endpoints in the tests from using `axios`.

## Create a user cart for each user

For an user to be able to shop for products the app need a Shopping cart - each user only can have one active shopping cart at any given time. A users active shopping cart should be displayed on the screen.

A shopping cart can have a status of `open` or `completed`.

If the checkout button is pressed a carts status is moving from `open` to `completed` and a user should see an empty cart afterwards


The database tables to be created are as follows:

```ddl

create table shopping_cart(
	id serial not null primary key,
	user_id number,
	status text,
	foreign key (user_id) references system_user(id)
);

create table shopping_cart(
	id serial not null primary key,
	status string,
	cart_id int not null,
	garment_id int not null,
	qty int,
	foreign key (cart_id) references cart(id),
	foreign key (garment_id) references garment(id)
);

```

### Show the shopping cart & the checkout button

To show the shopping cart on the screen remove the `hidden` class on the div with a `cart` class.
Also remove the `hidden` - `Add to cart` button in the Handlebars template using to show the Garments.

> **Note:** the `data-garmentId` data attribute on the `Add to cart button`
