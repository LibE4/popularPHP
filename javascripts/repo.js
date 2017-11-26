"use strict";
let nStars, dataInDOM, totalCount;
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

function resultDisplay(total_count, nStars) {
  // build and inject search info in DOM
  let dataInDOM = "";
  dataInDOM += "<h3>Popular PHP repositories:</h3>";
  dataInDOM += `<h3>Total ${total_count} searched results found.</h3>`;
  dataInDOM += `<h3>Minimum of stars for this search is ${nStars}.</h3>`;
  $("#dataDisplay").html(dataInDOM);
  // build new save button or activate existing one
  if(document.getElementById("save-repo")  === null){
    $("#dataDisplay").append('<button class="btn btn-success" id="save-repo">Save Repositories</button>');
  }else{
    $("#save-repo").removeAttr('disabled');
  }
} // end of resultDisplay

function sentMsgDisplay() {
  // build and inject sent msg in DOM
  let dataInDOM = "<h5>Request to save searched results in database has been sent. A notice will pop up when it is finished. Please explore other pages while waiting...</h5>";
  $("#dataDisplay").append(dataInDOM);
} // end of resultDisplay

function reposDisplay(data) {
  // build and inject saved data in DOM
  let len = data.length;
  let dataInDOM = "";
  dataInDOM += `<caption id="tableCaption">Saved Popular PHP repositories: ${len} rows total.<br>
          (click to view detail)</caption>`;
  dataInDOM += "<thead><tr><th>Repository Name</th><th>Stars</th></tr></thead>";
  dataInDOM += "<tbody>";
  for(let i = 0; i < len; i++){
    dataInDOM += `<tr id=${data[i].id} class=repo>`;
      dataInDOM += `<td>${data[i].name}</td>`;
      dataInDOM += `<td>${data[i].stargazers_count}</td>`;
    dataInDOM += "</tr>";
  }
  dataInDOM += "</tbody>";
  $("#savedDataDisplay").html(dataInDOM);
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

function getDataByStar(opt){
  // get repo data searched by star
  searchedData = [];
  nStars = $("#nStars").val();
  if (nStars < 1000) nStars = 1000;
  initURL = `https://api.github.com/search/repositories?access_token=${token}&q=stars:>=${nStars} fork:true language:php`;
  switch(opt){
    case "count":
      getSearchedCount(initURL).then((res)=>{
        totalCount = res.data.total_count;
        resultDisplay(totalCount, nStars);
      });
      break;
    case "all":
      getSearchedRepo(initURL).then((data)=>{
      });
      break;
  }
}

function getSearchedCount(urlPage) {
    // pull total count of searched results
  return new Promise((resolve, reject)=>{
    $.ajax({
      url: urlPage,
      dataType: "jsonp",
      success : function( returndata )
      {
        resolve(returndata);
      }
    });
  });
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
        // recursively get data from next page if exists
        if (returndata.meta.hasOwnProperty('Link')){
          if (returndata.meta.Link[0][1].rel === "first"){
            DBAPI.addRepoData(searchedData).then(function(data){ });
            return;
          }else{
            let nextURL = returndata.meta.Link[0][0];
            getSearchedRepo(nextURL);
          } 
        }else{
          DBAPI.addRepoData(searchedData).then(function(data){ });
        }
        resolve();
      }
    });
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
    DBAPI.getSavedRepoData().then(function(data){ 
      reposDisplay(data);
    });
  });

  $(document).on('click', '#save-repo', (e) => {
    e.preventDefault();
    getDataByStar("all");
    sentMsgDisplay();
    $("#save-repo").attr("disabled", "disabled");
  });

  // handle click on single repo, get repo detail
  $(document).on('click', '#savedDataDisplay .repo', (e) => {
    let emt = event.target.closest('tr');
    DBAPI.getSelectedRepo(emt.id).then(function(repo){
      createModal(repo);
    });
  });

  // handle search input
  $("#nStars").on("keyup", (e)=>{
    nStars = $("#nStars").val();
    if(e.keyCode === 13){
      getDataByStar("count");
    }
  });

  // handle search submit
  $('#submit').on('click', (e)=>{
    e.preventDefault();
    getDataByStar("count");
  });

});
