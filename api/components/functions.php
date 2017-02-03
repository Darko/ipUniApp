<?php
  include 'components/connect.php';

  function array_sanitaze(&$item) {
    global $conn;
    $item = htmlentities(strip_tags($conn->real_escape_string($item)));
  }

  function getContents() {
    $data = json_decode(file_get_contents('php://input'), true);
    return $data;
  }

  function insertSongs ($data, $playlistId) {
    global $conn;

    foreach ($data['items'] as $song) {

      if (!isset($song['id'])) {
        $title = str_replace('\'', '', htmlentities($song['snippet']['title']));
        $thumbnail = $song['snippet']['thumbnail'];
        $channelTitle = $song['snippet']['channelTitle'];
        $videoId = $song['videoId'];

        $query = "INSERT INTO songs (title, thumbnail, channelTitle, videoId)
                  VALUES ('$title', '$thumbnail', '$channelTitle', '$videoId')";
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
        $songId = $song['id'];
      }

      $query = "INSERT INTO playlist_contents (playlistId, songId) VALUES ('$playlistId', '$songId')";
      $resultContent = $conn->query($query);

      if ($resultContent) {
        $query = "UPDATE playlists SET songsCount = songsCount + 1 WHERE id = $playlistId";
        $result = $conn->query($query);
        if ($result) {
          success("Insert song");
        }
      }
      else  {
        echo notFound();
        return;
      }
    } // end of foreach
    return true;
  }

 ?>
