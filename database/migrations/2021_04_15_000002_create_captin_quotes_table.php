<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinQuotesTable extends Migration
{
    public function up()
    {
        Schema::create('captin_quotes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('price')->nullable();
            $table->datetime('begin_time')->nullable();
            $table->datetime('end_time')->nullable();
            $table->string('checkout')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
