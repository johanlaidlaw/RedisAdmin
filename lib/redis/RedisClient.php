<?php

namespace lib\redis;

require_once(dirname(__FILE__)."/../vendor/predis/lib/Predis/Autoloader.php");
\Predis\Autoloader::register();
//require_once("RedisExceptions.php");

class RedisClient {
	private static $instance = null;
	private static $predis = null;
	
	private static $conf = array(
		'host'     => '127.0.0.1', 
		'port'     => 6379
	);
	
	private function __construct() {
		self::$predis = self::getPredisObject();
		self::$instance = $this;
	}
	
	public static function getRedis() {
		if(self::$instance === null)
			self::$instance = new Redis();
		
		return self::$instance;
	}
	
	public static function getPredisObject() {
		if(self::$predis === null) {
			self::$predis = new \Predis\Client(self::$conf);
			if(REDIS_DB_PASSWORD)
				self::$predis->auth(REDIS_DB_PASSWORD);
		}
		
		return self::$predis;
	}
}
?>
