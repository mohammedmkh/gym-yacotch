<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsClinetsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews_clinets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('review')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
