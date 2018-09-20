<?php
$PORT = 4242; //arbitrary port, as long as same with java port
$HOST = "localhost"; //host is this computer
//create the tpc socket
$sock = socket_create(AF_INET, SOCK_STREAM, 0) 
            or die("error: could not create socket\n");
//connecting to the socket we created
$succ = socket_connect($sock, $HOST, $PORT) 
            or die("error: could not connect to host\n");
//msg is the post submission from javascript we are passing to java
$msg = $_POST['word'];
//write the message to the socket for java
socket_write($sock, $msg . "\n" , strlen($msg)+1) 
            or die("error: failed to write to socket\n");
//read in what java wrote back on the socket
$reply = socket_read($sock, 10000, PHP_NORMAL_READ) 
            or die("error: failed to read from socket\n");
//give back java's reply
echo $reply;
?>
