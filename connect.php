<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "shoes";

// Kết nối đến cơ sở dữ liệu
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if (!$conn) {
    die("Kết nối thất bại: " . mysqli_connect_error());
}
echo "thanh cong"
?>