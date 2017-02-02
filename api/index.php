<?php

  header('Content-Type: application/json');

  include 'components/errors.php';
  include 'components/functions.php';

  if (isset($_GET['new']) || isset($_GET['popular'])) {

    if (isset($_GET['new'])) {
      $query = "SELECT * FROM playlists ORDER BY createdAt DESC LIMIT 10";
    }
    else {
      $query = "SELECT * FROM playlists ORDER BY likes DESC";
    }

    $outut = array();
    $result = $conn->query($query);
    if ($result->num_rows != 0) {
      while ($row = $result->fetch_assoc()) {
        $output[] = $row;
      }
      echo json_encode($output);
      $result->close();
    }
  }
  else {
    echo "homepage";
  }

?>
