<?php
  include_once 'controllers/users.php';
  include_once 'components/errors.php';

  header('Content-Type: application/json');

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;
  $user = new User();

  // Router
  switch($endpoint) {
    case 'showOne':
      User::showOne();
      break;
    case 'authenticate':
      User::authenticate();
      break;
    case 'isAuthenticated':
      User::isAuthenticated();
      break;
    default:
      echo notFound();
      break;
  }
?>
