<?php
/**
 * User: johanlaidlaw
 * Date: 1/19/12
 * Time: 5:44 PM
 */

class HashController extends RedisController implements iRedisType
{
    function addField(){
        $this->redis->hset($this->params['key'], $this->params['field'], $this->params['value']);
        $this->getAllFields($this->params['key']);
    }
    function deleteField(){
        $this->redis->hdel($this->params['key'], $this->params['field']);
    }
    function getField(){
        $this->redis->hget($this->params['key'], $this->params['field']);
    }
    function editField(){
        $bool = $this->redis->hset($this->params['key'], $this->params['field'], $this->params['value']);
        echo json_encode($bool);
    }
    function getValues(){
        $this->getAllFields($this->params['key']);
    }








    private function getAllFields($key){
        $fields = $this->redis->hgetall($key);
        $this->returnAllFields($fields, 'hash');
    }

}
