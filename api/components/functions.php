<?php
  include 'components/connect.php';

  function array_sanitaze(&$item){
    global $conn;
    $item = htmlentities(strip_tags($conn->real_escape_string($item)));
  }

  function getContents(){
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
      echo badRequest();
      return;
    }
    else return $data;
  }

  function endpoint($endpoint){
    if (!empty($endpoint)) {
      switch($endpoint) {
        case 'create':
          create();
          break;
        case 'read':
          read();
          break;
        case 'search':
          search();
          break;
        case 'insert':
          insert();
          break;
        case 'deleteItem':
          deleteItem();
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
