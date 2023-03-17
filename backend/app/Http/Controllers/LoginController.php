<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    function login(Request $request){
        $email = $request->email;
        $password = $request->password;

        return response()->json([
            // "first_name" => "$first_name",
            "email" => "$email",
            "password" => "$password",

        ]);
    }
}
