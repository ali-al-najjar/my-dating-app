const letsdate_pages = {};

letsdate_pages.base_url = "http://127.0.0.1:8000/api/";

letsdate_pages.getAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log("Error from GET API");}}

letsdate_pages.postAPI = async (api_url, api_data) => {
  try{
    return await axios.post(
      api_url,
      api_data)

    }catch(error){
      return error.response["statusText"];}}


letsdate_pages.loadFor = (page) => {
    eval("letsdate_pages.load_" + page + "();");}


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);}

const isValidPassword = (password) => {
  const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return emailRegex.test(password);}

const isValid = (text) => {
  if (text.trim().length === 0) {
    return false;
      }
    else return true;}


letsdate_pages.load_login = () => {
  
  const login = async() =>{
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let error = document.getElementById("error");

    const login_url = letsdate_pages.base_url + "login";

    let data = new FormData();
    data.append('email', email);
    data.append('password', password);

    if (isValidEmail(email) && isValidPassword(password)){
        const response = await letsdate_pages.postAPI(login_url,data);
        if (response == "Unauthorized"){
          error.style.display="flex";
          error.style.animation="bounce";
          error.style.animationDuration="0.5s";
          error.innerHTML="<img src=./assets/error.svg>  Wrong Email OR Password!"}
        else{
          window.localStorage.setItem("token",response.data["authorisation"].token);
          // console.log(response.data["authorisation"].token);
          window.location.href="../frontend/pages/complete_profile.html";
          error.style.display="none";
        }
      }
        
        // window.localStorage.setItem("status",response.status);
      // console.log(response);
      // console.log(response.data["authorisation"].token)
    else{
        error.style.display="flex";
        error.style.animation="bounce";
        error.style.animationDuration="0.5s";
        error.innerHTML="<img src=./assets/error.svg>  Wrong Email OR Password!"}}

    const login_btn = document.getElementById("login_btn");
    login_btn.addEventListener("click",(e)=>{
        e.preventDefault();
        login();
   });
}



letsdate_pages.load_register = () => {
  
  const register = async() =>{

    const register_url = letsdate_pages.base_url + "register";
    let name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let error = document.getElementById("error");

    let data = new FormData();
      data.append('name',name);
      data.append('last_name',last_name);
      data.append('email', email);
      data.append('password', password);

      if(isValid(name) && isValid(last_name)){
        if (isValidEmail(email)){
        if(isValidPassword(password)){
          const response = await letsdate_pages.postAPI(register_url,data);
          console.log(response.data["authorisation"].token);
        
        if (response.data.success == false){
            error.style.display="flex";
            error.style.animation="bounce";
            error.style.animationDuration="0.5s";
            error.innerHTML="<img src=../assets/error.svg> This email is already registered"}}

        else{
            error.style.display="flex";
            error.innerHTML="<img src=../assets/error.svg> Your password must contain at least: <ul><li>8 characters</li><li>1 Special charachter</li><li>1 Capital letter & 1 Small letter</li><li>1 number</li> "}}

        else{
            error.style.display="flex";
            error.innerHTML="<img src=../assets/error.svg>  Your email is not valid try another one!"}}

        else{
            error.style.display="flex";
            error.style.animation="bounce";
            error.style.animationDuration="0.5s";
            error.innerHTML="<img src=../assets/error.svg>  No Empty Fields are allowed!"}}


    const register_btn = document.getElementById("register_btn");
    register_btn.addEventListener("click", (e) =>{
      e.preventDefault();
      register();
    });

}

