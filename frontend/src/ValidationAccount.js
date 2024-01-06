function Validation(values){
    let error = {} //This is error object
    const username_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = ""
    /*
    To check a password between 8 to 15 characters which contain at least one lowercase letter, 
    one uppercase letter, one numeric digit, and one special character
    */
    //const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/


    if(values.username === ""){
        error.username = ""
    }
    else if(!username_pattern.test(values.username)){
        error.username = "Email Didn't match"
    } else{
        error.username = ""
    }

    if(values.password === ""){
        error.password = ""
    } else if(password_pattern === 4){
        error.password = "more"
    }
    else{
        error.password = ""
    }
    return error;
}

export default Validation;