<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTranslationsTable extends Migration
{
    public function up()
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('transtable_type')->nullable();
            $table->string('transtable_id')->nullable();
            $table->string('values')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
