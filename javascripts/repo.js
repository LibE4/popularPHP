"use strict";
let nStars, dataInDOM, totalLeft;
let pageCount = 1;
let searchedData = [];
let token="your_token_here";
let initURL;
let $homeView = $("#home-view");
let $searchView = $("#search-view");
let $savedView = $("#saved-view");

function showHomeView(){
  $homeView.addClass("show")
  $homeView.removeClass("hidden");
  $searchView.addClass("hidden");
  $searchView.removeClass("show");
  $savedView.addClass("hidden");
  $savedView.removeClass("show");
}

function showSearchView(){
  $homeView.addClass("hidden")
  $homeView.removeClass("show");
  $searchView.addClass("show");
  $searchView.removeClass("hidden");
  $savedView.addClass("hidden");
  $savedView.removeClass("show");
}

function showSavedView(){
  $homeView.addClass("hidden")
  $homeView.removeClass("show");
  $searchView.addClass("hidden");
  $searchView.removeClass("show");
  $savedView.addClass("show");
  $savedView.removeClass("hidden");
}

function getDataByStar(){
  // get repo data searched by star
  searchedData = [];
  nStars = $("#nStars").val();
  if (nStars < 1000) nStars = 1000;
  initURL = `https://api.github.com/search/repositories?access_token=${token}&q=stars:>=${nStars} fork:true language:php`;
  getSearchedRepo(initURL).then((data)=>{ });
}

function getSearchedRepo(urlPage){
  // receive data from one or more pages
  return new Promise((resolve, reject)=>{
    $.ajax({
      url: urlPage,
      dataType: "jsonp",
      success : function( returndata )
      {
        // collect needed data and put in array
        let dataArr = returndata.data.items;
        for(let i = 0; i < dataArr.length; i++){
          let repo = {};
          repo.id = dataArr[i].id;
          repo.name = dataArr[i].name;
          repo.url = dataArr[i].url;
          repo.pushed_at = dataArr[i].pushed_at;
          repo.updated_at = dataArr[i].updated_at;
          repo.description = dataArr[i].description;
          repo.stargazers_count = dataArr[i].stargazers_count;
          searchedData.push(repo);
        }

        if (returndata.meta.hasOwnProperty('Link')){
          // recursively get data from next page if exists
          let nextURL = returndata.meta.Link[0][0];
          if (returndata.meta.Link[0][1].rel === "first"){
            reposDisplay(searchedData, null);
            return;
          } 
          getSearchedRepo(nextURL);
        }else{
          reposDisplay(searchedData, null);
        }
        resolve();
      }
    });
  });
}

function reposDisplay(data, nColumn) {
  // build and inject html content in DOM
  dataInDOM = "";
  let len = data.length;
  for(let i = 0; i < len; i++){
    dataInDOM += `<tr id=${data[i].id} class=repo>`;
      dataInDOM += `<td>${data[i].name}</td>`;
      dataInDOM += `<td>${data[i].stargazers_count}</td>`;
      if(nColumn !== 2){
      dataInDOM += `<td>${data[i].description}</td>`;
      dataInDOM += `<td>${data[i].url}</td>`;
      dataInDOM += `<td>${data[i].pushed_at}</td>`;
      dataInDOM += `<td>${data[i].updated_at}</td>`;
      dataInDOM += `<td>${data[i].id}</td>`;
      }
    dataInDOM += "</tr>";
  }
    dataInDOM += `<tr><td>Total repositories: ${len}</td></tr>`;
  if(nColumn !== 2){
    // build and inject these content only in search page
    $("#dataDisplay").html(dataInDOM);
    if(document.getElementById("save-repo")  === null){
      $("#products").append('<button class="btn btn-success" id="save-repo">SAVE</button>');
    }else{
      $("#save-repo").removeAttr('disabled');
    }
  }else{
    $("#savedDataDisplay").html(dataInDOM);
  }
} // end of reposDisplay

function createModal(repo) {
  // pop-up window for single repo detail view
  let html =  '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
  html += '<div class="modal-dialog">';
  html += '<div class="modal-content">';
  html += '<div class="modal-header">';
  html += '<a class="close" data-dismiss="modal">×</a>';
  html += `<h2>${repo.name}</h2>`;
  html += '</div>';
  html += '<div class="modal-body">';
  html += `<h3>Stars: ${repo.stargazers_count}</h3>`;
  html += `<h4>description: ${repo.description}</h4>`;
  html += `<h5>Repository ID: ${repo.id}</h5>`;
  html += `<h5>Pushed At: ${repo.pushed_at}</h5>`;
  html += `<h5>Updated At: ${repo.updated_at}</h5>`;
  html += '</div>';  // content
  html += '</div>';  // dialog
  html += '</div>';  // footer
  html += '</div>';  // modalWindow
  $('body').append(html);
  $("#dynamicModal").modal();
  $("#dynamicModal").modal('show');

  $('#dynamicModal').on('hidden.bs.modal', function () {
      $(this).remove();
  });
}

$(document).ready(function(){

  $(document).on('click', '#view-home-repo', (e) => {
    e.preventDefault();
    showHomeView();
  });

  $(document).on('click', '#update-repo', (e) => {
    e.preventDefault();
    showSearchView();
  });

  $(document).on('click', '#view-saved-repo', (e) => {
    e.preventDefault();
    showSavedView();
    // load saved data
    DBAPI.getSavedRepoData().then(function(data){ 
      reposDisplay(data, 2);
    });
  });

  $(document).on('click', '#save-repo', (e) => {
    // save data to database
    e.preventDefault();
    DBAPI.addRepoData(searchedData).then(function(data){ });
    $("#save-repo").attr("disabled", "disabled");
  });

  $(document).on('click', '#savedDataDisplay .repo', (e) => {
    // Get single repo details
    let emt = event.target.closest('tr');
    DBAPI.getSelectedRepo(emt.id).then(function(repo){
      createModal(repo);
    });
  });

  $("#nStars").on("keyup", (e)=>{
    nStars = $("#nStars").val();
    if(e.keyCode === 13){
      getDataByStar();
    }
  });

  $('#submit').on('click', (e)=>{
    e.preventDefault();
    getDataByStar();
  });

});
