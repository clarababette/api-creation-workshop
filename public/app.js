let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');
const filterElem = document.querySelector('.filter');
const addGarmentElem = document.querySelector('.addGarment');
const garmentsElem = document.querySelector('.garments');
const loginElem = document.querySelector('.login');
const loginBtn = document.querySelector('.loginBtn');
const usernameElem = document.querySelector('#username');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

seasonOptions.addEventListener('click', function (evt) {
  seasonFilter = evt.target.value;
  filterData();
});

genderOptions.addEventListener('click', function (evt) {
  genderFilter = evt.target.value;
  filterData();
});

function filterData() {
  axios
    .get(
      `/api/garments?gender=${genderFilter}&season=${seasonFilter}&token=${localStorage.getItem(
        'accessToken',
      )}`,
    )
    .then(function (result) {
      searchResultsElem.innerHTML = garmentsTemplate({
        garments: result.data.garments,
      });
      if (garmentsElem.classList.contains('hidden')) {
        accessUpdate();
      }
    })
    .catch((err) => {
      accessUpdate();
    });
}

priceRangeElem.addEventListener('change', function (evt) {
  const maxPrice = evt.target.value;
  showPriceRangeElem.innerHTML = maxPrice;
  axios
    .get(
      `/api/garments/price/${maxPrice}?token=${localStorage.getItem(
        'accessToken',
      )}`,
    )
    .then(function (result) {
      searchResultsElem.innerHTML = garmentsTemplate({
        garments: result.data.garments,
      });
    });
});

const login = () => {
  axios
    .post(`/auth?username=${usernameElem.value}`)
    .then((result) => {
      localStorage.setItem('accessToken', result.data.accessToken);
      accessUpdate();
      filterData();
    })
    .catch((err) => {
      loginElem.innerHTML += `<div style="color:red;">Access Denied<div>`;
    });
};

loginBtn.addEventListener('click', () => {
  login();
});

const accessUpdate = () => {
  filterElem.classList.toggle('hidden');
  addGarmentElem.classList.toggle('hidden');
  garmentsElem.classList.toggle('hidden');
  loginElem.classList.toggle('hidden');
};
filterData();
