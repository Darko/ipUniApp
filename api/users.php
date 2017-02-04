<?php

  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  header('Content-Type: application/json');

  include_once 'controllers/users.php';
  include_once 'components/errors.php';

  $endpoint = $_REQUEST['endpoint'];

  $user = new User();

  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'showOne':
        $user -> showOne();
        break;
      case 'authenticate':
        $user -> authenticate();
        break;
      default:
        echo 'xd';
        break;
    }
  } else {
    echo badRequest();
    return;
  }
?>
