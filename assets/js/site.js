// connect code
function makeCode() {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let code = document.querySelector(".code");
let timer = document.querySelector(".timer");
let timerWidth = 0;

let initCode = makeCode();
code.innerHTML = initCode;
addCode(initCode);

function addCode(nCode) {
  fetch("http://localhost:1337/api/devices")
    .then((response) => response.json())
    .then((data) => {
      let entries = data.data;
      let lastEntry = entries[entries.length - 1];
      let url, method;
      if (!lastEntry.attributes.mac) {
          console.log('MAC is leeg update bestaande code');
        url = `http://localhost:1337/api/devices/${lastEntry.id}`;
        method = "PUT";
      } else {
        url = "http://localhost:1337/api/devices";
        method = "POST";
      }
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { mac: "", code: nCode } }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
setInterval(() => {
  newCode = makeCode();
  console.log("creating code", newCode);
  addCode(newCode);
  code.innerHTML = newCode;
}, 120000);

setInterval(() => {
  let codeToCheck=code.innerHTML;
  fetch("http://localhost:1337/api/devices")
    .then((response) => response.json())
    .then((data) => {
        for(var i = 0; i < data.data.length; i++){
            if (data.data[i].attributes.code === codeToCheck && data.data[i].attributes.mac){
                console.log('hebbes!')
                //create user with mac
                //Redirect to dashboard
            }
            else{
                console.log(data.data[i].attributes.mac)
                console.log('not valid')
            }
        }
    })
  
}, 3000);
