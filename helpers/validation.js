const checkString= (string)  => {
    // make sure the string exists
    if (!string) {
        throw `Error: All fields must exist.`
    }
    if (typeof string!=='string') {
        throw `Error: This must be a string.`
    }
    //make sure the string is not empty
    string = string.trim()
    if (string=="") {
        throw `Error: The field cannot be empty.`
    }
    //check for spaces
    if (string.includes(' ')) {
        throw `Error: The field cannot have a space.`
    }
    return string
}

const checkName = (name) => {
    name = checkString(name);
        if (!/^[a-zA-Z]+$/.test(name)) {
    throw `Error: The name must contain only letters.`;
        }
    if (name.length < 2) {
        throw `Error: The name must be greater than 2 characters.`;
    } 
    if (name.length > 25) {
        throw `Error: The name must be less than 25 characters.`;
    }

    return name;
};


const checkAge = (DOB) => {
    const today = new Date();
    const givenDOB = new Date(DOB.replace(/-/g, '/'));
    // const givenDOB = new Date(DOB)
    givenDOB.setHours(0, 0, 0, 0); // Set time to midnight to compare dates only
    today.setHours(0, 0, 0, 0);
    
    let day = String(today.getDate());
    if (day.length < 2) {
        day = "0" + day;
    }
    let month = String(today.getMonth() + 1);
    if (month.length < 2) {
        month = "0" + month;
    }
    const year = String(today.getFullYear());

    // Format the current date as "MM/DD/YYYY"
    const formattedDate = `${month}/${day}/${year}`;
    month = parseInt(month);

    //get the DOB we were given
    const deconstructedDOB = DOB.split("/");

    const dobYear = parseInt(deconstructedDOB[2]);
    const dobMonth = parseInt(deconstructedDOB[0]);
    const dobDay = parseInt(deconstructedDOB[1]);

    const diffMonths = Date.now() - new Date(DOB);
    const ageDate = new Date(diffMonths);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    //check the age just to see if it's working correctly
    if (givenDOB>today) {
        throw `Error: You can't have a birthyear after today's date. That makes no sense.`;
    }
    if (age<18) {
        throw `Error: You must be 18 or older to use this app`
    }
    if (age>115) {
        throw `Error: You must enter a legitimate date of birth.`
    

    } else {
        const formattedDOB = givenDOB.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        return formattedDOB;
        // return givenDOB.toLocaleDateString('en-US');
    }
};


const checkEmail = (email) =>{
    email = checkString(email)
    let properAddress = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
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


export {checkAge, checkEmail, checkPassword, checkString, checkName}