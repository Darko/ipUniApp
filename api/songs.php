<?php

  header('Content-Type: application/json');

  include 'components/functions.php';
  include 'components/errors.php';

  $endpoint = $_REQUEST['endpoint'];

  function search() {
    if (!$_GET['q']) {
      echo badRequest();
      return;
    }

    global $conn;
    $q = preg_replace('/\s+/', '%20', $_GET['q']);
    $q =  htmlentities(strip_tags($conn->real_escape_string($q)));
    $maxResults = 5;
    $output = array();

    $query = "SELECT * FROM songs WHERE title LIKE '%$q%' OR channelTitle LIKE '%$q%' LIMIT $maxResults";
    $result = $conn->query($query);
    if ($result->num_rows != 0) {
      while ($row = $result->fetch_assoc()) {
        $output[] = $row;
      }
      $result->close();
      echo json_encode($output);
      return;
    }
    else {
      // $DEVELOPER_KEY = 'AIzaSyDOkg-u9jnhP-WnzX5WPJyV1sc5QQrtuyc';
      $DEVELOPER_KEY = 'AIzaSyBv_P2KGXgnz1S14bgfrIiNHT4tQC8DQbg'; // kluc
      $url='https://www.googleapis.com/youtube/v3/search?q='.$q.'&maxResults='.$maxResults.
            '&part=snippet&type=video&key='.$DEVELOPER_KEY;

      $data = json_decode(file_get_contents($url), true);
      if ($data && $data['items']) {
        $data = $data['items'];
      }
      echo json_encode($data);
      return;
    }
    echo notFound();
    return;
  }

  function insert() {
    $bigData = getContents();
    if (!$bigData) {
      echo badRequest();
      return;
    }

    global $conn;
    $playlistId = htmlentities(strip_tags($conn->real_escape_string($bigData['playlistId'])));

    foreach ($bigData['items'] as $data) {
      array_walk($data, 'array_sanitaze');

      if (!isset($data['id'])) {
        //ako ja nema pesnata vo nasata baza, dodaj ja
        $title = str_replace('\'', '', htmlentities($data['title']));
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
        }
      }
      else  {
        echo notFound();
        return;
      }
    } // end of foreach
    return;
  }

  function deleteSong() {
    $data = getContents();
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    array_walk($data, 'array_sanitaze');
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
    }
    echo notFound();
    return;
  }

endpoint($endpoint);

 ?>
