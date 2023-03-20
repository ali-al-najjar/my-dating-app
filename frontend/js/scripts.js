const letsdate_pages = {};

let user_token=localStorage.getItem("token");
letsdate_pages.base_url = "http://127.0.0.1:8000/api/";


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

let error = document.getElementById("error");

letsdate_pages.load_login = () => {
  
  const login = async() =>{
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    const user_id_url = letsdate_pages.base_url + "get_user";
    const status = await letsdate_pages.authPostAPI(user_id_url);
    const user_id = status.data.user.id
    const user_gender= status.data.user.detail.gender

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
          error.innerHTML="<img src=./assets/error.svg>  Wrong Email OR Password!"
          setTimeout(() => {
            document.location.reload();
          }, 1000);}
        else{
          window.localStorage.setItem("token",response.data["authorisation"].token);
          error.style.display="none";
          window.location.href="./pages/users.html";
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
  let date = document.getElementById("age");
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
    let city ="";
    let locations_map_url=`https://eu1.locationiq.com/v1/reverse?key=${access_key}&lat=${lat}&lon=${lon}&format=json`;
    const response = await letsdate_pages.getAPI(locations_map_url);
    if(response.data.address.municipality){
      city = response.data.address.municipality;}
    else if(response.data.address.village){
      city = response.data.address.village;
    }else if(response.data.address.country){
      city = response.data.address.country;
    }
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
    
    
    const pic_extension = profile_pic.files[0].name;
    let extension = pic_extension.substring(pic_extension.lastIndexOf('.') + 1);
      const bio = description.value;
      const city = await getLocation(lat,lon);
      token = window.localStorage.getItem("token");
      const status = await letsdate_pages.authPostAPI(user_id_url);
      const user_id = status.data.user.id
      dob_value = date.value
      dob = new Date(dob_value);
      const month_diff = Date.now() - dob.getTime();
      const age_dt = new Date(month_diff);
      const year = age_dt.getUTCFullYear();
      const age = Math.abs(year - 1970);

      if(status == "Unauthorized"){
        let modal = document.getElementById("myModal");
        modal.style.display = "block";

      }else{

      let data = new FormData();
          data.append('gender',gender);
          data.append('description',bio);
          data.append('image_extension',extension);
          data.append('profile_pic_encoded', profile_pic_encoded);
          data.append('location', city);
          data.append('age',age);
          const response = await letsdate_pages.postAPI(`${profile_details_url}/${user_id}/add`,data);


        }


      })
}

letsdate_pages.load_edit_profile = () => {
  const profile_details_url = letsdate_pages.base_url + "user_details";
  const user_id_url = letsdate_pages.base_url + "get_user";
  const male = document.getElementById('male');
  const female = document.getElementById('female');
  const description = document.getElementById('description');
  const profile_pic = document.getElementById('profile_pic');
  const location_btn = document.getElementById("btn_location");
  const complete_btn = document.getElementById("complete_btn");
  let date = document.getElementById("age");
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
    let city ="";
    let locations_map_url=`https://eu1.locationiq.com/v1/reverse?key=${access_key}&lat=${lat}&lon=${lon}&format=json`;
    const response = await letsdate_pages.getAPI(locations_map_url);
    if(response.data.address.municipality){
      city = response.data.address.municipality;}
    else if(response.data.address.village){
      city = response.data.address.village;
    }else if(response.data.address.country){
      city = response.data.address.country;
    }
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
    
    
    const pic_extension = profile_pic.files[0].name;
    let extension = pic_extension.substring(pic_extension.lastIndexOf('.') + 1);
      const bio = description.value;
      const city = await getLocation(lat,lon);
      token = window.localStorage.getItem("token");
      const status = await letsdate_pages.authPostAPI(user_id_url);
      const user_id = status.data.user.id
      const detail_id= status.data.user.detail.id
      dob_value = date.value
      dob = new Date(dob_value);
      const month_diff = Date.now() - dob.getTime();
      const age_dt = new Date(month_diff);
      const year = age_dt.getUTCFullYear();
      const age = Math.abs(year - 1970);

      if(status == "Unauthorized"){
        let modal = document.getElementById("myModal");
        modal.style.display = "block";

      }else{

      let data = new FormData();
          data.append('gender',gender);
          data.append('description',bio);
          data.append('image_extension',extension);
          data.append('profile_pic_encoded', profile_pic_encoded);
          data.append('location', city);
          data.append('age',age);
          const response = await letsdate_pages.postAPI(`${profile_details_url}/${user_id}/${detail_id}`,data);


        }


      })
}

      letsdate_pages.load_users = async() => {
        const female_api = letsdate_pages.base_url + "allfemaleusers";
        const male_api = letsdate_pages.base_url + "allmaleusers";
        const users = document.querySelector('users_container');
        const img = document.getElementById('profile_pic');
        const user_id_url = letsdate_pages.base_url + "get_user";
        const status = await letsdate_pages.authPostAPI(user_id_url);
        const user_id = status.data.user.id
        const user_gender= status.data.user.detail.gender

        if(user_gender =="male"){
        const response = await letsdate_pages.getAPI(female_api);
        let data = response.data.users;
        console.log(data);
        data.forEach((item) => {
        const markup =`<div class="card">
        <img id ="profile_pic" src="${item.profile_pic}" alt="">
        <div class="info_container">
          <h4><b>${item.name}</b></h4> 
          <p>${item.gender}</p>
          <p>${item.date_of_birth}</p>
        </div>
        </div>`
        const element = document.createRange().createContextualFragment(markup);
        document.querySelector(".users_container").appendChild(element);
        })
}
        
        else{
          const response = await letsdate_pages.getAPI(male_api);
        let data = response.data.users;
        data.forEach((item) => {
        const markup =`<div class="card">
        <img id ="profile_pic" src="${item.profile_pic}" alt="">
        <div class="info_container">
          <h4><b>${item.name}</b></h4> 
          <p>${item.gender}</p>
          <p>${item.date_of_birth}</p>
        </div>
        </div>`
        const element = document.createRange().createContextualFragment(markup);
        document.querySelector(".users_container").appendChild(element);})
}
      }
        



    
