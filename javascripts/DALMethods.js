'use strict';

var DBAPI = (function(DB){
	DB.getSavedRepoData = function(){
		// pull all data from database
		return new Promise((resolve, reject)=>{
			$.ajax({
				method: "GET",
				url: "getdata.php"
			}).then((response)=>{
				resolve(JSON.parse(response));
			}, (error)=>{
				reject(error);
			});
		});
	};

	function reportSuccess(){
		alert('Data saved successfully! To view saved repositories, go to or refresh "view saved PHP" page.');
	}
		
	DB.addRepoData = function(newItem){
		// save data to database
		return new Promise((resolve, reject)=>{
			$.ajax({
				method: "POST",
				url: "savedata.php",
				data:JSON.stringify(newItem),
				dataType:"json"
			}).then((response)=>{
				reportSuccess();
				resolve(response);
			}, (error)=>{
				if(error.responseText.indexOf("successfully") > 0) reportSuccess();
				else reject(error);
			});
		});
	};

	DB.getSelectedRepo = function(repoId) {
		// pull single repo data from database
	  return new Promise((resolve, reject)=>{
	      $.ajax({
	        method:'GET',
					data:{id:repoId},
	        url:'getSingle.php'
	      }).then((response)=>{
	      	let data = JSON.parse(response);
	        let repo = {
	          "name": data.name,
	          "id": data.id,
	          "url": data.url,
	          "pushed_at": data.pushed_at,
	          "updated_at": data.updated_at,
	          "description": data.description,
	          "stargazers_count": data.stargazers_count
	        };
	        resolve(repo);
	      },(errorResponse)=>{
	        reject(errorResponse);
	      });
	  });
	};

	return DB;
})(DBAPI || {});