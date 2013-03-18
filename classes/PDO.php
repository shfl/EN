<?php

class DB
{
	private $connection;
	private $error;
	
	static private $instance = NULL;

    static function getInstance()
    {
        if (self::$instance == NULL)
        {
            self::$instance = new DB();
        }
        return self::$instance;
    }
	
	private function __construct()
    {
        $server = 'mysql.hostinger.com.ua';
        $login = 'u285357907_en';
        $pass = 'Monclip77';
        $db = 'u285357907_en';
        
        $this->connect($server, $login, $pass, $db);
    }
	
	static function getDrivers()
	{
		return PDO::getAvailableDrivers();
	}
	
	public function connect($server = '127.0.0.1', $login = '', $password = '', $db = '')
	{
		$this->connection = new PDO("mysql:host=$server;dbname=$db", $login, $password); 
	}
	
	public function disconnect()
	{
		$this->connection = null;
	}
	
    public function query($query)
	{
		$q = $this->connection->query($query);
		
		if (is_object($q))
			return $q->fetchAll();
			
		return false;
	}
	
	public function insertId()
	{
		return $this->connection->lastInsertId();
	}
	
    public function error() 
	{
		return true;
	}
	
	public function __destruct()
	{
		$this->disconnect();
	}
}

?>