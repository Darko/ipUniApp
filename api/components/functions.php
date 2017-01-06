<?php
  include 'components/connect.php';

  function array_sanitaze(&$item){
    global $conn;
    $item = htmlentities(strip_tags($conn->real_escape_string($item)));
  }

  function endpoint($endpoint){
  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'search':
        search();
        break;
      case 'insert':
        insert();
        break;
      case 'update':
        update();
        break;
      case 'delete':
        deleteP();
        break;
      default:
        echo 'xd';
        break;
    }
  }
  else {
    echo emptyResponse();
    return;
  }
}
 ?>
