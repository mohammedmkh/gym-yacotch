<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoursesTable extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->nullable();
            $table->string('hours')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->string('discount')->nullable();
            $table->boolean('status')->default(0);
            $table->string('image')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
