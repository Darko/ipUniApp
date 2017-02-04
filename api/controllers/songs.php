<?php
  include_once 'components/functions.php';
  include_once 'components/errors.php';

  class Songs {
    function search() {
      $q = isset($_GET['q']) ? isset($_GET['q']) : null;

      if (!$q) {
        echo badRequest('Missing parameter q (search text)');
        return;
      }

      global $conn;
      $q = preg_replace('/\s+/', '%20', $q);
      $q =  htmlentities(strip_tags($conn->real_escape_string($q)));
      $maxResults = 5;
      $output = array();

      $query = "SELECT * FROM songs WHERE title LIKE '%$q%' OR channelTitle LIKE '%$q%' LIMIT $maxResults";
      $result = $conn->query($query);

      if ($result->num_rows != 0) {
        while ($row = $result->fetch_assoc()) {
          $output[] = (object) array(
            "id" => $row["id"],
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
        // $DEVELOPER_KEY = 'AIzaSyBv_P2KGXgnz1S14bgfrIiNHT4tQC8DQbg'; // kluc
        $url='https://www.googleapis.com/youtube/v3/search?q='.$q.'&maxResults='.$maxResults.
              '&part=snippet&type=video&key='.$DEVELOPER_KEY;

        $data = json_decode(file_get_contents($url), true);
        $data = (object) $data['items'];

        // $data = (object) json_decode(file_get_contents($url), true);
        // $data = $data->items;

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