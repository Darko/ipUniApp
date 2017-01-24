<?php
  include 'components/connect.php';

  function array_sanitaze(&$item) {
    global $conn;
    $item = htmlentities(strip_tags($conn->real_escape_string($item)));
  }

  function getContents() {
    $data = json_decode(file_get_contents('php://input'), true);
    return $data;
  }
  
 ?>
