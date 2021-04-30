<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToAdverticesTable extends Migration
{
    public function up()
    {
        Schema::table('advertices', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id')->nullable();
            $table->foreign('course_id', 'cource_fk_3643238')->references('id')->on('courses');
        });
    }
}
