<?php
class RedisController extends ApplicationController{

    function __construct(){
        $this->redis = lib\redis\RedisClient::getPredisObject();
        if(isset($_SESSION['redis_db'])){
            $this->redis->select(intval($_SESSION['redis_db']));
        }
    }

    function keys(){
        $keys = $this->redis->keys($this->params['pattern']);
        $keys_with_types = array();
        $sliced = false;
        if(count($keys) > 100){
            $sliced = true;
            $keys = array_slice($keys,0,100);
        }
        foreach($keys as $k){
            $keys_with_types[] = array($k, $this->redis->type($k));
        }
        echo json_encode(array("keys" =>$keys_with_types, "sliced" => $sliced));
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