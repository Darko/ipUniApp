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
    $thumbnail = $data['items'][0]['thumbnail'];

    $query = "INSERT INTO playlists (title, createdAt, thumbnail, private, songsCount, likes, dislikes)
              VALUES ('$title', '$date', '$thumbnail', '$private', 0, 0, 0)";
    $result = $conn->query($query);

    if (!$result) {
      echo notFound();
      return;
    }

    $playlistId = $conn->insert_id;

    $query = "INSERT INTO playlist_identity (playlistId, userId) VALUES ('$playlistId', '$userId')";
    $resultIdentity = $conn->query($query);

    if ($resultIdentity && insertSongs($data, $playlistId)) {
      $res = array(
        "id" => $playlistId
      );
      echo json_encode($res);
      return;
    }
  }

  function show() {
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

    if (!$resultContent) {
      echo notFound();
      return;
    }

    while ($row = $resultContent->fetch_assoc()) {
      $output['items'][] = array(
          "id" => $row["id"],
          "snippet" => array(
            "title" => $row['title'],
            "channelTitle" => $row['channelTitle'],
            "thumbnail" => $row['thumbnail'], 
          )
        );
    }
    $resultContent->close();
    echo json_encode($output);
    return;
  }

  function index() {
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
      echo badRequest('To get user playlists for user you must create a GET request');
      return;
    };

    global $conn;

    $userId = htmlentities(strip_tags($conn->real_escape_string($_GET["userId"])));
    $res = array();

    // 

    // $query = "SELECT * FROM playlists INNER JOIN playlist_identity WHERE userId = $userId";
    $query = "SELECT * FROM playlists INNER JOIN playlist_identity ON playlist_identity.playlistId = playlists.id and playlist_identity.userId = $userId";
    $result = $conn->query($query);

    while ($row = $result->fetch_assoc()) {
      $res[] = $row;
    }

    echo json_encode($res);
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
      case 'show':
        show();
        break;
      case 'index':
        index();
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
