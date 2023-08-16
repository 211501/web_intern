<?php
include 'connect.php';

// Lấy thông tin từ biến POST
$itemName = $_POST['item_name'];
$itemPrice = $_POST['item_price'];
$quantity = $_POST['quantity'];

echo "Item Name: " . $itemName . "<br>";
echo "Item Price: " . $itemPrice . "<br>";
echo "Quantity: " . $quantity . "<br>";

// Thực hiện truy vấn để thêm dữ liệu
$sql = "INSERT INTO cart_items (item_name, item_price, quantity) VALUES ('$itemName', $itemPrice, $quantity)";

if (mysqli_query($conn, $sql)) {
    echo "Thêm dữ liệu thành công!";
} else {
    echo "Lỗi: " . mysqli_error($conn);
}

// Đóng kết nối
mysqli_close($conn);
?>
