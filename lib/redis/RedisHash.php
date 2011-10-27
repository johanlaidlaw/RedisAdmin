<?php
namespace lib\redis;
class RedisHash extends RedisType {
	
	var $type = 'hash';
	
	function setValueForField($key, $field, $value){
		return $this->redis_client->hset($key, $field, $value);
	}

	
	function getAllValues($key){
		return $this->redis_client->hgetall($key);
	}
	
	function getNumberOfFields($key){
		return $this->redis_client->hlen($key);
		
	}
	
	
	
}


?>