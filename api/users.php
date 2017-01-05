<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  header('Content-Type: application/json');

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
    $row = $result->fetch_assoc();

    if ($row) {
      echo json_encode($row);
      return;
    }

    echo notFound();
    return;
  }

  function create() {
    $data = json_decode(file_get_contents('php://input'), true) || null;

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

    echo success("Create user");
    return;
  }

  function update() {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data["id"];

    if(!$userId) {
      echo badRequest();
      return;
    }

    // To be continued
  }

  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'showOne':
        showOne();
        break;
      case 'create':
        create();
        break;
      case 'update':
        update();
      break;
      default:
        echo 'xd';
        break;
    }
  } else {
    echo emptyResponse();
    return;
  }
?>