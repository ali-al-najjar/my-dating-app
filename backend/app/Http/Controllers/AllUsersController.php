<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Detail;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AllUsersController extends Controller
{
    function getAllUsers(){
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }

    function getUserById($id){
        $user = User::find($id);
        return response()->json([
            "User" => $user
        ]);
    }

    

    function addUserDetails(Request $request,$id,$id_detail){
        if($id_detail == "add"){
            $detail = new Detail;
        }else{
            $detail = Detail::find($id_detail);
        }
        $user = User::find($id); 
        $extension = $request->image_extension;
        $profile_pic = $request->profile_pic_encoded;  // your base64 encoded
        $profile_pic = str_replace('data:image/'.$extension.';base64,', '', $profile_pic);
        $profile_pic = str_replace(' ', '+', $profile_pic);
        $image = base64_decode($profile_pic);
        $profile_pic_name = time() . '-' .$user->name . '.' . $extension;
        Storage::disk('public')->put('images/'. $profile_pic_name,$image);

            
            $detail->gender = $request->gender;
            $detail->description = $request->description;
            $detail->profile_pic = 'images/'. $profile_pic_name;
            $detail->location = $request->location;
            $detail->user_id = $user->id;
            $detail->save();
    
            return response()->json([
                "success" => true
            ]);
        }


        
    }

