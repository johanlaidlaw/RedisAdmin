<?php

class ListController extends RedisController implements iRedisType
{


    public function addField(){
        $this->redis->rpush($this->params['key'], $this->params['value']);
        $this->getAllFields($this->params['key']);
    }

    public function editField(){
        $bool = $this->redis->lset($this->params['key'], $this->params['field'], $this->params['value']);
        echo json_encode($bool);

    }
    public function getValues(){
        $this->getAllFields($this->params['key']);
    }









    private function getAllFields($key){
        $fields = $this->redis->lrange($key, 0, -1);
        $this->returnAllFields($fields, 'list');
    }
}
