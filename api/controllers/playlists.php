<?php
  include_once 'components/errors.php';
  include_once 'components/functions.php';

  class Playlist {
    function create() {
      $data = (object) getContents();

      if (!$data) {
        echo badRequest('No playlist payload was sent');
        return;
      }

      if (!$data->userId) {
        echo badRequest('Missing property userId');
        return;
      }

      global $conn;

      $data->private = ( isset($data->private) && $data->private ) ? 1 : 0;
      $data->thumbnail = 'https://img.youtube.com/vi/'. $data->items[0]['videoId'] .'/maxresdefault.jpg';
      $createdAt = date("Y-m-d", time());

      $query = "INSERT INTO playlists (title, createdAt, thumbnail, private, songsCount, likes, dislikes)
                VALUES ('$data->title', '$createdAt', '$data->thumbnail', '$data->private', 0, 0, 0)";
      $result = $conn->query($query);

      if (!$result) {
        echo notFound('Couldn\'t add to database');
        return;
      }

      $playlistId = $conn->insert_id;

      $query = "INSERT INTO playlist_identity (playlistId, userId) 
                VALUES ('$playlistId', '$data->userId')";
      $identity = $conn->query($query);

      if ($identity && insertSongs($data, $playlistId)) {
        $data->id = $playlistId;
        $data->private = $data->private === 1 ? true : false;


        echo json_encode($data);
        return;
      }
    }

    function show() {
      $playlistId = isset($_GET['playlistId']) ? $_GET['playlistId'] : null;

      if (!$playlistId) {
        echo badRequest('No playlist id specified');
        return;
      }

      global $conn;

      $playlistId = htmlentities(strip_tags($conn->real_escape_string($playlistId)));
      $res = (object) array();

      // prvo da se izvlecat podatoci za playlistata
      $query = "SELECT * FROM playlists
                INNER JOIN playlist_identity
                ON playlist_identity.playlistId = playlists.id
                WHERE playlists.id = $playlistId";

      $result = $conn->query($query);

      if ($result->num_rows != 0) {
        while ($row = $result->fetch_assoc()) {
          $res = (object) $row;
        }
        $result->close();
      }
      else {
        echo notFound('No playlist with such id was found');
        return;
      }

      // posle se vlecat podatoci za pesnite od taa playlista
      $query = "SELECT * FROM songs 
                INNER JOIN playlist_contents
                ON songs.id =  playlist_contents.songId
                AND playlist_contents.playlistId = $playlistId";

      $resultContent = $conn->query($query);

      if (!$resultContent) {
        echo notFound('No playlist identity was found');
        return;
      }
      

      while ($row = $resultContent->fetch_assoc()) {
        $obj = array(
          "id" => $row["id"],
          "videoId" => $row['videoId'],
          "snippet" => array(
            "title" => $row['title'],
            "channelTitle" => $row['channelTitle'],
            "thumbnail" => $row['thumbnail']
          )
        );
        $res->items[] = (object) $obj;
      }

      $resultContent->close();
      echo json_encode($res);
      return; 
    }

    function index() {
      if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        echo badRequest('To get user playlists for user you must create a GET request');
        return;
      };

      global $conn;

      $userId = htmlentities(strip_tags($conn->real_escape_string($_GET["userId"])));

      if (!$userId) {
        echo badRequest('Missing parameter userId');
        return;
      }
      $res = array();

      $query = "SELECT * FROM playlists
                INNER JOIN playlist_identity
                ON playlist_identity.playlistId = playlists.id 
                WHERE playlist_identity.userId = $userId";
      $result = $conn->query($query);

      while ($row = $result->fetch_assoc()) {
        $res[] = (object) $row;
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
      $data = (object) $data;

      $playlistId = $data->id;
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

    function addSongs() {
      if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
        echo badRequest('To insert songs you must create a PUT request');
        return;
      };

      $data = (object) getContents();
      $playlistId = $data->playlistId;

      if (insertSongs($data, $playlistId)) {
        $res = $data->items;
        echo json_encode($res);
        return;
      }
    }

    function deleteList() {
      $data = (object) getContents();
      if (!$data) {
        echo badRequest();
        return;
      }

      global $conn;
      $playlistId = htmlentities(strip_tags($conn->real_escape_string($data->playlistId)));

      if (!$playlistId) {
        echo badRequest('Missing parameter: playlistId');
      }

      $query = "DELETE FROM playlists WHERE playlists.id = $playlistId";
      $result = $conn->query($query);
      if ($result) {
        echo success("Delete playlist");
        return;
      }
      echo notFound('Playlist with such id was not found');
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
      $data = (object) $data;
      $playlistId = $data->playlistId;

      if (isset($data->like)) {
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
      echo notFound('Playlist with such id was not found');
      return;
    }

    function popular() {
      if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        echo notFound();
        return;
      };

      global $conn;

      $query = "SELECT * 
                FROM playlists
                ORDER BY likes
                DESC LIMIT 20";

      $result = $conn->query($query);
      $res = array();

      while ($row = $result->fetch_assoc()) {
        $res[] = (object) $row;
      }

      echo json_encode($res);
      $result->close();
    }

    function newLists() {
      if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        echo notFound();
        return;
      };

      global $conn;

      $query = "SELECT * 
                FROM playlists
                ORDER BY createdAt
                DESC LIMIT 10";

      $result = $conn->query($query);
      $res = array();

      while ($row = $result->fetch_assoc()) {
        $res[] = (object) $row;
      }

      echo json_encode($res);
      $result->close();
    }
  
  }
?>