<?php

  header('Content-Type: application/json');

  include 'components/errors.php';
  include 'components/functions.php';

  $endpoint = $_REQUEST['endpoint'];

  function create() {
    $data = getContents();
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $title = $data['title'];
    $private = (isset($data['private']) && $data['private']) ? 1 : 0;
    $userId = $data['userId'];
    $date = date("Y-m-d", time());

    $query = "INSERT INTO playlists (title, createdAt, private, songsCount, likes, dislikes)
              VALUES ('$title', '$date', '$private', 0, 0, 0)";
    $result = $conn->query($query);

    if ($result) {
      $playlistId = $conn->insert_id;

      $query = "INSERT INTO playlist_identity (playlistId, userId) VALUES ('$playlistId', '$userId')";
      $resultIdentity = $conn->query($query);

      if ($resultIdentity) {
        echo success("Create playlist");
      }

      else {
        echo notFound();
        return;
      }

      if (insertSongs($data, $playlistId)) {
        echo success("Songs insert");
        return;
      }

    }
    echo notFound();
    return;
  }

  function read() {
    if (!$_GET['id']) {
      echo badRequest();
      return;
    }

    global $conn;
    $out = array();
    $id = $_GET['id'];
    $id = htmlentities(strip_tags($conn->real_escape_string($id)));
    $output = array();

    // prvo da se izvlecat podatoci za playlistata
    $query = "SELECT * FROM playlists WHERE id = $id";
    $result = $conn->query($query);

    if ($result->num_rows != 0) {
      while ($row = $result->fetch_assoc()) {
        $output = $row;
      }
      $result->close();
    }
    else {
      echo notFound();
      return;
    }

    // posle se vlecat podatoci za pesnite od taa playlista
    $query = "SELECT * FROM songs INNER JOIN playlist_contents ON songs.id =  playlist_contents.songId
              AND playlist_contents.playlistId = $id";
    $resultContent = $conn->query($query);

    if ($resultContent) {
      while ($row = $resultContent->fetch_assoc()) {
        $output['items'][] = $row;
      }
      $resultContent->close();
      echo json_encode($output);
      return;
    }
    echo notFound();
    return;
  }

  function update() {
    $data = getContents();
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    array_walk($data, 'array_sanitaze');
    $playlistId = $data['playlistId'];
    $update = array();

    foreach ($data as $field => $data) {
      $update[] = $field." = '$data' ";
    }

    $query = "UPDATE playlists SET ". implode(', ', $update) . " WHERE id = $playlistId";
    $result = $conn->query($query);
    if ($result) {
      echo success("Update playlist");
      return;
    }
    echo notFound();
    return;
  }

  function deleteList() {
    $data = getContents();
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $id = htmlentities(strip_tags($conn->real_escape_string($data['playlistId'])));

    $query = "DELETE FROM playlists WHERE playlists.id = $id";
    $result = $conn->query($query);
    if ($result) {
      echo success("Delete playlist");
      return;
    }
    echo notFound();
    return;
  }

  function like() {
    $data = getContents();
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    array_walk($data, 'array_sanitaze');
    $playlistId = $data['playlistId'];

    if (isset($data['like'])) {
      $query = "UPDATE playlists SET likes = likes + 1 WHERE playlists.id = $playlistId";
    }
    else if (isset($data['dislike'])) {
      $query = "UPDATE playlists SET dislikes = dislikes + 1 WHERE playlists.id = $playlistId";
    }
    $result = $conn->query($query);
    if ($result) {
      echo success("Dis/Liked playlist");
      return;
    }
    echo notFound();
    return;
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
        deleteList();
        break;
      case 'like':
        like();
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
?>
