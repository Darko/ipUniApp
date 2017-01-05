<?php
  include 'components/connect.php';

  function array_sanitaze(&$item){
    global $conn;
    $item = htmlentities(strip_tags($conn->real_escape_string($item)));
  }
 ?>
