<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptinCertificatesTable extends Migration
{
    public function up()
    {
        Schema::create('captin_certificates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('path')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
