<?php
namespace lib\redis;
abstract class RedisType{
	
	var $redis_client;
	
	function __construct(){
		$this->redis_client = RedisClient::getPredisObject();
	}
	
		
	
}


?>