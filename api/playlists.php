<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  header('Content-Type: application/json');

  include 'components/errors.php';
  include 'components/functions.php';

  $endpoint = $_REQUEST['endpoint'];

  function create() {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
      echo badRequest();
      return;
    }
    global $conn;
    $title = $data['title'];
    $public = $data['public'];

    $query = "INSERT INTO playlists (title, public) VALUES ('$title', '$public')";
    $result = $conn->query($query);
    if($result){
      echo success("Create playlist");
      return;
    }
    else{
      echo notFound();
      return;
    }
  }

  function read(){
    if (!$_GET['id']) {
      echo badRequest();
      return;
    }

    global $conn;
    $out = array();
    $id=$_GET['id'];
    
    $query = "SELECT * FROM songs JOIN playlist_contents ON songs.id =  playlist_contents.songId
              AND playlist_contents.playlistId = $id";
    $result = $conn->query($query);

    if($result){
      while($object=$result->fetch_object()){
        $out[]=$object;
      }
      echo json_encode($out);
    }
    else{
      echo notFound();
      return;
    }
  }

  function update() {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $update=array();
    array_walk($data, 'array_sanitaze');
    foreach ($data as $field => $data) {
      $update[]=$field."='$data'";
    }

    $query = "UPDATE playlists SET ".implode(', ',$update).  " WHERE id=7";//treba id-to da se zima
    $result = $conn->query($query);
    if($result){
      echo success("Update playlist");
      return;
    }
    else{
      echo noContent();
      return;
    }
  }

  function deleteP(){
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
      echo badRequest();
      return;
    }

    global $conn;
    $id=$data['id'];

    $query = "DELETE FROM playlists WHERE id=$id";
    $result = $conn->query($query);
    if($result){
      echo success("Delete playlist");
      return;
    }
    else{
      echo notFound();
      return;
    }
  }

  if (!empty($endpoint)) {
    switch($endpoint) {
      case 'create':
        create();
        break;
      case 'read':
        read();
        break;
      case 'update':
        update();
        break;
      case 'delete':
        deleteP();
        break;
      default:
        echo 'xd';
        break;
    }
  }
  else {
    echo emptyResponse();
    return;
  }
// ?>
