<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AllUsersController;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::post('get_user','getUser');

});
Route::controller(AllUsersController::class)->group(function () {
    Route::get('/users','getAllUsers');
    Route::get('/allfemaleusers', 'getAllFemaleDetails');
    Route::get('/allmaleusers', 'getAllMaleDetails');
    Route::get('/user/{id}', 'getUserById');
    Route::post('/user_details/{id}/{detail_id}','addUserDetails');
    Route::get('/user_gender/{id}','getUserGender');
    Route::post('/add_to_favorites/{id}','addToFavorites');
    Route::post('/send_message/{id}','sendMessage');
    Route::get('/get_message/{id}','getMessage');
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
