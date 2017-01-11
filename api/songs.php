<?php

  header('Content-Type: application/json');

  include 'components/functions.php';
  include 'components/errors.php';

  $endpoint = $_REQUEST['endpoint'];

  function search() {
    if (!$_GET['q'] || !$_GET['maxResults']) {
      echo badRequest();
      return;
    }

    global $conn;
    $q = preg_replace('/\s+/', '%20', $_GET['q']);
    $maxResults = $_GET['maxResults'];
    $output = array();

    $query = "SELECT * FROM songs WHERE title LIKE '%$q%' OR channelTitle LIKE '%$q%' LIMIT $maxResults";
    $result = $conn->query($query);
    if ($result->num_rows != 0) {
      while ($row = $result->fetch_assoc()) {
        $output[] = $row;
      }
      $result->close();
      echo json_encode($output);
    }
    else {
      // $DEVELOPER_KEY = 'AIzaSyDOkg-u9jnhP-WnzX5WPJyV1sc5QQrtuyc';
      $DEVELOPER_KEY = 'AIzaSyBv_P2KGXgnz1S14bgfrIiNHT4tQC8DQbg'; // kluc
      $url='https://www.googleapis.com/youtube/v3/search?q='.$q.'&maxResults='.$maxResults.'&part=snippet&key='.$DEVELOPER_KEY;

      $data = file_get_contents($url);
      echo $data;
    }
  }

  function insert() {
    $data = getContents();

    global $conn;
    $playlistId = $data['playlistId'];

    if (isset($data['kind'])) {
      //ako ja nema pesnata vo nasata baza, dodaj ja
      $title = str_replace('\'', '', $data['title']);
      $channelTitle = $data['channelTitle'];
      $url = $data['url'];

      $query = "INSERT INTO songs (title, channelTitle, url) VALUES ('$title', '$channelTitle', '$url')";
      $result = $conn->query($query);
      if ($result) {
        $songId = $conn->insert_id;
      }
      else {
        echo notFound();
        return;
      }
    }
    else {
      $songId = $data['id'];
    }

    $query = "INSERT INTO playlist_contents (playlistId, songId) VALUES ('$playlistId', '$songId')";
    $resultContent = $conn->query($query);

    if ($resultContent) {
      $query = "UPDATE playlists SET songsCount = songsCount + 1 WHERE id = $playlistId";
      $result = $conn->query($query);
      if ($result) {
        echo success("Insert song");
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

  function deleteItem() {
    $data = getContents();

    global $conn;
    $playlistId = $data['playlistId'];
    $songId = $data['id'];

    $query = "DELETE FROM playlist_contents WHERE playlistId = $playlistId AND songId = $songId";
    $resultContent = $conn->query($query);
    if ($resultContent) {
      $query = "UPDATE playlists SET songsCount = songsCount - 1 WHERE id = $playlistId";
      $result = $conn->query($query);
      if ($result) {
        echo success("Delete item");
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

endpoint($endpoint);

 ?>
