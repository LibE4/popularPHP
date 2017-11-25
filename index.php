<!DOCTYPE html>
<html>
<head>
	<title>Popular PHP Repositories</title>
<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="./main.css">
</head>
<body>
	<?php
		include("config.php");
		$link = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);

		if (!$link) {
		  echo "Error: Unable to connect to MySQL." . PHP_EOL;
		  echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
		  echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
		  exit;
		}

		// Create table if doesn't exist
		$query = "SELECT * FROM repos";
		$result = mysqli_query($link, $query);

		if(empty($result)) {
		  $query = "CREATE TABLE repos (
		            id int(10),
		            name varchar(255),
		            url varchar(255),
		            pushed_at varchar(255),
		            updated_at varchar(255),
		            description varchar(255),
		            stargazers_count int(10)
		            )";
		  $result = mysqli_query($link, $query); 

		  if ($result === TRUE) {
		    echo "New table created successfully";
		  } else {
		      echo "Error: " . $query . "<br>" . $link->error;
		  }
		}
	?>
	<nav class="navbar navbar-default" id="nav-repo">
	  <div class="container-fluid">
	    <!-- Brand and toggle get grouped for better mobile display -->
	    <div class="navbar-header">
	      <a class="navbar-brand" href="#">PHP repository APP</a>
	    </div>

	    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	      <ul class="nav navbar-nav navbar-right">
	        <li><a href="#" id="view-home-repo" class="cd-btn">Home</a></li>
	        <li><a href="#" id="view-saved-repo" class="cd-btn">View Saved PHP</a></li>
	        <li><a href="#" id="update-repo" class="cd-btn">Search New PHP</a></li>
	      </ul>
	    </div>
	    <!-- /.navbar-collapse -->
	  </div>
	  <!-- /.container-fluid -->
	</nav>

	<div class="container" id="main-repo">
		<div id="home-view" class="row">
	    <div class="col-lg-6 col-lg-offset-3">
	    	<h1>Thanks for using PopularPHP!</h1>
	    	<h3>To view previously saved popular PHP repositories: <a href="#" id="view-saved-repo" class="cd-btn">click here</a></h3>
	    	<h3>To update popular PHP repositories: <a href="#" id="update-repo" class="cd-btn">click here</a></h3>
	    </div>
		</div>
		<div id="search-view" class="row hidden">
	    <div class="col-lg-6 col-lg-offset-3">
				<!-- input -->
				<div class="input-group">
				  <span class="input-group-addon" id="basic-addon1">Look for PHP repositories with stars more than:</span>
				  <input id="nStars" type="number" class="form-control" value="5000" min="1000" aria-describedby="basic-addon1">
		      <span class="input-group-btn">
		        <button class="btn btn-info" type="button" id="submit">Search</button>
		      </span>				
	      </div><!-- /input -->
	      <div>(Hint: to avoid searched result being too big, minimum <strong>1000</strong> stars applied.)</div>
	    </div><!-- /.col-lg-4 -->
			<div id="products">
				<table class="table table-bordered table-striped">
					<caption id="tableCaption">Popular PHP repositories:</caption>
					<thead>
						<tr>
							<th>Name</th>
							<th>Stars</th>
							<th>Description</th>
							<th>URL</th>
							<th>Pushed At</th>
							<th>Updated At</th>
							<th>ID</th>
						</tr>
					</thead>
					<tbody id="dataDisplay">
						
					</tbody>
				</table>
			</div>
		</div><!-- /.row -->		
		<div id="saved-view" class="row hidden">
			<div class="col-lg-6 col-lg-offset-3">
				<table class="table table-bordered table-striped">
					<caption id="tableCaption">Saved Popular PHP repositories:</caption>
					<thead>
						<tr>
							<th>Repository Name</th>
							<th>Stars</th>
						</tr>
					</thead>
					<tbody id="savedDataDisplay">
						
					</tbody>
				</table>
			</div>
		</div><!-- /.row -->
	</div>
	<script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<script type="text/javascript" src="javascripts/repo.js"></script>
	<script type="text/javascript" src="javascripts/DALMethods.js"></script>
</body>
</html>