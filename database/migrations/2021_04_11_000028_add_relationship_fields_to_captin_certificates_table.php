<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToCaptinCertificatesTable extends Migration
{
    public function up()
    {
        Schema::table('captin_certificates', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_3643230')->references('id')->on('users');
        });
    }
}
