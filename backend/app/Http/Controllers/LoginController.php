<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    function login(Request $request){
        $email = $request->email;
        $password = $request->password;

        if((User::where('email', '=', $email)->exists())){
            $user = User::where('email','like',$email) -> first();
            $hashed_password = $user -> password;
            echo $hashed_password;
            if(password_verify($password, $hashed_password)){
                return response()->json([
                    "email" => "$email",
                    "password" => "$password",
                    "success" => true]);}
            else{
                return response()->json([
                    "success" => false]);
                
            }}
        else{
            return response()->json([
                "success" => false
            ]);
        }
            
    }
}
