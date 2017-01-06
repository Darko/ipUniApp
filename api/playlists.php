<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  header('Content-Type: application/json');

  include 'components/errors.php';
  include 'components/functions.php';

  $endpoint = $_REQUEST['endpoint'];

  function create() {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
      echo badRequest();
      return;
    }
    global $conn;
    $title = $data['title'];
    $public = $data['public'];
    $userId = $data['id'];

    $query = "INSERT INTO playlists (title, public) VALUES ('$title', '$public')";
    $result = $conn->query($query);

    if ($result) {
      $playlistId = $conn->insert_id;

      $query = "INSERT INTO playlist_identity (playlistId, userId) VALUES ('$playlistId', '$userId')";
      $resultIdentity = $conn->query($query);

      if ($resultIdentity) {
        echo success("Create playlist");
        return;
      }
      else {
        echo notFound();
        return;
      }
    }
    else {
      echo notFound();
      return;
    }
  }

  function read() {
    if (!$_GET['id']) {
      echo badRequest();
      return;
    }

    global $conn;
    $out = array();
    $id = $_GET['id'];
    $output = array();

    // prvo da se izvlecat podatoci za playlistata
    $query = "SELECT * FROM playlists WHERE id = $id";
    $result = $conn->query($query);

    if ($result->num_rows != 0) {
      while ($row = $result->fetch_assoc()) {
        $output[] = $row;
      }
    }
    else {
      echo notFound();
      return;
    }

    // posle se vlecat podatoci za pesnite od taa playlista
    $query = "SELECT * FROM songs INNER JOIN playlist_contents ON songs.id =  playlist_contents.songId
              AND playlist_contents.playlistId = $id";
    $result = $conn->query($query);

    if ($result) {
      while ($row = $result->fetch_assoc()) {
        $output[] = $row;
      }
      echo json_encode($output);
    }
    else {
      echo notFound();
      return;
    }
  }

  function update() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $playlistId = $data['id'];

    $update = array();
    array_walk($data, 'array_sanitaze');
    foreach ($data as $field => $data) {
      $update[] = $field." = '$data' ";
    }

    $query = "UPDATE playlists SET ".implode(', ',$update).  " WHERE id = $playlistId";
    $result = $conn->query($query);
    if ($result) {
      echo success("Update playlist");
      return;
    }
    else {
      echo noContent();
      return;
    }
  }

  function deleteP() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $id = $data['id'];

    $query = "DELETE FROM playlists WHERE playlists.id = $id";
    $result = $conn->query($query);
    if ($result) {
      echo success("Delete playlist");
      return;
    }
    else {
      echo notFound();
      return;
    }
  }

  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'create':
        create();
        break;
      case 'read':
        read();
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
// ?>
