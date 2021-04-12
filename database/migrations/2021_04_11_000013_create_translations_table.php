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
            $table->string('nametable')->nullable();
            $table->string('nametableid')->nullable();
            $table->string('values')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
