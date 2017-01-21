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

  function endpoint($endpoint) {
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
        case 'deleteSong':
          deleteSong();
          break;
        case 'update':
          update();
          break;
        case 'deletePlayist':
          deletePlayist();
          break;
        case 'likePlaylist':
          likePlaylist();
          break;
        default:
          echo 'xd';
          break;
      }
    }
    else {
      echo badRequest();
      return;
    }
  }
 ?>
