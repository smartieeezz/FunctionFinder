const checkString= (string)  => {
    //make sure the string exists
    if (!string) {
        throw `Error: All variables must exist.`
    }
    //make sure the string is not empty
    string = string.trim()
    if (string=="") {
        throw `Error: The variable cannot be empty.`
    }
    //check for spaces
    if (string.includes(' ')) {
        throw `Error: The variable cannot have a space.`
    }
    return string
}

const checkAge = (DOB) => {
    const today = new Date();

    let day = String(today.getDate());
    if (day.length<2) {
        day = "0"+day
    }
    let month = String(today.getMonth() + 1);
    if (month.length<2) {
        month = "0"+month
    }
    const year = String(today.getFullYear());

    // Format the current date as "MM/DD/YYYY"
    const formattedDate = `${month}/${day}/${year}`;
    month = parseInt(month)
    //get the DOB we were given
    const deconstructedDOB = DOB.split("/")


    console.log(deconstructedDOB)
    console.log(formattedDate)


    const dobYear = parseInt(deconstructedDOB[2])
    const dobMonth = parseInt(deconstructedDOB[0])
    const dobDay = parseInt(deconstructedDOB[1])
    const todayYear = parseInt(year)
    

    if (todayYear<dobYear){ 
        throw `Error: You can't have a birthyear after today's date. That makes no sense.`
    }
    const yearDifference = todayYear-dobYear
    if (yearDifference<18) {
        throw `Error: You must be 18 or older to use this site.`
    }
    //if you're born in a month that is before the current date's month then you're too young
    if ((yearDifference==18 && month>dobMonth)) {
        throw `Error: You must be 18 or older to use this site.`
    }
    //if you're born in the same month and the current day is after your birthday then you're too young
    if ((yearDifference==18) && (month==dobMonth && day>dobDay)) {
        throw `Error: You must be 18 or older to use this site.`
    }
    else {
    return DOB
    }
}

const checkEmail = (email) =>{
    checkString(email)
    const properAddress = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!properAddress.test(email)) {
        throw `Error: The email is not a valid email.`
    }
    email = email.toLowerCase()
    email = email.trim()
    return email;
}

const checkPassword = (password) => {
    checkString(password)
    if (password.length<8) {
        throw 'Error: Password must be at least 8 characters long.'
    }
    if (!/[A-Z]/.test(password)) {
        throw 'Error: The password must contain at least one uppercase character.'
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(password)) {
        throw 'Error: The password must contain at least one number.'
    }
    
    // Check for at least one special character
    if (!/[!"#$%&'()*+,\-.:;<=>?@[\]/^_`{|}~]/.test(password)) {
        throw 'Error: The password must contain at least one special character.';
    }
    return password
}


export {checkAge, checkEmail, checkPassword}