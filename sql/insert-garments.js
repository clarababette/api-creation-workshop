const { writeFileSync } = require('fs');
const garments = require('../garments.json');

const glist = garments.map(({description, img, season, gender, price}) =>
	`insert into garment(description, img, season, gender, price) values ('${description}', '${img}', '${season}', '${gender}', '${price}');`);
const sql = glist.join(`\n`);

writeFileSync('insert_garments.sql', sql);