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

    Route::get('/users', [AllUsersController::class, "getAllUsers"]);
    Route::get('/user/{id}', [AllUsersController::class, "getUserById"]);
    Route::post('/user_details/{id}', [AllUsersController::class, "addUserDetails"]);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
