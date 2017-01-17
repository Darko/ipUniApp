<?php
  $host = 'localhost';
  $db = 'ip_app';
  $dbuser = 'root';
<<<<<<< HEAD
  $dbpass = '';

  $conn = new mysqli($host, $dbuser, $dbpass, $db);
  if ($conn->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
  }
?>
=======
  $dbpass = 'root';

  $conn = new mysqli($host, $dbuser, $dbpass, $db);

?>
>>>>>>> master
