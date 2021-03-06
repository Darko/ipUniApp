<?php
  // ini_set('display_startup_errors', 1);
  // ini_set('display_errors', 1);
  // error_reporting(-1);

  function notFound($message = null) {
    $message = isset($message) ? 'Not found: ' . $message : 'Not found';
    $result = array('status' => 404, 'message' => 'Not found');
    return json_encode($result);
  }

  function badRequest($message = null) {
    $message = isset($message) ? 'Bad request: '. $message : 'Bad request';
    $result = array('status' => 400, 'message' => $message);
    return json_encode($result);
  }

  function success($method) {
    $result = array(
      "method" => $method,
      "status" => 201,
      "message" => "OK"
    );
    return json_encode($result);
  }

  function emptyResponse() {
    $result = array(
      "status" => 200
    );
    return json_encode($result);
  }

  function unauthorized() {
    return header('HTTP/1.0 401 Unauthorized');
  }

?>
