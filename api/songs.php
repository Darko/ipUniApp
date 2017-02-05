<?php
  ini_set('display_startup_errors', 1);
  ini_set('display_errors', 1);
  error_reporting(-1);

  header('Content-Type: application/json');

  include_once 'controllers/songs.php';
  include_once 'components/errors.php';

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;

  if (empty($endpoint)) {
    echo notFound();
    return;
  }

  $songs = new Songs();

  // Router
  switch($endpoint) {
    case 'search':
      $songs->search();
      break;
    case 'insert':
      $songs->insert();
      break;
    case 'deleteSong':
      $songs->deleteSong();
      break;
    default:
      echo notFound();
      break;
  }
?>