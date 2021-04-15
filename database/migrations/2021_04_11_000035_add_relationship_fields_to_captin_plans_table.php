<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToCaptinPlansTable extends Migration
{
    public function up()
    {
        Schema::table('captin_plans', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('plan_id');
            $table->foreign('plan_id')->references('id')->on('plans');


        });
    }
}
