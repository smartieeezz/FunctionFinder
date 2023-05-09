
// import dotenv from 'dotenv';

// dotenv.config({path: '../.env'})


function checkPartyName(partyName) {
  if (!partyName) return false;
  if (partyName.trim() == "") return false;
  if (typeof partyName != "string") return false;
  const cleanStr = partyName.replace(/[^\w]/g, "");
  return /[a-zA-Z]/.test(cleanStr);
}

//assume that we pass in types.value 
function checkSelect(select){
  let selectedOptions = []

  for (const sel of select.options){
    if (sel.selected){
      selectedOptions.push(sel.value)
    }
  }

  return selectedOptions
}
// needed a little bit of help with base 64 encoding
// next time im using s3 goodnight 
// https://codepen.io/bitbug/pen/wvxqWNa
function convertImageToBase64(imgUrl, callback) {
  const image = new Image();
  image.crossOrigin='anonymous';
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL();
    callback && callback(dataUrl)
  }
  image.src = imgUrl;
}

//for check address, perhaps include google maps dropdown api

function checkNumberInput(coverPrice) {
  if (/^\d+$/.test(coverPrice) == false) {
    return false;
  }
  coverPrice = parseInt(coverPrice);
  if (isNaN(coverPrice)) {
    return false;
  }
  if (coverPrice < 0) {
    return false;
  }
  return true;
}

function checkDate(partyDate) {
  //check if date has passed, throw error if it has
  const date = new Date(partyDate);
  const now = new Date();
  return date >= now;
}

function checkPartyVenue(venue) {
  if (!venue) return false;
  if (venue.trim() == "") return false;
  if (typeof venue != "string") return false;
  const cleanStr = venue.replace(/[^\w]/g, "");
  return /[a-zA-Z]/.test(cleanStr);
}

function checkMaxCapacity(cap) {
  if (cap < 1) return false;
  return true;
}

function checkPartyDescription(pd) {
  if (pd.trim() == "") return false;
  const cleanStr = pd.replace(/[^\w]/g, "");
  return /[a-zA-Z]/.test(cleanStr);
}

function checkPhoto(pic){
  if (pic.files[0].size > 2097152){
    return false
  }
}

//how would you check for party photo???
let postPartyForm = document.getElementById("postAPartyForm");

if (postPartyForm) {
  let partyName = document.getElementById("partyName");
  let partyAddress = document.getElementById("partyAddress");
  let musicalGenre = document.getElementById("genres")
  let coverPrice = document.getElementById("coverPrice");
  let partyType = document.getElementById("types")
  let partyDate = document.getElementById("partyDate");
  let partyVenue = document.getElementById("partyVenue");
  let minAge = document.getElementById("minimumAge");
  let maxCap = document.getElementById("maximumCapacity");
  let partyDescription = document.getElementById("partyDescription");
  let partyCoverPhoto = document.getElementById(".local");


  const partyNameError = document.createElement("div");
  const partyAddressError = document.createElement("div");
  const musicalGenreError = document.createElement("div");
  const coverPriceError = document.createElement("div");
  const partyTypeError = document.createElement("div");
  const partyDateError = document.createElement("div");
  const partyVenueError = document.createElement("div");
  const minAgeError = document.createElement("div");
  const maxCapError = document.createElement("div");
  const partyDepError = document.createElement("div");
  const partyPhotoError = document.createElement("div");

  // again going to use s3 in the future bc bruh 
  // https://codepen.io/bitbug/pen/wvxqWNa
  const $file = document.querySelector(".local");
  let srcData
  $file.addEventListener("change", (event) => {
    const selectedfile = event.target.files;
    if (selectedfile.length > 0) {
      const [imageFile] = selectedfile;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        srcData = fileReader.result;
        //console.log('base64:', srcData)
      };
      fileReader.readAsDataURL(imageFile);
    }
  });

  

  postPartyForm.addEventListener("submit", async (event) => {

    let dj2valid = true;

    event.preventDefault();
    partyNameError.remove();
    partyAddressError.remove();
    musicalGenreError.remove();
    coverPriceError.remove();
    partyTypeError.remove();
    partyDateError.remove();
    partyVenueError.remove();
    minAgeError.remove();
    maxCapError.remove();
    partyDepError.remove();
    partyPhotoError.remove();
    // if (checkPhoto(partyCoverPhoto) == false){
    //   dj2valid = false
    //   partyPhotoError.textContent = "Error: party cover photo too big. Must be less than 2MB."
    //   partyCoverPhoto.parentElement.appendChild(partyPhotoError)
    // }
    let checkTypes = checkSelect(partyType)
    if (checkTypes.length == 0){
      dj2valid = false;
      partyTypeError.textContent = "Error: please select party types";
      partyType.parentElement.appendChild(partyTypeError);
    }
    let checkGenres = checkSelect(musicalGenre)
    if (checkGenres.length == 0){
      dj2valid = false;
      musicalGenreError.textContent = "Error: please select party genres";
      musicalGenre.parentElement.appendChild(musicalGenreError);
    }
    if (checkPartyName(partyName.value) == false) {
      dj2valid = false;
      partyNameError.textContent = "Error: invalid party name";
      partyName.parentElement.appendChild(partyNameError);
    }
    if (checkNumberInput(coverPrice.value) == false) {
      dj2valid = false;
      coverPriceError.textContent = "Error: invalid cover price";
      coverPrice.parentElement.appendChild(coverPriceError);
    }
    // checkAddy(partyAddress.value)
    // if (checkAddy(partyAddress.value) == false){
    //   dj2valid = false
    //   partyAddressError.textContent = "Error: invalid party address"
    //   partyAddress.parentElement.appendChild(partyAddressError)
    // }
    if (checkPartyDescription(partyDescription.value) == false) {
      dj2valid = false;
      partyDepError.textContent = "Error: invalid party description";
      partyDescription.parentElement.appendChild(partyDepError);
    }
    if (checkDate(partyDate.value) == false) {
      dj2valid = false;
      partyDateError.textContent = "Error: invalid party date";
      partyDate.parentElement.appendChild(partyDateError);
    }
    if (checkPartyVenue(partyVenue.value) == false) {
      dj2valid = false;
      partyVenueError.textContent = "Error: invalid party venue";
      partyVenue.parentElement.appendChild(partyVenueError);
    }
    if (checkNumberInput(maxCap.value) == false) {
      dj2valid = false;
      maxCapError.textContent = "Error: invalid maximum capacity";
      maxCap.parentElement.appendChild(maxCapError);
    }

    if (dj2valid == true) {
      console.log("form does not has error")

      let requestConfig = {
        method: 'POST',
        url: '/postaparty',
        data: { 
          partyName: partyName.value,
          partyAddress: partyAddress.value, 
          genres: checkGenres, 
          coverPrice: coverPrice.value,
          types: checkTypes, 
          partyDate: partyDate.value, 
          partyVenue: partyVenue.value, 
          minimumAge: minimumAge.value, 
          maximumCapacity: maximumCapacity.value,
          partyDescription: partyDescription.value,
          //partyCoverPhoto: srcData
        } 
      };      
      $.ajax(requestConfig)
      .then(function(response) {
        window.location.replace('/postaparty/partypostedconfirmation');  
      })
      .catch(function(error) {
        window.location.replace('/postaparty/addressnotfound');  
      });

    } else{
      console.log("form has error")
      console.log(dj2valid)
      event.preventDefault()
    }
  });
}
