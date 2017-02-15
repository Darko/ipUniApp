<?php
  include_once 'components/functions.php';
  include_once 'components/errors.php';

  class Songs {
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
          $output[] = (object) array(
            "id" => $row['id'],
            "videoId" => $row['videoId'],
            "snippet" => array(
              "title" => $row['title'],
              "channelTitle" => $row['channelTitle'],
              "thumbnail" => $row['thumbnail'], 
            )
          );
        }
        $result->close();
        echo json_encode($output);
        return;
      }
      else {
        $DEVELOPER_KEY = 'AIzaSyCoXR0IQnJf_29KC62K_hl5C00CFUofcDw';
        $url='https://www.googleapis.com/youtube/v3/search?q='.$q.'&maxResults='.$maxResults.
              '&part=snippet&type=video&key='.$DEVELOPER_KEY;

        $data = json_decode(file_get_contents($url), true);
        $data = $data['items'];
        echo json_encode($data);
        return;
      }
      echo notFound();
      return;
    }

    function insert() {
      $data = (object) getContents();
      if (!$data) {
        echo badRequest('Missing payload');
        return;
      }

      global $conn;
      $playlistId = $data->playlistId;

      if (insertSongs($data, $playlistId)) {
        echo success();
        return;
      }

      echo notFound();
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
      $data = (object) $data;

      $query = "DELETE FROM playlist_contents 
                WHERE playlistId = $data->playlistId
                AND songId = $data->id";
      $resultContent = $conn->query($query);

      if ($resultContent) {
        $query = "UPDATE playlists 
                  SET songsCount = songsCount - 1
                  WHERE id = $data->playlistId";
        $result = $conn->query($query);

        if ($result) {
          echo success();
          return;
        }
      }

      echo notFound();
      return;
    }
  }
?>