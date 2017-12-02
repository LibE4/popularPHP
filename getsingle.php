
<?php
  include("config.php");
  $request = $_GET['id'];
  $conn = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
  $stmt = $conn->prepare("SELECT * FROM repos WHERE id = ?");
  $stmt->bind_param("s", $request);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  echo json_encode($row);
