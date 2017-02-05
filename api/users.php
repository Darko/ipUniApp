<?php

  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  include_once 'controllers/users.php';
  include_once 'components/errors.php';

  header('Content-Type: application/json');

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;

  if (empty($endpoint)) {
    echo notFound();
    return;
  }

  $user = new User();

  // Router
  switch($endpoint) {
    case 'showOne':
      $user -> showOne();
      break;
    case 'authenticate':
      $user -> authenticate();
      break;
    default:
      echo notFound();
      break;
  }
?>
