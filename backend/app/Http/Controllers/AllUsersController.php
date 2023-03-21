<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Detail;
use App\Models\Favorite;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AllUsersController extends Controller
{
    function getAllUsers(){
        $users = User::all();
        return response()->json([
            "users" => $users
        ]);
    }

    function getAllFemaleDetails(){
        $users = DB::table('users')
        ->join('details', 'users.id', '=', 'details.user_id')
        ->select('users.id','users.name','users.last_name','details.gender','details.description','details.profile_pic','details.location','details.date_of_birth')
        ->where('details.gender','=','female')
        ->get();
        return response()->json([
            "users" => $users
        ]);
    }
    function getAllMaleDetails(){
        $users = DB::table('users')
        ->join('details', 'users.id', '=', 'details.user_id')
        ->select('users.id','users.name','users.last_name','details.gender','details.description','details.profile_pic','details.location','details.date_of_birth')
        ->where('details.gender','=','male')
        ->get();
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

    function getUserGender($id){
        $user = User::find($id);
        $gender = $user->detail->gender;
        return response()->json([
            "user" => $user
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
            $detail->profile_pic = 'http://127.0.0.1:8000/storage/images/'. $profile_pic_name;
            $detail->location = $request->location;
            $detail->date_of_birth = $request->age;
            $detail->user_id = $user->id;
            $detail->save();
    
            return response()->json([
                "success" => true
            ]);
        }

    function addToFavorites(Request $request,$id){
        $favorite = new Favorite();
        $user = User::find($id);
        $favorite->user_id = $user->id;
        $favorite->user_id_liked = $request->id;
        $favorite->save();

        return response()->json([
            "favorite" => true
        ]);
    }
    function sendMessage(Request $request,$id){
        $message = new Message();
        $user = User::find($id);
        $message->sender = $user->id;
        $message->receiver = $request->receiver_id;
        $message->message = $request->message;
        $message->save();

        return response()->json([
            "sent" => true
        ]);
    }
        
    }

