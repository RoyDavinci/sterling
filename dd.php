<?php

require './newlog.php';
require './dbConn.php';
//remember to change to conn

$http_origin = $_SERVER["HTTP_ORIGIN"];

if (
    $http_origin == "http://localhost:3001" ||
    $http_origin == "https://loripay.com" ||
    $http_origin  == "https://smsportal.approot.ng"
) {
    header("Access-Control-Allow-Origin: $http_origin");
}


//header("Access-Control-Allow-Origin: http://localhost:3001 , https://loripay.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

//session_start();

header("Content-Type: application/json");

// Read the JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true); // true parameter to decode as an associative array


$content = print_r($data, true);

// wh_log($content);
log_action($content, $logFile);


// Check JSON input for username and password
$json_username = isset($data['username']) ? $data['username'] : null;
$json_password = isset($data['password']) ? $data['password'] : null;


$request_username = isset($_REQUEST['username']) ? $_REQUEST['username'] : null;
$request_password = isset($_REQUEST['password']) ? $_REQUEST['password'] : null;


// Validate that we have username and password from either source
if (($json_username && $json_password) || ($request_username && $request_password)) {
    // Determine the source of the username and password
    $username = $json_username ?: $request_username;
    $password = $json_password ?: $request_password;
    $request = ['username' => $username];
    $content = print_r($request, true);

    // wh_log($content);
    log_action($content, $logFile);
    if (!$username || !$password) {
        $response = [
            'error' => 'Missing Parameters',
            'status' => "400"
        ];
        $conn->close();
        header('Content-Type: application/json');
        //$conn->close();
        echo json_encode($response);
        exit();
    }
    $username = filter_var($username, FILTER_UNSAFE_RAW);

    $password = filter_var($password, FILTER_UNSAFE_RAW);

    $query = "SELECT * FROM users where username = '$username'";

    $result = $conn->query($query);
    $content = print_r($result, true);

    // wh_log($content);
    log_action($content, $logFile);

    $resultsArray = array();
    if ($result) {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $resultsArray[] = $row;
            }
        } else {
            $response = [
                'error' => 'Username incorrect',
                'status' => "400"
            ];
            $conn->close();
            header('Content-Type: application/json');
            //$conn->close();
            echo json_encode($response);
            exit();
        }
    } else {
        $response = [
            'error' => $result,
            'status' => "400"
        ];
        $conn->close();
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
    $content = print_r('here', true);

    // wh_log($content);
    log_action($content, $logFile);
    $hashedPassword = $resultsArray[0]['password'];
    $content = print_r($hashedPassword, true);
    $email = $resultsArray[0]['email'];
    // wh_log($content);
    log_action($content, $logFile);

    if ($password == $hashedPassword) {
        $string = generateRandomString();
        $token = base64_encode($string);
        $_SESSION["auth_token"] = $token;
        $otp = generateRandomNumbersString();
        $content = print_r($otp, true);

        // wh_log($content);
        log_action($content, $logFile);

        $query = "UPDATE users SET otp = '$otp' WHERE username = '$username'";
        $emailAction =  sendMail($otp, $email);
        if ($emailAction) {
            $content = print_r($query, true);
            log_action($content, $logFile);
            //$conn->close();

            $result = $conn->query($query);
            $content = print_r($result, true);
            log_action($content, $logFile);
            $conn->close();
            $response = [
                'token' => $token,
                'status' => "200"
            ];
            header('Content-Type: application/json');

            echo json_encode($response);
            // Send the token as a response to the React app
            exit();
        } else {
            $response = [
                'error' => 'OTP Delivery failed',
                'status' => "400"
            ];
            $conn->close();
            header('Content-Type: application/json');
            //$conn->close();
            echo json_encode($response);
            exit();
        }
    } else {
        $response = [
            'error' => 'incorrect password',
            'status' => "400"
        ];
        $conn->close();
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
} else {
    $response = [
        'error' => 'Missing Parameters',
        'status' => "400"
    ];
    $conn->close();
    header('Content-Type: application/json');
    //$conn->close();
    echo json_encode($response);
    exit();
}

function generateRandomString($length = 10)
{
    return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length / strlen($x)))), 1, $length);
}

function sendMail($otp, $email)
{

    $emails = ["emsthias33@gmail.com", "ussdandsmsbanking@ubagroup.com"];


    $status = "<html><body><h1>Your Secure Login OTP</h1><br/><br/><p>Dear User,</p><p>For your security, never share your OTP with anyone, including company representatives.</p><p>This OTP is for your login verification and should be used only on the official login page.</p><p><strong>OTP:</strong> $otp</p></body></html>";

    //foreach ($emails as $email) {
    $data = array(
        'From' => 'support@ringo.ng',
        "To" => $email,
        'Subject' => 'Login OTP',
        'HtmlBody' => $status,
    );
    $data_string = json_encode($data);


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.postmarkapp.com/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");

    $headers = [
        'X-Postmark-Server-Token: 604ccef6-7866-499c-9f25-674eed0dc35a',
        'Content-Type: application/json',
        'Accept: application/json'
    ];
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $result = curl_exec($ch);
    curl_close($ch);
    $response = json_decode($result);
    //var_dump($response);
    $content = print_r($response, true);
    log_action($content, $logFile);
    if ($response) {
        //  echo '<br />';
        //  echo '<br />';
        //  echo 'Mail sent successfully' . $result;
        //  echo '<br />';
        //  echo '<br />';
        return true;
    } else {
        return false;
        // echo 'Error: Mail not send' . $result . $response;
    }
    //      }
}


function generateRandomNumbersString()
{
    $result = '';
    for ($i = 0; $i < 6; $i++) {
        $result .= rand(0, 9); // Append a random number between 0 and 9 to the result string
    }
    return $result;
}
