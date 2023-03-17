const letsdate_pages = {};

letsdate_pages.base_url = "http://localhost/hospital-system/backend/php/";

letsdate_pages.getAPI = async (api_url) => {
    try{
        return await axios(api_url);
    }catch(error){
        console.log("Error from GET API");
    }
}

letsdate_pages.postAPI = async (api_url, api_data, api_token) => {
    try{
        return await axios.post(
            api_url,
            api_data,{
              'Authorization' : "token " + api_token
            }

        );
    }catch(error){
        console.log("Error from POST API");
    }
}

letsdate_pages.loadFor = (page) => {
    eval("letsdate_pages.load_" + page + "();");
}


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const isValidPassword = (password) => {
  const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return emailRegex.test(password);
}

const isValid = (text) => {
  if (text.trim().length === 0) {
    return false;
      }
    else return true;
    }


letsdate_pages.load_login = () => {
  const login = async() =>{
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let error = document.getElementById("error");
    const login_url = letsdate_pages.base_url + "login.php";

    let data = new FormData();
    data.append('email', email);
    data.append('password', password);

    if (isValidEmail(email) && isValidPassword(password)){
    const response = await letsdate_pages.postAPI(login_url,data);
    if(response.data.usertype == "Admin"){
      window.localStorage.setItem("usertype","Admin");
      window.localStorage.setItem("token",response.data.token);
      window.location.href="./pages/admin_portal.html";
    }else if (response.data.usertype =="Employee"){
      window.localStorage.setItem("usertype","Employee");
      window.localStorage.setItem("token",response.data.token);
      window.location.href="./pages/employee_portal.html";
    }else{
      window.localStorage.setItem("usertype","Patient");
      window.localStorage.setItem("token",response.data.token);
      window.location.href="./pages/patient_portal.html";
      
    }

  }else{
    error.style.display="flex";
    error.innerHTML="<img src=./assets/error.svg>  Wrong Email OR Password!"
  }}

    const login_btn = document.getElementById("login_btn");
    login_btn.addEventListener("click",login);

}


letsdate_pages.load_register = () => {
  
  const register = async() =>{
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let user_type = document.getElementById("user_types").value;
    let error = document.getElementById("error");
    const register_url = letsdate_pages.base_url + "registration.php";
    let data = new FormData();
    data.append('first_name',first_name);
    data.append('last_name',last_name);
    data.append('email', email);
    data.append('password', password);
    data.append('user_type', user_type);
    if(isValid(first_name) && isValid(last_name) && isValid(user_type)){
      if (isValidEmail(email)){
       if(isValidPassword(password)){
        const response = await letsdate_pages.postAPI(register_url,data);
        console.log(response.data);
  }else{
    error.style.display="flex";
    error.innerHTML="<img src=../assets/error.svg> Your password must contain at least: <ul><li>8 characters</li><li>1 Special charachter</li><li>1 Capital letter & 1 Small letter</li><li>1 number</li> "
  }}else{
    error.style.display="flex";
  error.innerHTML="<img src=../assets/error.svg>  Your email is not valid try another one!"
}}else{
  error.style.display="flex";
  error.innerHTML="<img src=../assets/error.svg>  No Empty Fields are allowed!"
}
}

    const register_btn = document.getElementById("register_btn");
    register_btn.addEventListener("click",register);
}



letsdate_pages.load_admin_portal = async () => {
    const users_url = letsdate_pages.base_url + "get_users.php";
    const hospitals_url = letsdate_pages.base_url + "get_hospitals.php";
    const response = await letsdate_pages.getAPI(users_url);
    const hospitals = await letsdate_pages.getAPI(hospitals_url);
    const token = localStorage.getItem("token");
    
    const users_table = document.getElementById("users_table");

const hospitalsList = (list,counter) => {
  const select = document.createElement("select");
  select.setAttribute("id","dropdown")
  select.setAttribute('data-id',counter);
    for(let i = 0; i < list.length; i++) {
        let option = list[i];
        let element = document.createElement("option");
        element.text = option.name;
        element.value = option.id;
        select.appendChild(element);
}
  return select;
}

const hospitalsListEmployee = (list) => {
  const select = document.createElement("select");
  select.setAttribute("id","dropdown")
  select.setAttribute('data-id',counter);
  select.setAttribute("multiple",true);
    for(let i = 0; i < list.length; i++) {
        let option = list[i];
        let element = document.createElement("option");
        element.text = option.name;
        element.value = option.id;
        select.appendChild(element);
}
  return select;
}

let counter = 0;
console.log(response.data)
  response.data.forEach(user => {
    if(user.name == 'Patient' || user.name == 'Employee' ){
      const row = document.createElement("row");
      const fname = document.createElement("div");
      const lname = document.createElement("div");
      const email_div = document.createElement("div");
      const assign_btn = document.createElement("div");
      const list = document.createElement("div");
        row.classList.add("row");
        const first_name = document.createTextNode(user.first_name);
        fname.classList.add("first_name");
        fname.appendChild(first_name);
        const last_name = document.createTextNode(user.last_name);
        lname.classList.add("last_name");
        lname.appendChild(last_name);
        const email = document.createTextNode(user.email);
        email_div.appendChild(email);
        list.classList.add("select");
        if(user.name == "Patient"){
        list.appendChild(hospitalsList(hospitals.data,counter));}
        else{
          list.innerHTML=`<div class="info">Press CTRL to choose multiple</div>`;
          list.appendChild(hospitalsListEmployee(hospitals.data));

        }

        const btn = document.createTextNode("Assign");
        assign_btn.classList.add("assign_btn","btn");
        assign_btn.setAttribute('id','assign_btn');
        assign_btn.setAttribute('data-id',counter);

        assign_btn.appendChild(btn);
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(email_div);
        row.appendChild(list);
        row.appendChild(assign_btn);
        users_table.appendChild(row);
        

        
        assign_btn.addEventListener("click",async (e) =>{
          const dropdown_index = e.target.attributes["data-id"].value;
          const data_dropdown = '[data-id = "'+dropdown_index+'"]';
          let index = document.querySelector(data_dropdown);
          console.log(index);
          const assign_patients_url = letsdate_pages.base_url + "assign_users.php";
          let data = new FormData();
            data.append('user_id',user.id);
            data.append('hospital_id',index.selectedIndex+1);
            const response = await letsdate_pages.postAPI(assign_patients_url,data);
            console.log(response.data)
        });

      }
      counter++;

  })}

  letsdate_pages.load_patient_portal = async () => {
    const users_url = letsdate_pages.base_url + "get_users.php";
    const response = await letsdate_pages.getAPI(users_url);
    const departments_url = letsdate_pages.base_url + "get_departments.php";
    const assing_departments_url = letsdate_pages.base_url + "user_departments.php";
    const departments = await letsdate_pages.getAPI(departments_url);
    const users_table = document.getElementById("users_table");
    const heading = document.getElementById("heading");

const departmentsList = (list) => {
  const select = document.createElement("select");
  select.setAttribute("id","dropdown_patient")
    for(let i = 0; i < list.length; i++) {
        let option = list[i];
        let element = document.createElement("option");
        element.text = option.name;
        element.value = option.id;
        select.appendChild(element);
}
  return select;
}

let user_id = window.localStorage.getItem("user_id","value");
let first_name = response.data[user_id].first_name;
heading.innerHTML= `Welcome ${first_name}!`

let acc = document.getElementsByClassName("accordion");
let panel = document.getElementById("panel_department");
let i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.display === "flex") {
      panel.style.display = "none";
    } else {
      panel.style.display = "flex";
      panel.style.justifyContent="space-between";
      panel.style.width="90%";
    }
  });
}
  const submit_btn = document.createElement("div");
  const btn = document.createTextNode("Submit");
  submit_btn.classList.add("submit_btn","btn");
  submit_btn.setAttribute('id','submit_btn_department')
  submit_btn.appendChild(btn);
  panel.appendChild(departmentsList(departments.data));
  panel.appendChild(submit_btn);
  let index = document.querySelector("#dropdown_patient");
  const addDepartment = async () =>{
  let data = new FormData();
            data.append('user_id',user_id);
            data.append('department_id',index.selectedIndex+1);
            const response = await letsdate_pages.postAPI(assing_departments_url,data,config);
            console.log(response.data)
}
submit_btn.addEventListener("click",addDepartment);
}


  
// function getSelected() {
//   var selectEl = document.getElementById('hospitals');
//   var selectedOptions = [];

//   for (var i = 0; i < selectEl.options.length; i++) {
//     var optionEl = selectEl.options[i];

//     if (optionEl.selected) {
//       selectedOptions.push(optionEl.value);
//     }
//   }

//   alert('hospitals: ' + selectedOptions.join(', '));
// }