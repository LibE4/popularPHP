
<?php
  include("config.php");
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
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
  for ($i = 0; $i < sizeof($request); $i++)
  {
    $id = cleanData($conn, $request[$i]->id);
    $name = cleanData($conn, $request[$i]->name);
    $url = cleanData($conn, $request[$i]->url);
    $pushed_at = cleanData($conn, $request[$i]->pushed_at);
    $updated_at = cleanData($conn, $request[$i]->updated_at);
    $description = cleanData($conn, $request[$i]->description);
    $stargazers_count = cleanData($conn, $request[$i]->stargazers_count);
    $sql .= "INSERT INTO repos
        (id, name, url, pushed_at, updated_at, description, stargazers_count)
      VALUES ('$id', '$name', '$url', '$pushed_at', '$updated_at', '$description', '$stargazers_count');";
  }

  // execute and check
  $result = mysqli_multi_query($conn, $sql);
  if ($result) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  $conn->close();

