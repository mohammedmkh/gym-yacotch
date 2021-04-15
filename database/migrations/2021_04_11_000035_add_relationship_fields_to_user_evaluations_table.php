<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToUserEvaluationsTable extends Migration
{
    public function up()
    {
        Schema::table('user_evaluations', function (Blueprint $table) {
            $table->unsignedBigInteger('evaluated_user_id');
            $table->foreign('evaluated_user_id')->references('id')->on('users');

            $table->unsignedBigInteger('evaluator_user_id');
            $table->foreign('evaluator_user_id')->references('id')->on('users');



        });
    }
}
