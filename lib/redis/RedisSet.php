<?php
namespace lib\redis;
class RedisSet extends RedisType {
	
	var $type = 'set';
	
	function getAllValues($key){
		return $this->redis_client->smembers($key);
	}
	
	function setValueForField($key, $field, $value){
		return $this->redis_client->sadd($key, $value);
	}
	
}


?>