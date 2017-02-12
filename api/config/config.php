<?php
  set_include_path(get_include_path() . PATH_SEPARATOR . $_SERVER['DOCUMENT_ROOT']);

  class Config {
    static $secret = 'dmmsb'; // Dank memes melt steel beams
    static $authMode = 'Bearer';

    public static function getSecret() {
      return self::$secret;
    }

    public static function getMode() {
      return self::$authMode;
    }
  }
?>