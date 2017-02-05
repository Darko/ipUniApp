<?php

  ini_set('display_startup_errors', 1);
  ini_set('display_errors', 1);
  error_reporting(-1);

  header('Content-Type: application/json');
  include_once 'controllers/playlists.php';
  include_once 'components/errors.php';

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;

  if (empty($endpoint)) {
    echo notFound();
    return;
  }

  $playlist = new Playlist();

  // Router
  switch($endpoint) {
    case 'create':
      $playlist->create();
      break;
    case 'show':
      $playlist->show();
      break;
    case 'index':
      $playlist->index();
      break;
    case 'update':
      $playlist->update();
      break;
    case 'delete':
      $playlist->deleteList();
      break;
    case 'like':
      $playlist->like();
      break;
    case 'addSongs':
      $playlist->addSongs();
      break;
    case 'popular':
      $playlist->popular();
      break;
    case 'new':
      $playlist->newLists();
      break;
    default:
      echo notFound();
      break;
  }
?>