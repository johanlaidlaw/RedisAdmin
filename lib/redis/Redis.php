<?php
namespace lib\redis;

class Redis{
	
	/*
	function getAllValues($key){
		$type = $this->redis_client->type($key);
		$command = $this->getCommandForGettingAllValues($type);
		if($command != 'list')
			$values = call_user_func_array(array($this->redis_client, $command), array($key));
		else{
			$length = $this->redis_client->llen($key);
			$values = $this->redis_client->lrange($key, 0,$length);
		}
		return $values;
	}
	*/
	
	
	function getTypeObj($key){
		$r = RedisClient::getPredisObject();
		$type = $r->type($key);
		return $this->findType($type);
	}
	
	
	private function findType($type){
		switch($type){
			case 'string':
				$obj = new RedisString;
				break;
			case 'hash':
				$obj = new RedisHash();
				break;
			case 'set':
				$obj = new RedisSet();
				break;
			case 'list':
				$obj = new RedisList();
				break;
			default:
				$obj = null;
		}
		return $obj;
		
	}
	
	
}


?>