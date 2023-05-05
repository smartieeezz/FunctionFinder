//Importing the validation functions
const checkString= (string)  => {
    //make sure the string exists
    if (!string) {
        throw `This field must exist.`
    }
    //make sure the string is not empty
    string = string.trim()
    if (string=="") {
        throw `This field cannot be empty.`
    }
    //check for spaces
    if (string.includes(' ')) {
        throw `This field cannot have a space.`
    }
    return string
}

const checkName = (name) => {
    checkString(name);
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
    const givenDOB = new Date(DOB)
    givenDOB.setHours(0, 0, 0, 0); // Set time to midnight to compare dates only
    today.setHours(0, 0, 0, 0);
    if (givenDOB> today) {
        throw `Error: You can't be born after today's date. That makes no sense.`;
    }
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
    console.log(`User age: ${age} years`);

    if (age<18) {
        throw `Error: You must be 18 or older to use this app`
    }
    if (age>115) {
        throw `Error: You must enter a legitimate date of birth.`
    }
    
    // const yearDifference = today.getFullYear() - dobYear;
    // if (age < 18) {
    //     throw `Error: You must be 18 or older to use this site.`;
    // }
    // //if you're born in a month that is before the current date's month then you're too young
    // if (yearDifference == 18 && dobMonth > month) {
    //     throw `Error: You must be 18 or older to use this site.`;
    // }

    // //if you're born in the same month and the current day is after your birthday then you're too young
    // if (yearDifference == 18 && dobMonth == month && dobDay > day) {
    //     throw `Error: You must be 18 or older to use this site.`;
    const formattedDOB = givenDOB.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return formattedDOB;
    
};


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


const loginForm = document.getElementById('loginForm');
const updateForm = document.getElementById('updateForm');
const registrationForm = document.getElementById('registrationForm')

const validateUpdateForm=() =>{
    if (updateForm) {
    // const updateForm = document.getElementById('updateForm');
    updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //get all the elements in the updateForm and change them to form
    const form = document.querySelector("#updateForm");
    const firstName = form.elements.firstName.value.trim();
    const lastName = form.elements.lastName.value.trim();
    const email = form.elements.email.value.trim();
    const dateOfBirth = form.elements.dateOfBirth.value;
    const username = form.elements.username.value.trim();
    const password = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword.value;
    const favoriteCategories = document.querySelectorAll('input[name="favoriteCategories"]:checked');
    const errorsList = form.elements.errors

    let errors = [];
    
    if (!firstName || !lastName || !email ||!dateOfBirth || !username|| !password || !confirmPassword) {
        errors.push("All fields must be filled out.")
    }
    //let's validate the firstName
    try {
        const validFirstName = checkName(firstName);
    } catch (error) {
        errors.push(`First Name: ${error}`);
    }
    
      //let's validate the lastName
    try {
        const validLastName = checkName(lastName);
    } catch (error) {
        errors.push(`Last Name: ${error}`);
    }

    //validate the email
    try {
        const validEmail = checkEmail(email);
    } catch (error) {
        errors.push(`Email: ${error}`);
    }

    //validate the dateofbirth address
    try {
        const validDOB = checkAge(dateOfBirth);
    } catch (error) {
        errors.push(`Date of Birth ${error}`);
    }

    // Validate username
    try {
        const validUsername = checkString(username);
    } catch (error) {
        errors.push(`Username ${error}`);
    }

    // Validate password
    try {
        const validPassword = checkPassword(password);
    } catch (error) {
        errors.push(`Password: ${error}`);
    }

    // Validate confirmPassword
    try {
        const validConfirmPassword = checkPassword(confirmPassword);
    } catch (error) {
        errors.push(`Confirm Password: ${error}`);
    }

    if (confirmPassword!==password) {
        errors.push("Password Error: Password and Confirm Password must match.")
    }
    //if the favoriteCategories haven't been selected at least once then push an error
    if (favoriteCategories.length === 0) {
        errors.push("At least one favorite category must be selected.")
    }
    // Check if any errors occurred
    if (errors.length > 0) {

        displayErrors(errors);
        return false;
    }
    event.target.submit();
    })
    }
}

const validateLoginForm=()=>{
    if (loginForm) {
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        //get all the elements in the loginForm and change them to form
        const form = document.querySelector("#loginForm");
        const email = form.elements.emailInput.value.trim();
        console.log(email)
        const password = form.elements.passwordInput.value;
        const errorsList = form.elements.errors

        let errors = []
        if (!email || !password) {
            errors.push("All fields must be filled out.")
        }
        
        //let's validate the email
        try {
            const validEmail = checkEmail(email);
        } catch (error) {
            errors.push(`Email: ${error}`);
        }
        
        //let's validate the password
        try {
            const validPassword = checkPassword(password);
        } catch (error) {
            errors.push(`Password: ${error}`);
        }
        //if we have errors then we will have to display them
        if (errors.length > 0) {
            displayErrors(errors);
            return false;
        }
        //if we have no errors then we can just submit the form to our database for processing
        event.target.submit();
        
        })
    }
}
const validateRegistrationForm=()=>{
    if (registrationForm) {
        // const updateForm = document.getElementById('updateForm');
        registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const form = document.querySelector("#registrationForm");
        const firstName = form.elements.firstName.value.trim();
        const lastName = form.elements.lastName.value.trim();
        const username = form.elements.username.value.trim();
        const email = form.elements.email.value.trim();
        const dob = form.elements.dob.value;
        const password = form.elements.password.value
        const confirmPassword = form.elements.confirmPassword.value
        const favoriteCategories = document.querySelectorAll('input[name="favoriteCategories"]:checked');
        

        const errorsList = form.elements.errors
        let errors = []
        if (!firstName|| !lastName||!username ||!email ||!dob ||!password ||!confirmPassword) {
            errors.push("All fields must be filled out.")
        }
        //let's validate the firstName
        try {
            const validFirstName = checkName(firstName);
        } catch (error) {
            errors.push(`First Name: ${error}`);
        }
        
        //let's validate the lastName
        try {
            const validLastName = checkName(lastName);
        } catch (error) {
            errors.push(`Last Name: ${error}`);
        }

        //validate the email
        try {
            const validEmail = checkEmail(email);
        } catch (error) {
            errors.push(`Email: ${error}`);
        }

        //validate the dateofbirth address
        try {
            const validDOB = checkAge(dob);
        } catch (error) {
            errors.push(`Date of Birth ${error}`);
        }

        // Validate username
        try {
            const validUsername = checkString(username);
        } catch (error) {
            errors.push(`Username ${error}`);
        }

        // Validate password
        try {
            const validPassword = checkPassword(password);
        } catch (error) {
            errors.push(`Password: ${error}`);
        }

        // Validate confirmPassword
        try {
            const validConfirmPassword = checkPassword(confirmPassword);
        } catch (error) {
            errors.push(`Confirm Password: ${error}`);
        }

        if (confirmPassword!==password) {
            errors.push("Password Error: Password and Confirm Password must match.")
        }
        if (!favoriteCategories.length) {
            errors.push('Favorite Categories: You must select at least one category.')
        }
        //check if we have any errors and if we do then render them
        if (errors.length> 0) {
            displayErrors(errors)
            return false
            }
            event.target.submit();
            })
    }
}


validateLoginForm()
validateUpdateForm()
validateRegistrationForm()



function displayErrors(errors) {
    const errorList = document.querySelector("#errors");
    errorList.innerHTML = "";
    errors.forEach(function(error) {
        const errorItem = document.createElement("li");
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
        });
    }





export {checkAge, checkEmail, checkPassword, checkString, checkName}