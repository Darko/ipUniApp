<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  function notFound() {
    $result = array('status' => 404, 'message' => 'Not found');
    return json_encode($result);
  }

  function badRequest() {
    $result = array('status' => 400, 'message' => 'Bad request');
    return json_encode($result);
  }

?>