<?php
  include_once 'controllers/playlists.php';
  include_once 'components/errors.php';

  header('Content-Type: application/json');

  $endpoint = isset($_REQUEST['endpoint']) ? $_REQUEST['endpoint'] : null;
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
    case 'follow':
      $playlist->follow();
      break;
    default:
      echo notFound();
      break;
  }
?>
