<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('captin_categories', function (Blueprint $table) {
            $table->bigIncrements('id');

        });
    }
}
