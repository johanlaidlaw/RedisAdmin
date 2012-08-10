<?php
class RedisController extends ApplicationController{

    function __construct(){
        parent::__construct();
        if(isset($_SESSION['redis_environment'])){
            $port = $this->Config->get("environment", $_SESSION['redis_environment']);
            lib\redis\RedisClient::setPort($port);
        }
        $this->redis = lib\redis\RedisClient::getPredisObject();
        if(isset($_SESSION['redis_db'])){
            $this->redis->select(intval($_SESSION['redis_db']));
        }
    }

    function keys(){
    	$pattern = $this->params['pattern'];
    	$show_all = $this->params['all'];
    	
    	if(strpos($pattern, "*") !== false) {
    		$keys = $this->redis->keys($pattern);
    	} else {
        	$keys = ($this->redis->exists($pattern))? array($pattern) : array();
    	}
    	
        $keys_with_types = array();
        $count = count($keys);
        $sliced = false;
        if($count > 100 && !$show_all){
            $sliced = true;
            $keys = array_slice($keys,0,100);
        }
        foreach($keys as $k){
            $keys_with_types[] = array($k, $this->redis->type($k));
        }
        echo json_encode(array("keys" => $keys_with_types, "count" => $count, "sliced" => $sliced));
    }

    function del(){
        $bool = $this->redis->del($this->params['key']);
        echo json_encode($bool);
    }


    function setDatabase(){
        if(isset($this->params['db'])){
            $_SESSION['redis_db'] = $this->params['db'];
        }
    }
    function setEnvironment(){
        if(isset($this->params['environment'])){
            $_SESSION['redis_environment'] = $this->params['environment'];
        }
    }

    function flushdb(){
        $this->redis->flushdb();
    }

    protected function returnAllFields($fields, $type){
        if(empty($fields))
            echo json_encode(false);
        else{
            ksort($fields);
            echo json_encode(array("data" =>$fields, "type" => $type));
        }
    }

    /*
	function exec(){
		$command = $this->params['command'];
		$key = $this->params['key'];
		$redis = lib\redis\RedisClient::getPredisObject();
		$output = call_user_func_array(array($redis, $command), array($key));
		echo json_encode($output);
	}
	
	function getValues(){
		$key = $this->params['key'];
		$r = new lib\redis\Redis();
		$typeObj = $r->getTypeObj($key);
		$values = $typeObj->getAllValues($key);
        ksort($values);
		echo json_encode(array("data" =>$values, "type" => $typeObj->type));
	}

	
	function setValueForField(){
		$key = $this->params['key'];
		$field = $this->params['field'];
		$new_value = $this->params['value'];
		$r = new lib\redis\Redis();
		$typeObj = $r->getTypeObj($key);
		$bool = $typeObj->setValueForField($key, $field, $new_value);
		echo json_encode($bool);
	}

    function addMember(){
        $r = \lib\redis\RedisClient::getPredisObject();
        $r->hset($this->params['key'], $this->params['member_key'], $this->params['member_value']);
        $this->getValues();

        //echo json_encode("hej");
    }
    */

}



?>