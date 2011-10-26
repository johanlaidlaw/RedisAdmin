<?php
namespace lib\redis;

class Redis{
	
	private $redis_client;
	
	function __construct(){
		$this->redis_client = RedisClient::getPredisObject();
	}
	
	
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
	
	
	private function getCommandForGettingAllValues($type){
		switch($type){
			case 'string':
				$command = 'get';
				break;
			case 'hash':
				$command = 'hgetall';
				break;
			case 'set':
				$command = 'smembers';
				break;
			case 'list':
				$command = 'lrange';
				break;
			default:
				$command = null;
		}
		return $command;
	}
	
}


?>