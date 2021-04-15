<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinVideosTable extends Migration
{
    public function up()
    {
        Schema::create('captin_videos', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('path');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
