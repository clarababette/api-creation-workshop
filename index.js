const express = require('express');
const app = express();
require('dotenv').config();
const _ = require('lodash');

const garments = require('./garments.json');
const jwt = require('jsonwebtoken');

// enable the static folder...
app.use(express.static('public'));

// import the dataset to be used here

const PORT = process.env.PORT || 4017;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const GarmentManager = require('./shop/garment-manager');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://missy_tee:missy123@localhost:5432/missy_tee_app';
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const garmentManager = GarmentManager(pool);

// API routes to be added here

app.get('/api/garments', authenticateToken, async (req, res) => {
  const gender = req.query.gender;
  const season = req.query.season;
  const filteredGarments = await garmentManager.filter({gender, season});
  res.json({
    garments: filteredGarments,
  });
});

app.post('/api/garments', authenticateToken, (req, res) => {
  // get the fields send in from req.body
  const {description, img, gender, season, price} = req.body;

  // add some validation to see if all the fields are there.
  // only 3 fields are made mandatory here
  // you can change that

  if (!description || !img || !price) {
    res.json({
      status: 'error',
      message: 'Required data not supplied',
    });
  } else if (
    garments.find((garment) =>
      _.isEqual(garment, {description, img, gender, season, price}),
    )
  ) {
    res.json({
      status: 'error',
      message: 'Garment already exists',
    });
  } else {
    // you can check for duplicates here using garments.find

    // add a new entry into the garments list
    garments.push({
      description,
      img,
      gender,
      season,
      price,
    });

    res.json({
      status: 'success',
      message: 'New garment added.',
    });
  }
});

app.get('/api/garments/price/:price', authenticateToken, (req, res) => {
  const maxPrice = Number(req.params.price);
  const filteredGarments = garments.filter((garment) => {
    // filter only if the maxPrice is bigger than maxPrice
    if (maxPrice > 0) {
      return garment.price <= maxPrice;
    }
    return true;
  });

  res.json({
    garments: filteredGarments,
  });
});

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '24h',
  });
};

app.post('/auth', (req, res) => {
  const username = req.query.username;
  if (username == 'clarababette') {
    const user = {username: 'clarababette'};
    const accessToken = generateAccessToken(user);
    //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '24h'});
    res.json({accessToken: accessToken});
  }
  res.sendStatus(401);
});

function authenticateToken(req, res, next) {
  const token = req.query.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, function () {
  console.log(`App started on port ${PORT}`);
});
