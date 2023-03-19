<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Detail;
use App\Models\Image;
use Illuminate\Http\Request;

class AllUsersController extends Controller
{
    function getAllUsers(){
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }

    function getUser($id){
        $user = User::find($id);
        return response()->json([
            "User" => $user
        ]);
    }

    

    function addUserDetails(Request $request,$id){
        $new_profile_pic = time() . '-' .$request->profile_pic . '.' . $request->profile_pic->extension();
        $request->profile_pic->move(public_path('images'),$new_profile_pic);
        
            $user = User::find($id); 
            $detail = new Detail;
            $detail->gender = $request->gender;
            $detail->description = $request->description;
            $detail->profile_pic = $new_profile_pic;
            $detail->location = $request->location;
            $detail->user_id = $user->id;
            $detail->save();
    
            return response()->json([
                "success" => true
            ]);
        }
        
    }

