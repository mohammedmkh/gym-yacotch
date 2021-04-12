<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToReviewsCaptinsTable extends Migration
{
    public function up()
    {
        Schema::table('reviews_captins', function (Blueprint $table) {
            $table->unsignedBigInteger('captin_id')->nullable();
            $table->foreign('captin_id', 'captin_fk_3643222')->references('id')->on('users');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_3643223')->references('id')->on('users');
        });
    }
}
