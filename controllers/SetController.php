<?php
/**
 * User: johanlaidlaw
 * Date: 1/19/12
 * Time: 7:58 PM
 */

class SetController extends RedisController implements iRedisType
{



    public function editField(){
        $this->redis->srem($this->params['key'], $this->params['old_value']);
        $bool = $this->redis->sadd($this->params['key'], $this->params['value']);
        echo json_encode($bool);

    }
    public function getValues(){
        $this->getAllFields($this->params['key']);
    }









    private function getAllFields($key){
        $fields = $this->redis->smembers($key);
        $this->returnAllFields($fields, 'set');
    }
}
