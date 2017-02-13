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
      $data->thumbnail = $data->items[0]['snippet']['thumbnail'];
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
      $query = "SELECT * FROM users INNER JOIN playlists
                INNER JOIN playlist_identity ON playlist_identity.playlistId = playlists.id
				        AND users.id = playlist_identity.userId AND playlists.id = $playlistId";

      $result = $conn->query($query);

      if ($result->num_rows != 0) {
        while ($row = $result->fetch_assoc()) {
    		  $obj["playlistId"] = $row['playlistId'];
    		  $obj["createdAt"] = $row['createdAt'];
    		  $obj["title"] = $row['title'];
    		  $obj["createdAt"] = $row['createdAt'];
    		  $obj["private"] = $row['private'];
    		  $obj["songsCount"] = $row['songsCount'];
    		  $obj["likes"] = $row['likes'];
    		  $obj["dislikes"] = $row['dislikes'];
    		  $obj["thumbnail"] = $row['thumbnail'];
    		  $obj["user"] = array (
    				"id" => $row['id'],
    				"username" => $row['username'],
    				"email" => $row['email'],
    				"role" => $row['role'],
    				"avatar" => $row['avatar']
    		  );
    		  $res = (object) $obj;
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
                WHERE playlist_contents.playlistId = $playlistId";

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

      $query = "SELECT * FROM playlists INNER JOIN users
                INNER JOIN playlist_identity
                ON playlist_identity.playlistId = playlists.id
                AND playlist_identity.userId = $userId
                AND users.id = playlist_identity.userId";
      $result = $conn->query($query);

      while ($row = $result->fetch_assoc()) {
        $obj["playlistId"] = $row['playlistId'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["title"] = $row['title'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["private"] = $row['private'];
        $obj["songsCount"] = $row['songsCount'];
        $obj["likes"] = $row['likes'];
        $obj["dislikes"] = $row['dislikes'];
        $obj["thumbnail"] = $row['thumbnail'];
        $obj["user"] = array (
          "id" => $row['id'],
          "username" => $row['username'],
          "email" => $row['email'],
          "role" => $row['role'],
          "avatar" => $row['avatar']
        );
        $res[] = (object) $obj;
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
      else if (isset($data->dislike)) {
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

      $query = "SELECT * FROM playlists INNER JOIN users INNER JOIN playlist_identity
                ON playlist_identity.userId = users.id AND playlist_identity.playlistId = playlists.id
                WHERE private = 0 ORDER BY likes DESC LIMIT 20";

      $result = $conn->query($query);
      $res = array();

      while ($row = $result->fetch_assoc()) {
        $row["playlistId"] = $row['playlistId'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["title"] = $row['title'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["private"] = $row['private'];
        $obj["songsCount"] = $row['songsCount'];
        $obj["likes"] = $row['likes'];
        $obj["dislikes"] = $row['dislikes'];
        $obj["thumbnail"] = $row['thumbnail'];
        $obj["user"] = array (
          "id" => $row['id'],
          "username" => $row['username'],
          "email" => $row['email'],
          "role" => $row['role'],
          "avatar" => $row['avatar']
          );
        $res[] = (object) $obj;
      }

      echo json_encode($res);
      $result->close();
      return;
    }

    function newLists() {
      if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        echo notFound();
        return;
      };

      global $conn;

      $query = "SELECT * FROM playlists INNER JOIN users INNER JOIN playlist_identity
                ON playlist_identity.userId = users.id AND playlist_identity.playlistId = playlists.id
                WHERE private = 0 ORDER BY createdAt DESC LIMIT 20";

      $result = $conn->query($query);
      $res = array();

      while ($row = $result->fetch_assoc()) {
        $row["playlistId"] = $row['playlistId'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["title"] = $row['title'];
        $obj["createdAt"] = $row['createdAt'];
        $obj["private"] = $row['private'];
        $obj["songsCount"] = $row['songsCount'];
        $obj["likes"] = $row['likes'];
        $obj["dislikes"] = $row['dislikes'];
        $obj["thumbnail"] = $row['thumbnail'];
        $obj["user"] = array (
          "id" => $row['id'],
          "username" => $row['username'],
          "email" => $row['email'],
          "role" => $row['role'],
          "avatar" => $row['avatar']
          );
        $res[] = (object) $obj;
      }

      echo json_encode($res);
      $result->close();
      return;
    }

    function follow() {
      if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        echo notFound();
        return;
      };

      // $userObj->isAuthenticated();
      $data = getContents();
      if (!$data) {
        echo badRequest();
        return;
      }

      global $conn;
      array_walk($data, 'array_sanitaze');

      $userData = (object) $data;
      $following = $this->isFollowing($userData, true)->following;

      if ($following) {
        $res = new stdClass(); $res->already_following = true;
        echo json_encode($res);
        return;
      }

      $query = "INSERT INTO playlist_followers (playlistId, userId) VALUES ('$userData->playlistId', '$userData->userId')";
      $result = $conn->query($query);

      if ($result) {
        echo success("Playlist followed");
        return;
      }

      echo notFound();
      return;
    }

    function unfollow() {
      if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        echo notFound();
        return;
      };

      // $userObj->isAuthenticated();
      global $conn;

      $userData = (object) getContents();

      $userData->userId = $userData->userId ? htmlentities(strip_tags($conn->real_escape_string($userData->userId))) : null;
      $userData->playlistId = $userData->playlistId ? htmlentities(strip_tags($conn->real_escape_string($userData->playlistId))) : null;

      if (!$userData->userId) {
        echo badRequest('Missing parameter userId');
        return;
      } else if (!$userData->playlistId) {
        echo badRequest('Missing parameter playlistId');
        return;
      }

      $query = "DELETE FROM playlist_followers
                WHERE userId = $userData->userId
                AND playlistId = $userData->playlistId";

      $result = $conn->query($query);
      $res = new stdClass();

      if ($result) {
        $res->unfollowed = true;
      } else {
        $res->unfollowed = false;
      }

      echo json_encode($res);
      return;
    }

    function isFollowing($data = null, $internalReq = false) {
      if (!$internalReq) {
        if ($_SERVER['REQUEST_METHOD'] != 'GET') {
          echo notFound();
          return;
        };
      }

      // $userObj->isAuthenticated();
      global $conn;
      $userData = null;

      if (!$data) {
        $userData = new stdClass();
        $userData->userId = $_GET['userId'] ?  intval(htmlentities(strip_tags($conn->real_escape_string($_GET['userId'])))): null;
        $userData->playlistId = $_GET['playlistId'] ? intval(htmlentities(strip_tags($conn->real_escape_string($_GET['playlistId'])))) : null;
      } else {
        $userData = $data;
      }

      if (!$userData->userId) {
        echo badRequest('Missing parameter userId');
        return;
      } else if (!$userData->playlistId) {
        echo badRequest('Missing parameter playlistId');
        return;
      }

      $query = "SELECT * FROM playlist_followers
                WHERE userId = $userData->userId
                AND playlistId = $userData->playlistId";

      $result = $conn->query($query);

      $res = new stdClass();

      if ($result->num_rows) {
        $res->following = true;
      } else {
        $res->following = false;
      }

      if(!$internalReq) {
        echo json_encode($res);
      }
      return $res;
    }

  }
?>
