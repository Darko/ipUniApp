<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  include 'components/connect.php';
  include 'components/errors.php';

  $endpoint = $_REQUEST['endpoint'];

  function showOne() {
    if (!$_GET['userId']) {
      echo badRequest();
      return;
    }

    global $conn;
    $userId = $_GET['userId'];
    $query = "SELECT * FROM users WHERE id = " . $userId;

    $result = $conn->query($query);

    if ($result) {
      return print_r($result);
    } else {
      echo notFound();
      return;
    }
  }

  function create() {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $username = $data['username'];
    $email = $data['email'];
    $avatar = $data['avatar'];

    $query = "INSERT INTO users (username, email, avatar, role) VALUES ('$username', '$email', '$avatar' , 'user')";

    $result = $conn->query($query);

    var_dump($result);
  }

  switch($endpoint) {
    case 'showOne':
      showOne();
      break;
    case 'create':
      create();
      break;
    default:
      echo 'xd';
      break;
  }
// ?>