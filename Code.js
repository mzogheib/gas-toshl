var scriptProperties = PropertiesService.getScriptProperties();
var personalToken_ = scriptProperties.getProperty('API_TOKEN');
var baseApiUrl_ = 'https://api.toshl.com/';

// Toshl data as of 2018-04-05 22:38:00

function getAccountIdByName(name) {
  var accounts = { "Credit": "2596649", "Cash": "2417844" };
  return accounts[name];
}

function getCategoryIdByName(name) {
  var toshlCategories = { "01. Bike": "50841191", "01. Bills": "50841189", "01. Car": "50841187", "01. Eating Out": "48218584", "01. Leisure & Recreation": "50841190", "01. Misc": "50841186", "01. Shopping": "50841185", "01. Transport": "50841188", "Bank Interest": "51913829", "Charity": "48218593", "Clothing & Footwear": "48218585", "Education": "48218591", "Gifts": "48218592", "Health & Personal Care": "48218587", "Home & Utilities": "48218586", "Leisure": "48218589", "Loans": "48218600", "Other": "48218601", "Sports": "48218590", "Taxes": "48218595", "Transport": "48218588", "Grants": "48218599", "Reimbursements": "48218598", "Salary": "48218597", "unsorted": "unsorted" };
  return toshlCategories[name];
}

function getTagIdByName(name) {
  var toshlTags = { "Accesories": "17310116", "Accomodation": "17310120", "Alcohol": "17310157", "Books": "17310114", "Breakfast": "17310142", "Camping": "17310107", "Car Hire": "17310111", "Clothes": "17310130", "Coffee": "17310155", "Consumables": "17310123", "Cover Charge": "17310141", "Delivery": "34934068", "Dinner": "17310156", "Donations": "17310118", "Dry Cleaning": "17310124", "Education": "21111540", "Electricity": "17310106", "Flights, Trains & Busses": "17310103", "Full Bike": "17310128", "Gas": "23658690", "Gifts": "17310154", "Groceries": "17310147", "Haircut": "17310138", "Healthcare": "17310150", "Household Items": "17310152", "Hygiene": "17310122", "Insurance": "17310134", "Internet": "17310115", "Lunch": "17310148", "Medicinal & Health": "17310125", "Mobile Phone": "17310146", "Other": "34834997", "Parking": "17310131", "Parts": "17310136", "Petrol": "17310133", "Private Health": "17310135", "Public Transport": "17310144", "Records": "17310126", "Rent": "17310110", "Service": "17310149", "Snacks": "17310159", "Software": "17310139", "Souveniers": "17310108", "Streaming Service": "61308158", "Tax": "17310109", "Taxi & Uber": "17310129", "Tolls": "17310112", "Tools": "17310119", "Toys & Gadgets": "17310127", "Travel Insurance": "17310113", "Wash": "17310105", "zz. Holidays": "17310121" };
  return toshlTags[name];
}

function makeEntry(config) {
  var hasLocation = config.latitude && config.longitude;
  var location = hasLocation ? {
    latitude: config.latitude,
    longitude: config.longitude
  } : null;
  return {
    amount: config.amount,
    currency: { code: config.currencyCode },
    date: config.date,
    location: location,
    desc: config.time + '\n\n' + config.desc,
    account: getAccountIdByName(config.account),
    category: getCategoryIdByName(config.category),
    tags: config.tags.map(getTagIdByName)
  };
}

function addEntry(entry, onSuccessCallback, onErrorCallback) {
  var endpoint = 'entries';
  var url = baseApiUrl_ + endpoint;
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(personalToken_)
    },
    payload: JSON.stringify(entry),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() === 201) {
    Logger.log('response === 201');
    if (onSuccessCallback) onSuccessCallback();
  } else {
    Logger.log('response !== 201');
    if (onErrorCallback) onErrorCallback(response);
  }
}