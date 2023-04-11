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

export {checkAge}