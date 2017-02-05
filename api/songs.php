<?php
  include_once 'controllers/songs.php';
  include_once 'components/errors.php';

  header('Content-Type: application/json');

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;
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