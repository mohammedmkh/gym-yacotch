<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTraineeCoursesTable extends Migration
{
    public function up()
    {
        Schema::create('trainee_courses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('course')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }
}
