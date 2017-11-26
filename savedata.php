
<?php
  include("config.php");
  require 'vendor/autoload.php';

  $request = $_POST['nStars'];
  if ($request < 1000) $request = 1000;
  $PAT = PAT;
  $initURL = "https://api.github.com/search/repositories?access_token=$PAT&q=stars:>=$request fork:true language:php";

  $GLOBALS['searchedData'] = [];
  getSearchedRepo($initURL);

  function getSearchedRepo($urlPage){
    // receive data from one or more pages
    $client = new GuzzleHttp\Client();
    $res = $client->get($urlPage);
    $body = $res->getBody();
    $data = json_decode($body, true);

    // collect needed data and put in array
    $dataArr = $data['items'];
    for($i = 0; $i < sizeof($dataArr); $i++){
      $repo = new stdClass();
      $repo->id = $dataArr[$i]['id'];
      $repo->name = $dataArr[$i]['name'];
      $repo->url = $dataArr[$i]['url'];
      $repo->pushed_at = $dataArr[$i]['pushed_at'];
      $repo->updated_at = $dataArr[$i]['updated_at'];
      $repo->description = $dataArr[$i]['description'];
      $repo->stargazers_count = $dataArr[$i]['stargazers_count'];
      $searchedData[] = $repo;
      $GLOBALS['searchedData'][] = $repo;
    }

    // recursively get data from next page if exists
    if ($res->getHeader('Link')){
      // get url link for next page
      $headerLink = $res->getHeader('Link');
      $stURL = strpos($headerLink[0], '<');
      $spURL = strpos($headerLink[0], '>');
      $fstRel = strpos($headerLink[0], '"');
      $nextURL = substr($headerLink[0], $stURL + 1, $spURL - $stURL - 1);
      $nextRel = substr($headerLink[0], $fstRel + 1, 5);
      if ($nextRel === "first"){
        // quit when last page reached
        return;
      } 
      getSearchedRepo($nextURL);
    }
  }

  // save searched data to database
  // Create connection
  $conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
  // Check connection
  if (!$conn) {
      echo "Error: Unable to connect to MySQL." . PHP_EOL;
      echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
      echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
      exit;
  }
  //build query string
  function cleanData($link, $inData){
    // process special and non-ASCII character
    $outData = $link->real_escape_string(preg_replace('/[[:^print:]]/', '', $inData));
    return $outData;
  }

  $sql = "DELETE FROM repos;"; //remove old data in table
  for ($i = 0; $i < sizeof($GLOBALS['searchedData']); $i++)
  {
    $id = cleanData($conn, $GLOBALS['searchedData'][$i]->id);
    $name = cleanData($conn, $GLOBALS['searchedData'][$i]->name);
    $url = cleanData($conn, $GLOBALS['searchedData'][$i]->url);
    $pushed_at = cleanData($conn, $GLOBALS['searchedData'][$i]->pushed_at);
    $updated_at = cleanData($conn, $GLOBALS['searchedData'][$i]->updated_at);
    $description = cleanData($conn, $GLOBALS['searchedData'][$i]->description);
    $stargazers_count = cleanData($conn, $GLOBALS['searchedData'][$i]->stargazers_count);
    $sql .= "INSERT INTO repos
        (id, name, url, pushed_at, updated_at, description, stargazers_count)
      VALUES ('$id', '$name', '$url', '$pushed_at', '$updated_at', '$description', '$stargazers_count');";
  }

  // execute query and check
  $result = mysqli_multi_query($conn, $sql);
  if ($result) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();

