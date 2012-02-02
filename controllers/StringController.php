<?php
/**
 * User: johanlaidlaw
 * Date: 1/19/12
 * Time: 8:35 PM
 */

class StringController extends RedisController implements iRedisType
{

    function editField(){
        $bool = $this->redis->set($this->params['key'], $this->params['value']);
        echo json_encode($bool);
    }
    function getValues(){
        $this->getAllFields($this->params['key']);
    }



    private function getAllFields($key){
        $field = $this->redis->get($key);
        $this->returnAllFields(array($field), 'string');
    }




}
