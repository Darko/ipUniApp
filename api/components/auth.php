<?php
  chdir(dirname(__DIR__));
  require_once('../vendor/autoload.php');
  require_once('components/errors.php');

  use Zend\Config\Config;
  use Zend\Config\Factory;
  use Zend\Http\PhpEnvironment\Request;

  $request = new Request();

  function doLogin() {
    global $request;
    if (!$request) return;

    if ($request->isPOST()) {
      $authHeader = $request->getHeader('authorization');
      $jwt = null;

      if ($authHeader) {
        list($jwt) = sscanf($authHeader->toString(), 'Authorization: Bearer %s');
      }

      if ($jwt) {
        $config = Factory::fromFile('../config/config.php', true);

        $secret = base64_decode($config->get('jwtKey'));
        $token = JWT::decode($jwt, $secret, array('HS512'));

        echo json_encode([
          'xd' => "Dank memes"
        ]);

        // try {
          
        // } catch(Exception $e) {
        //   echo notFound();
        //   return;
        // }
      } else {
        echo badRequest('No JWT was provided'); // No JWT Provided
        return;
      }
    } else {
      echo badRequest('Not a get request'); // Not a get request
      return;
    }
  }

?>