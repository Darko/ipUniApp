<?php
  include_once 'components/connect.php';
  include_once 'components/errors.php';
  include_once 'components/loginApis.php';

  $headers = getallheaders();

  class User {
    function authenticate() {
      global $headers;

      $access_token = null;
      $provider = isset($_REQUEST['provider']) ? $_REQUEST['provider'] : 'facebook';

      $access_token = explode(" ", $headers['authorization'])[1];

      if (!$access_token) {
        echo badRequest('Missing auth parameter: access_token');
        return;
      } else if (!$provider) {
        echo badRequest('Missing auth parameter: provider');
      }

      global $conn;
      global $loginApis;

      $uri = $loginApis[$provider] . $access_token;

      $res = json_decode(file_get_contents($uri, false));

      $userData = $this->createUserData($res, $provider);

      $query = "SELECT email, id FROM users WHERE email = '$userData->email'";
      $user = $conn->query($query);
      $user = $user->fetch_assoc();

      // if user with email exists, return to client, else create and return
      if ($user['email']) {
        $userData->id = $user['id'];

        echo json_encode($userData);
        return;
      }
      else {
        $query = "INSERT INTO users (username, email, avatar, role) VALUES ('$userData->username', '$userData->email', '$userData->avatar' , 'user')";
        $conn->query($query);

        $userData->id = $conn->insert_id;

        echo json_encode($userData);
        return;
      }
    }

    function createUserData($data, $provider) {
      $user = new stdClass();

      if ($provider === 'facebook') {
        $user -> email = $data->email;
        $user -> username = $data->name;
        $user -> avatar = $data->picture->data->url;
      } else if ($provider === 'google') {
        // do google
      }

      return $user;
    }

    function showOne() {
      global $headers;

      $access_token = explode(" ", $headers['authorization'])[1];
      $userId = $_GET['userId'];

      if (!$access_token) {
        echo unauthorized();
        return;
      } else if (!$userId) {
        echo badRequest('Missing parameter userId');
        return;
      }

      global $conn;

      $query = "SELECT * FROM users WHERE id = " . $userId;
      $result = $conn->query($query);
      $row = $result->fetch_assoc();
      
      if (!$row) {
        echo notFound();
        return;
      }

      echo json_encode($row);
      return;
    }
  }
?>