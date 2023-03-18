<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersInterestsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users_interests', function (Blueprint $table) {
            $table->foreignId('user_id')
            ->constrained('users_information')
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->foreignId('interest_id')
            ->constrained('interests')
            ->onUpdate('cascade')
            ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_interests');
    }
};
