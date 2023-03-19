<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyImagesTable  extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename("user_images", "images");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
