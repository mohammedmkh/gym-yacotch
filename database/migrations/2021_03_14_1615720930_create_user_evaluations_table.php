<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserEvaluationsTable extends Migration
{
    public function up()
    {
        Schema::create('user_evaluations', function (Blueprint $table) {

            $table->bigIncrements('id');

            $table->string('evaluation_no', 1)->default(0);
            $table->string('evaluation_text');
            $table->string('type', 4)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

        });
    }

    public function down()
    {
        Schema::dropIfExists('user_evaluations');
    }
}
