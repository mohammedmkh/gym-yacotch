<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToCoursesTable extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->unsignedBigInteger('captin_id')->nullable();
            $table->foreign('captin_id', 'captin_fk_3643238')->references('id')->on('users');
            $table->unsignedBigInteger('plan_id')->nullable();
            $table->foreign('plan_id', 'plan_fk_3643240')->references('id')->on('plans');
            $table->unsignedBigInteger('trainee_id')->nullable();
            $table->foreign('trainee_id', 'trainee_fk_3643245')->references('id')->on('users');
        });
    }
}
