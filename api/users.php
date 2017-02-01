<?php

  ini_set('display_startup_errors', 1);
  ini_set('display_errors', 1);
  error_reporting(-1);

  header('Content-Type: application/json');

  include 'components/connect.php';
  include 'components/errors.php';
  include 'components/loginApis.php';

  $endpoint = $_REQUEST['endpoint'];
  $headers = getallheaders();

  function showOne() {
    if (!$_GET['userId']) {
      echo badRequest();
      return;
    }

    global $conn;
    $userId = $_GET['userId'];
    $query = "SELECT * FROM users WHERE id = " . $userId;

    $result = $conn->query($query);
    $row = $result->fetch_assoc();

    if ($row) {
      echo json_encode($row);
      return;
    }

    echo notFound();
    return;
  }


  function authenticate() {
    global $headers;
    
    $access_token = explode(" ", $headers['authorization'])[1];
    $provider = $_GET['provider'];
    $expiresIn = $_GET['expires_in'];
    
    if (!$access_token) {
      echo badRequest('Missing parameter: access_token');
      return;
    } else if (!$provider) {
      echo badRequest('Missing auth parameter: provider');
      return;
    } else if (!$expiresIn) {
      echo badRequest('Missing parameter: expires_in');
      return;
    }

    global $conn;
    global $loginApis;

    $uri = $loginApis[$provider]. $access_token;

    $res = json_decode(file_get_contents($uri, false));
    
    $email = $res->email;
    $username = $res->name;
    $avatar = $res->picture->data->url;
    $res->access_token = $access_token;
    $res->expiresIn = $expiresIn;

    // Check if email exists
    $query = "SELECT email, id FROM users WHERE email = '$email'";
    $response = $conn->query($query);
    $response = $response->fetch_assoc();

    if ($response["email"]) { // User with email exists
      $res->userId = $response['id'];
      setTokens($res, true);

      $user = array(
        "username" => $username,
        "image" => $avatar,
        "email" => $email,
        "id" => $res->userId
      );
      
      echo json_encode($user);
      return;
    } else {
      $query = "INSERT INTO users (username, email, avatar, role) VALUES ('$username', '$email', '$avatar' , 'user')";
      $conn->query($query);

      $q = "SELECT email, id FROM users WHERE email = '$res->email'";
      $result = $conn->query($q);
      $result = $result->fetch_assoc();
      $res->userId = $result['id'];
      setTokens($res, true);

      $user = array(
        "username" => $username,
        "image" => $avatar,
        "email" => $email,
        "id" => $res->userId
      );
      
      echo json_encode($user);
      return;
    }
  }

  function setTokens($userobj, $loggingIn) {
    global $conn;
  
    $query = "INSERT into tokens (userId, expiresIn, token, expired) VALUES ('$userobj->userId', '$userobj->expiresIn', '$userobj->access_token', '$loggingIn')";
    $response = $conn->query($query);

    return true;
  }

  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'showOne':
        showOne();
        break;
      case 'authenticate':
        authenticate();
        break;
      default:
        echo 'xd';
        break;
    }
  } else {
    echo badRequest();
    return;
  }
?>
