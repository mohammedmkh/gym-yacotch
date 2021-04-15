<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuotesTable extends Migration
{
    public function up()
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('price')->nullable();
            $table->integer('long_months')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
