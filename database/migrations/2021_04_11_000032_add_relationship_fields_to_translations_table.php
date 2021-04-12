<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRelationshipFieldsToTranslationsTable extends Migration
{
    public function up()
    {
        Schema::table('translations', function (Blueprint $table) {
            $table->unsignedBigInteger('lang_id')->nullable();
            $table->foreign('lang_id', 'lang_fk_3643186')->references('id')->on('languages');
        });
    }
}
