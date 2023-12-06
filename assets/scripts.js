const api_url = "https://ecams-billboard--api.azurewebsites.net";
const acp_url = "https://ecams-billboard-acp.azurewebsites.net";
const department = "Science";

let data = [];

setInterval(function () {
  ping();
}, 120000);

setInterval(function () {
  // Reload every 1 hours
  window.location.reload();
}, 3600000);

setInterval(function () {
  // Refresh data every 10 minutes
  loadData();
  loadImg();
}, 600000);

async function ping() {
  await fetch(api_url + "/ping", { mode: "no-cors" });
  await fetch(acp_url + "/ping", { mode: "no-cors" });
}

$(window).on("load", function () {
  ping();
});

async function getData() {
  await fetch(api_url + "/api/data/" + department)
    .then((res) => res.json())
    .then((localData) => {
      data = localData;
      return;
    });
  console.log(data);
}

async function loadData() {
  await getData();
  outputStr = "";
  data.forEach((element, index) => {
    outputStr += "<tr>";
    outputStr += `<td>${element.name}</td>`;
    outputStr += `<td>${element.room}</td>`;
    outputStr += `<td><button class="btn btn-outline-primary btn-sm" id="view-professor" onclick="openProfessorModal('${element.id}')"><i class="fa-solid fa-eye"></i></button></td>`;
    outputStr += "</tr>";
  });
  $("#profs").html(outputStr);
}

loadData();

async function getImg() {
  const imageData = await fetch(api_url + "/api/banners")
    .then((res) => res.json())
    .then((imageData) => {
      delete imageData[2]; delete imageData[3]; delete imageData[4];
      console.log(imageData);
      return imageData;
    });
  return imageData;
}

async function loadImg() {
  const imageData = await getImg();

  // pulls images from assets folder
  const localImage = {
    image_name: 'Sciencecredits.png',
    name: "Science Credits"
  };
  let outputStr = "";
  outputStr += `<div class="carousel-item" data-bs-interval="10000">
  <img
    src="assets/${localImage.image_name}"
    class="d-block w-100"
    alt="${localImage.name}"
    width="375"
    height="500"
  />
  <div class="carousel-caption d-none d-md-block">
    <h5>${localImage.name}</h5>
  </div>
</div>`
  //outputStr = "";
  imageData.forEach((element, index) => {
    const image_url = api_url + "/uploads/" + element.image_name;
    outputStr += `<div class="carousel-item ${
      index === 0 ? "active" : ""
    }" data-bs-interval="10000">
                    <img
                      src="${image_url}"
                      class="d-block w-100"
                      alt="${element.name}"
                      width="375"
                      height="500"
                    />
                    <div class="carousel-caption d-none d-md-block">
                      <h5>${element.name}</h5>
                    </div>
                  </div>`;
  });
  $("#carousel-body").html(outputStr);
}

function openProfessorModal(professorId) {
  const professor = data.find((element) => element.id === professorId)
  
  $("#professorName").html(professor.name);
  $("#professorNameTable").html(professor.name);
  $("#professorEmail").html(professor.email);
  $("#professorHours").html(professor.hours);
  $("#professorOffice").html(professor.room);
  $("#professorModal").modal("show")
}

loadImg();