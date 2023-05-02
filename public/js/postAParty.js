function checkPartyName(partyName) {
  if (!partyName) return false;
  if (partyName.trim() == "") return false;
  if (typeof partyName != "string") return false;
  const cleanStr = partyName.replace(/[^\w]/g, "");
  return /[a-zA-Z]/.test(cleanStr);
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

//how would you check for party photo???

let postPartyForm = document.getElementById("postAPartyForm");

if (postPartyForm) {
  let partyName = document.getElementById("partyName");
  let partyAddress = document.getElementById("partyAddress");
  let musicalGenre = document.getElementById("genres");
  let coverPrice = document.getElementById("coverPrice");
  let partyType = document.getElementById("types");
  let partyDate = document.getElementById("partyDate");
  console.log(partyAddress)
  console.log(partyDate)
  let partyVenue = document.getElementById("partyVenue");
  let minAge = document.getElementById("minimumAge");
  let maxCap = document.getElementById("maximumCapacity");
  let partyDescription = document.getElementById("partyDescription");
  let partyCoverPhoto = document.getElementById("partyCoverPhoto");

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

  let dj2valid = true;

  postPartyForm.addEventListener("submit", (event) => {
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
      // postPartyForm.submit()

      const pic = partyCoverPhoto.files[0];
      const reader = new FileReader();

      reader.addEventListener("load",async () => {
        const base64DataUrl = btoa(reader.result);


        $.ajax('/postaparty', {
            type: 'POST',  // http method
            data: { images: { partyName: partyName.value,
                partyAddress: partyAddress.value, 
                genres: genres.value, 
                coverPrice: coverPrice.value,
                 types: types.value, 
                 partyDate: partyDate.value, 
                 partyVenue: partyVenue.value, 
                 minimumAge: minimumAge.value, 
                 maximumCapacity: maximumCapacity.value,
                 partyDescription: partyDescription.value,
                 partyCoverPhoto: base64DataUrl
                }}
                
        });


      });

      reader.readAsDataURL(pic);
    }
  });
}
