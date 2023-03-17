<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class RegisterController extends Controller
{
    function register(Request $request){
    
        $user= new User;
        $user->first_name = $request -> first_name ;
        $user->last_name = $request -> last_name;
        $user->email = $request->email;
        $user->password = $request->password;
        $user->save();


    return response()->json([
        "id"=>"$user->id",
        "first_name" => "$user->first_name",
        "last_name" => "$user->last_name",
        "email" => "$user->email",
        "password" => "$user->password",
        "success" => true

    ]);

}}