# PopularPHP

## Description
An web application to collect and manage information of popular PHP  repositories from GitHub.

## INSTRUCTIONS FOR INSTALLING PopularPHP

NOTE: A MySQL database server and a web server with PHP up and running is required. A MySQL client (eg. phpMyAdmin) is needed as user interface for MySQL server.

1.) Copy all files in this repository onto your web server at the file location that you wish to serve it from.

2.) Locate "config.php" file, set those constants based on your MySQL server connection parameters. A table named "repos" will be created in the designated database the first time app runs.

3.) Locate "repo.js file" inside "javascripts" folder, set "token" variable with your GitHub personal access token (PAT).
	
PopularPHP is ready to serve!

## Contributors
- [Bin Li](https://github.com/LibE4)