
<?php
  include("config.php");
  require 'vendor/autoload.php';

  $request = $_GET['nStars'];
  if ($request < 1000) $request = 1000;
  $PAT = PAT;
  $initURL = "https://api.github.com/search/repositories?access_token=$PAT&q=stars:>=$request fork:true language:php";

  function getSearchedCount($urlPage){
    // receive data from one or more pages
    $client = new GuzzleHttp\Client();
    $res = $client->get($urlPage);
    $body = $res->getBody();
    $data = json_decode($body, true);
    return $data['total_count'];
  }

  echo getSearchedCount($initURL);
 
