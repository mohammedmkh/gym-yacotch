<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToReportoncaptinsTable extends Migration
{
    public function up()
    {
        Schema::table('reportoncaptins', function (Blueprint $table) {
            $table->unsignedBigInteger('captin_id')->nullable();
            $table->foreign('captin_id', 'captin_fk_3643287')->references('id')->on('users');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_3643288')->references('id')->on('users');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->foreign('course_id', 'course_fk_3643289')->references('id')->on('courses');
        });
    }
}
