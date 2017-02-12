<?php
  include_once 'controllers/users.php';
  include_once 'components/errors.php';

  header('Content-Type: application/json');

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;
  $user = new User();

  // Router
  switch($endpoint) {
    case 'showOne':
      $user -> showOne();
      break;
    case 'authenticate':
      $user -> authenticate();
      break;
    case 'isAuthenticated':
      $user -> isAuthenticated();
      break;
    default:
      echo notFound();
      break;
  }
?>
