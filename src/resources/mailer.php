<?php
// Custom PHPMailer
require 'phpmailer-custom/PHPMailer.php';
require 'phpmailer-custom/SMTP.php';
require 'phpmailer-custom/Exception.php';


$user_name = $_POST["user_name"];
$user_company = $_POST["user_company"];
$user_job = $_POST["user_job-title"];
$user_phone = $_POST["user_phone"];
$user_mail = $_POST["user_mail"];




$title = "Регистрация NewSolar";
$body = "
<h2>Регистрация NewSolar</h2>
<hr><br>
<b>ФИО:</b> {$user_name}<br>
<b>Ваша компания:</b> {$user_company}<br>
<b>Должность:</b> {$user_job}<br>
<b>Номер телефона:</b> {$user_phone}<br>
<b>Email:</b> {$user_mail}<br><br>
";



if (filter_var($user_mail, FILTER_VALIDATE_EMAIL)) {

    $mail = new PHPMailer\PHPMailer\PHPMailer();
    try {
        $mail->CharSet = "UTF-8";

        $mail->setFrom("mail@rt-solar.ru", "Ростелеком Солар");

        $mail->addAddress("event@rt-solar.ru");
        $mail->addAddress("d.bobrova@rt-solar.ru");
        $mail->addAddress("i.zharkova@rt-solar.ru");
        $mail->addAddress("v.builova@rt-solar.ru");

        $mail->addCC("siterequest@rt-solar.ru");

        $mail->isHTML(true);
        $mail->Subject = $title;
        $mail->Body = $body;
        
        if ($mail->send()) {
            // Пишем в файл
            $file = '/var/www/html/rt-solar.ru/www/Closedatabase/newsolar.txt';

            // Открываем файл для получения существующего содержимого
            $current = file_get_contents($file);

            // Добавляем новые данные в файл
            $current .= "\n" . date("Y-m-d H:i") . ";" . $user_name . ";" . $user_company . ";" . $user_job . ";" . $user_phone . ";" . $user_mail;

            // Пишем содержимое обратно в файл
            file_put_contents($file, $current);
        } else {
            $result[] = "error";
        }
    } catch (Exception $e) {
        $result = "error";
        $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
    }

}else{
    $result = "error";
    $code = "email";
}
echo json_encode(["result" => $result, "status" => $status, "code" => $code]);