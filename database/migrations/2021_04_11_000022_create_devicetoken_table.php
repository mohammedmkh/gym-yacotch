<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeviceTokenTable extends Migration
{
    public function up()
    {
        Schema::create('devicetoken', function (Blueprint $table) {

            $table->bigIncrements('id');
            $table->string('device_type');
            $table->string('device_token', '500');
            $table->timestamps();
            $table->softDeletes();
            });
    }
}
