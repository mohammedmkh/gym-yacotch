<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsCaptinsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews_captins', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('review')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
