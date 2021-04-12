<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToReportOntraineesTable extends Migration
{
    public function up()
    {
        Schema::table('report_ontrainees', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id', 'user_fk_3643296')->references('id')->on('users');
            $table->unsignedBigInteger('captin_id')->nullable();
            $table->foreign('captin_id', 'captin_fk_3643297')->references('id')->on('users');
        });
    }
}
