<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinsTable extends Migration
{
    public function up()
    {
        Schema::create('captins', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('bio')->nullable();
            $table->string('identify')->nullable();
            $table->string('cv')->nullable();
            $table->string('hours_cost')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
