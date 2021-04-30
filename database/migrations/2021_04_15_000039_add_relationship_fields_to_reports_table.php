<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToReportsTable extends Migration
{
    public function up()
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->unsignedBigInteger('user_first_id')->nullable();
            $table->foreign('user_first_id')->references('id')->on('users');

            $table->unsignedBigInteger('user_second_id')->nullable();
            $table->foreign('user_second_id')->references('id')->on('users');

            $table->unsignedBigInteger('course_id')->nullable();
            $table->foreign('course_id')->references('id')->on('courses');
        });
    }
}
