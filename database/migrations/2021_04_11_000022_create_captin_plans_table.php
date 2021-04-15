<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinPlansTable extends Migration
{
    public function up()
    {
        Schema::create('captin_plans', function (Blueprint $table) {
            $table->bigIncrements('id');

        });
    }
}
