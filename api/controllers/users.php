<?php
  include_once 'components/functions.php';
  // enableErrors();

  include_once 'config/config.php';
  include_once 'components/connect.php';
  include_once 'components/errors.php';
  include_once 'components/loginApis.php';

  include_once 'vendor/firebase/php-jwt/src/JWT.php';
  use \Firebase\JWT\JWT;


  $headers = getallheaders();

  class User {
    public static function authenticate() {
      global $headers;

      $access_token = null;
      $provider = isset($_REQUEST['provider']) ? $_REQUEST['provider'] : 'facebook';

      $access_token = explode(" ", $headers['authorization'])[1];

      if (!$access_token) {
        echo badRequest('Missing auth parameter: access_token');
        return;
      } else if (!$provider) {
        echo badRequest('Missing auth parameter: provider');
        return;
      }

      global $conn;
      global $loginApis;

      $uri = $loginApis[$provider] . $access_token;

      $res = json_decode(file_get_contents($uri, false));

      $userData = self::createUserData($res, $provider);
      $userData->username = preg_replace('/[^a-zA-Z0-9 ]/', '', $userData->username);

      $query = "SELECT email, id FROM users WHERE email = '$userData->email'";
      $user = $conn->query($query);
      $user = $user->fetch_assoc();

      // if user with email exists, return to client, else create and return
      if ($user['email']) {
        $userData->id = $user['id'];
      }
      else {
        $query = "INSERT INTO users (username, email, avatar, role) VALUES ('$userData->username', '$userData->email', '$userData->avatar' , 'user')";
        $conn->query($query);
        $userData->id = $conn->insert_id;
      }

      $res = new stdClass();

      $res->token = self::createToken($userData);
      $res->user = $userData;

      self::setAuthorizationHeader($res->token);
      echo json_encode($res);
      return;
    }

    static function createToken($data) {
      $token = JWT::encode($data, Config::getSecret());
      return $token;
    }

    static function createUserData($data, $provider) {
      $user = new stdClass();

      if ($provider === 'facebook') {
        $user -> email    = $data->email;
        $user -> username = $data->name;
        $user -> avatar   = $data->picture->data->url;
      } else if ($provider === 'google') {
        // do google
      }

      return $user;
    }

    public static function showOne() {
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
    
    public static function isAuthenticated($token = null, $internal = false) {
      $token = $_COOKIE['token'] ? $_COOKIE['token'] : $token; 

      // If there's no token, it's unauthorized
      if (!$token) {
        echo unauthorized();
        return false;
      }

      // Decode token and get user data
      $key = Config::getSecret();
      $user = JWT::decode($token, $key, array('HS256'));

      $res = new stdClass();
      $res->user = $user;

      self::setAuthorizationHeader($token);

      if (!$internal) {
        echo json_encode($res);
      }

      return true;
    }

    public static function setAuthorizationHeader($jwt) {
      $mode = Config::getMode();
      $token = $jwt;
      $dayzz = time()+60*60*24*30; // 30 days

      return setcookie('token', $token);
    }
  }
?>
