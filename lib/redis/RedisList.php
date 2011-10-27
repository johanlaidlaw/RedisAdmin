<?php
namespace lib\redis;
class RedisList extends RedisType {
	
	var $type = 'list';
	
	
	function getAllValues($key){
		$length = $this->redis_client->llen($key);
		return $this->redis_client->lrange($key,0,$length);
	}
	
}


?>