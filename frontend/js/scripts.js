const letsdate_pages = {};

let user_token=localStorage.getItem("token");

let headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + user_token
}

letsdate_pages.authPostAPI = async (api_url) => {
  try{
    return await axios.post(
      api_url,
      null,{
      headers:headers})

    }catch(error){
      return error.response["statusText"];}}

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
          error.style.display="none";
        }
      }
        
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
          window.localStorage.setItem("token",response.data["authorisation"].token);
          // console.log(response);
          window.location.href="./complete_profile.html";
          error.style.display="none";
        
        if (response.data.success == false){
            error.style.display="flex";
            error.style.animation="bounce";
            error.style.animationDuration="0.5s";
            error.innerHTML="<img src=../assets/error.svg> This email is already registered"}
          }

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

letsdate_pages.load_complete_profile = () => {
  const profile_details_url = letsdate_pages.base_url + "user_details";
  const user_id_url = letsdate_pages.base_url + "get_user";
  const male = document.getElementById('male');
  const female = document.getElementById('female');
  const description = document.getElementById('description');
  const profile_pic = document.getElementById('profile_pic');
  const location_btn = document.getElementById("btn_location");
  const complete_btn = document.getElementById("complete_btn");

  const location = document.getElementById("location");

  const userLocation = async () => {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPosition);}
    else {
      location.innerHTML = "Geolocation is not supported by this browser.";}
  }

  location_btn.addEventListener("click", userLocation);

  const showPosition = async (position) =>{
    lat=position.coords.latitude;
    lon=position.coords.longitude;
    await getLocation(lat,lon);
    
  }

  let lat=GeolocationCoordinates.latitude;
  let lon=GeolocationCoordinates.longitude;

  const getLocation  = async (lat,lon) =>{
    let access_key= "pk.a87f7910165b829681a03e71f7aecf29" ;
    
    let locations_map_url=`https://eu1.locationiq.com/v1/reverse?key=${access_key}&lat=${lat}&lon=${lon}&format=json`;
    const response = await letsdate_pages.getAPI(locations_map_url);
    const city = response.data.address.city;
    location.innerHTML=`Your location is ${city}`;
    location.style.border="2px solid var(--blue)";
    return city;
  }
  let profile_pic_encoded =  "";
  profile_pic.addEventListener("change", (event) => {
    const selectedfile = event.target.files;
    if (selectedfile.length > 0) {
      const [imageFile] = selectedfile;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const srcData = fileReader.result;
        profile_pic_encoded = srcData;
      };
      fileReader.readAsDataURL(imageFile);
    }
  });

  complete_btn.addEventListener("click",async ()=>{
    if (male.checked == true){
      gender = male.value;}
    else if(female.checked == true){
      gender = female.value;}
    else{
      gender =  "";}

    bio = description.value;
    const city = await getLocation(lat,lon);
    // console.log(city);
    // console.log(profile_pic_encoded);
    token = window.localStorage.getItem("token");
    const response = await letsdate_pages.authPostAPI(user_id_url);
    let data = new FormData();
        data.append('gender',gender);
        data.append('description',bio);
        data.append('profile_pic', profile_pic_encoded);
        data.append('location', city);


        for (const value of data.values()) {
          console.log(value);
        }

  })



}