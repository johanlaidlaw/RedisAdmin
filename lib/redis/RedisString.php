<?php
namespace lib\redis;
class RedisString extends RedisType {
	
	var $type = 'string';
	
	function getAllValues($key){
		return array($this->redis_client->get($key));
	}
	
	function setValueForField($key, $field, $value){
		$this->redis_client->set($key, $value);
	}
	
}


?>