<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$request = json_decode(file_get_contents('php://input'), true);

// echo json_encode($request);

$mail = new PHPMailer(true);

$to = 'contato@ltco.com.br';
$from = 'noreply@ltco.com.br';
$nameCompany = 'LTCO';
$title = "[$nameCompany] Contato via formulário";

try {
  // Server settings
  $mail->isSMTP();
  $mail->CharSet = 'UTF-8';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted

  $mail->SMTPAuth = true;
  $mail->Host = 'smtp.teste.com';
  $mail->Port = 465;
  $mail->Username = 'apikey';
  $mail->Password = 'pass';

  //Recipients
  $mail->setFrom($from, $nameCompany);
  $mail->addAddress($to);

  // Content
  $mail->isHTML(true);
  $mail->Subject = $title;

  $ltco_html_body = null;

  foreach ( $request as $field ) {
    $ltco_html_body .= "<b>$field[0]</b>: $field[1]<br>";
  }

  $mail->Body = $ltco_html_body;

  $mail->send();

  $response = array(
    "ok" => true,
    "class" => "success",
    "message" => "Mensagem enviada com sucesso!"
  );

  echo json_encode($response);
} catch (Exception $e) {
  $response = array(
    "ok" => false,
    "class" => "danger",
    "message" => "Não foi possível enviar a mensagem. Tente novamente, mais tarde."
    // "message" => "Não foi possível enviar a mensagem. Mailer Error: {$mail->ErrorInfo}"
  );

  echo json_encode($response);
}
