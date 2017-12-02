
<?php
  include("config.php");
  $conn = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
  if (!$conn) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
  }
  $query = "SELECT name, id, stargazers_count from repos";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    echo "Error: Unable to get data.";
    exit;
  }
  $data = array();
  while ($row = mysqli_fetch_assoc($result))
  {
    // Looping through the resultset.
    $data[] = $row;
  }
  echo json_encode($data);
  $conn->close();
