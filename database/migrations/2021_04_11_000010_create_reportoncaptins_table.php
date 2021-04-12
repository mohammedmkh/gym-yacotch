<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportoncaptinsTable extends Migration
{
    public function up()
    {
        Schema::create('reportoncaptins', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('text')->nullable();
            $table->datetime('date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
