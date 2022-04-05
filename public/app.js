const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2xhcmEiLCJpYXQiOjE2NDg4MjAwMjh9.W8Qf278kf7Vi9n1Lwv0rQu5I7Jw-_2fw1SfPsye7h84';

let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

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
      `/api/garments?gender=${genderFilter}&season=${seasonFilter}&token=${accessToken}`,
    )
    .then(function (result) {
      searchResultsElem.innerHTML = garmentsTemplate({
        garments: result.data.garments,
      });
    });
}

priceRangeElem.addEventListener('change', function (evt) {
  const maxPrice = evt.target.value;
  showPriceRangeElem.innerHTML = maxPrice;
  axios
    .get(`/api/garments/price/${maxPrice}?token=${accessToken}`)
    .then(function (result) {
      searchResultsElem.innerHTML = garmentsTemplate({
        garments: result.data.garments,
      });
    });
});

filterData();
